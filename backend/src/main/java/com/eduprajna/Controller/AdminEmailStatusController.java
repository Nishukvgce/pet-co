package com.eduprajna.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eduprajna.config.CorsConfig;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {CorsConfig.LOCALHOST_3000, CorsConfig.LOCALHOST_5173, CorsConfig.VERCEL_NEW}, allowCredentials = "true")
public class AdminEmailStatusController {

    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;

    @Value("${app.email.from:}")
    private String fromEmail;

    @GetMapping("/email-status")
    public ResponseEntity<?> getEmailStatus() {
        boolean emailConfigured = sendGridApiKey != null && !sendGridApiKey.trim().isEmpty() && 
                                 !sendGridApiKey.equals("your-sendgrid-api-key");
        
        return ResponseEntity.ok(Map.of(
            "emailConfigured", emailConfigured,
            "fromEmail", fromEmail,
            "apiKeyPresent", sendGridApiKey != null && !sendGridApiKey.trim().isEmpty(),
            "status", emailConfigured ? "✅ EMAIL SYSTEM ACTIVE" : "❌ EMAIL NOT CONFIGURED",
            "message", emailConfigured ? 
                "Order and service status emails will be sent to customers" : 
                "Configure SendGrid API key to enable email notifications"
        ));
    }
}