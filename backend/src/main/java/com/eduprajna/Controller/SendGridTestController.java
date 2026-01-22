package com.eduprajna.Controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eduprajna.config.CorsConfig;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {CorsConfig.LOCALHOST_3000, CorsConfig.LOCALHOST_IP_3000, CorsConfig.VERCEL_NEW}, allowCredentials = "true")
@ConditionalOnProperty(name = "sendgrid.api.key")
public class SendGridTestController {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${app.email.from:PETCO <nishmitha928@gmail.com>}")
    private String fromEmail;

    @PostMapping("/sendgrid-config")
    public ResponseEntity<?> getSendGridConfig() {
        try {
            return ResponseEntity.ok(Map.of(
                "fromEmail", fromEmail,
                "apiKeyConfigured", sendGridApiKey != null && !sendGridApiKey.equals("your-sendgrid-api-key"),
                "apiKeyLength", sendGridApiKey != null ? sendGridApiKey.length() : 0,
                "apiKeyPreview", sendGridApiKey != null ? sendGridApiKey.substring(0, Math.min(10, sendGridApiKey.length())) + "..." : "not-set"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to get SendGrid config: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/send-sendgrid-test")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> body) {
        try {
            String toEmail = body.get("email");
            if (toEmail == null || toEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email address is required"));
            }

            // Extract email and name from "Name <email@domain.com>" format
            String extractedFromEmail = extractEmail(fromEmail);
            String fromName = extractName(fromEmail);

            Email from = new Email(extractedFromEmail, fromName);
            Email to = new Email(toEmail);
            String subject = "🧪 SendGrid Test Email from PET&CO";
            
            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>SendGrid Test Email</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
                        <h1 style="margin: 0; font-size: 24px;">🎉 SendGrid Test Email</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">Email functionality is working!</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
                        <h2 style="color: #6366f1; margin-top: 0;">✅ Success!</h2>
                        <p>This is a test email sent via SendGrid to verify email configuration.</p>
                        <p><strong>If you receive this email, SendGrid is working correctly!</strong></p>
                        
                        <div style="background: #e7f3ff; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>📧 Sent from:</strong> %s</p>
                            <p style="margin: 5px 0 0 0;"><strong>📅 Date:</strong> %s</p>
                        </div>
                        
                        <p style="margin-bottom: 0;">- PET&CO Development Team</p>
                    </div>
                    
                    <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
                        <p>This is a test email from PET&CO's email system.</p>
                    </div>
                </body>
                </html>
                """.formatted(fromEmail, new java.util.Date().toString());

            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            
            Response response = sg.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Test email sent successfully via SendGrid to " + toEmail,
                    "statusCode", response.getStatusCode(),
                    "from", fromEmail
                ));
            } else {
                return ResponseEntity.internalServerError().body(Map.of(
                    "error", "SendGrid API returned error",
                    "statusCode", response.getStatusCode(),
                    "body", response.getBody()
                ));
            }

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "IOException: " + e.getMessage(),
                "cause", e.getCause() != null ? e.getCause().getMessage() : "Unknown"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Failed to send test email: " + e.getMessage(),
                "cause", e.getCause() != null ? e.getCause().getMessage() : "Unknown"
            ));
        }
    }

    // Helper methods to extract email and name from "Name <email@domain.com>" format
    private String extractEmail(String fromEmail) {
        if (fromEmail.contains("<") && fromEmail.contains(">")) {
            return fromEmail.substring(fromEmail.indexOf("<") + 1, fromEmail.indexOf(">"));
        }
        return fromEmail;
    }

    private String extractName(String fromEmail) {
        if (fromEmail.contains("<")) {
            return fromEmail.substring(0, fromEmail.indexOf("<")).trim();
        }
        return "PETCO";
    }
}