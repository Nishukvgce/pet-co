package com.eduprajna.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.eduprajna.dto.ServiceBookingDTO;
import com.eduprajna.entity.Order;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

@Service
public class EmailService {

    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;

    @Value("${app.email.from:PETCO <nishmitha928@gmail.com>}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendServiceBookingConfirmation(ServiceBookingDTO booking) throws IOException {
        System.out.println("\n=== EMAIL SERVICE - BOOKING CONFIRMATION ===");
        System.out.println("📧 Attempting to send booking confirmation email...");
        System.out.println("📮 To: " + booking.getEmail());
        System.out.println("🎯 Booking ID: " + booking.getId());
        
        if (sendGridApiKey == null || sendGridApiKey.trim().isEmpty()) {
            System.err.println("❌ ERROR: SendGrid API key not configured. Skipping email.");
            System.err.println("⚠️  Configure sendgrid.api.key in application properties");
            return;
        }

        Email from = new Email(extractEmail(fromEmail), extractName(fromEmail));
        Email to = new Email(booking.getEmail());
        String subject = "🎉 Your Pet Grooming Appointment is Confirmed - PET&CO";
        Content content = new Content("text/html", createBookingConfirmationHtml(booking));
        
        Mail mail = new Mail(from, subject, to, content);
        
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            int statusCode = response.getStatusCode();
            if (statusCode == 202) {
                System.out.println("✅ SUCCESS: Email sent successfully!");
                System.out.println("📊 SendGrid Status: " + statusCode + " (Accepted)");
                System.out.println("📬 Email queued for delivery to " + booking.getEmail());
            } else if (statusCode >= 200 && statusCode < 300) {
                System.out.println("✅ SUCCESS: Email processed successfully!");
                System.out.println("📊 SendGrid Status: " + statusCode);
            } else {
                System.err.println("⚠️  WARNING: Unexpected status code: " + statusCode);
                System.err.println("📄 Response: " + response.getBody());
            }
        } catch (IOException ex) {
            System.err.println("❌ ERROR: Failed to send email - " + ex.getMessage());
            throw ex;
        }
        System.out.println("=== END EMAIL SERVICE ===");
    }

    public void sendOrderStatusUpdate(Order order, String oldStatus, String newStatus) throws IOException {
        System.out.println("\n=== EMAIL SERVICE - ORDER STATUS UPDATE ===");
        System.out.println("📧 Attempting to send order status update email...");
        System.out.println("🆔 Order ID: #" + order.getId());
        System.out.println("🔄 Status Change: '" + oldStatus + "' → '" + newStatus + "'");
        
        if (sendGridApiKey == null || sendGridApiKey.trim().isEmpty()) {
            System.err.println("❌ ERROR: SendGrid API key not configured. Skipping email.");
            System.err.println("⚠️  Configure sendgrid.api.key in application properties");
            return;
        }

        if (order.getUser() == null || order.getUser().getEmail() == null || order.getUser().getEmail().trim().isEmpty()) {
            System.out.println("⚠️  WARNING: No user email found for order #" + order.getId() + ". Skipping email.");
            return; // No email to send to
        }
        
        String userEmail = order.getUser().getEmail();
        System.out.println("📮 To: " + userEmail);
        System.out.println("👤 Customer: " + (order.getUser().getName() != null ? order.getUser().getName() : "Unknown"));

        Email from = new Email(extractEmail(fromEmail), extractName(fromEmail));
        Email to = new Email(userEmail);
        String subject = getOrderStatusSubject(newStatus) + " - PET&CO Order #" + order.getId();
        System.out.println("📝 Subject: " + subject);
        Content content = new Content("text/html", createOrderStatusUpdateHtml(order, oldStatus, newStatus));
        
        Mail mail = new Mail(from, subject, to, content);
        
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        
        try {
            System.out.println("📡 Sending email via SendGrid...");
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            int statusCode = response.getStatusCode();
            if (statusCode == 202) {
                System.out.println("✅ SUCCESS: Order status email sent successfully!");
                System.out.println("📊 SendGrid Status: " + statusCode + " (Accepted)");
                System.out.println("📬 Email queued for delivery to " + userEmail);
                System.out.println("🎯 Email will notify customer about order status change to '" + newStatus + "'");
            } else if (statusCode >= 200 && statusCode < 300) {
                System.out.println("✅ SUCCESS: Order status email processed successfully!");
                System.out.println("📊 SendGrid Status: " + statusCode);
            } else {
                System.err.println("⚠️  WARNING: Unexpected status code: " + statusCode);
                System.err.println("📄 Response: " + response.getBody());
            }
        } catch (IOException ex) {
            System.err.println("❌ ERROR: Failed to send order status email - " + ex.getMessage());
            System.err.println("📧 Customer will NOT receive notification about status change");
            throw ex;
        }
        System.out.println("=== END EMAIL SERVICE ===");
    }

    public void sendServiceStatusUpdate(ServiceBookingDTO booking, String oldStatus, String newStatus) throws IOException {
        System.out.println("\n=== EMAIL SERVICE - SERVICE STATUS UPDATE ===");
        System.out.println("📧 Attempting to send service status update email...");
        System.out.println("🆔 Booking ID: #" + booking.getId());
        System.out.println("🐶 Pet Name: " + booking.getPetName());
        System.out.println("🎆 Service Type: " + booking.getServiceType());
        System.out.println("🚫 Service Name: " + booking.getServiceName());
        System.out.println("🔄 Status Change: '" + oldStatus + "' → '" + newStatus + "'");
        
        if (sendGridApiKey == null || sendGridApiKey.trim().isEmpty()) {
            System.err.println("❌ ERROR: SendGrid API key not configured. Skipping email.");
            System.err.println("⚠️  Configure sendgrid.api.key in application properties");
            return;
        }

        String emailAddress = null;
        if (booking.getEmail() != null && !booking.getEmail().trim().isEmpty()) {
            emailAddress = booking.getEmail();
        }
        
        if (emailAddress == null) {
            System.out.println("⚠️  WARNING: No email address found for booking #" + booking.getId() + ". Skipping email.");
            return; // No email to send to
        }
        
        System.out.println("📮 To: " + emailAddress);
        System.out.println("👤 Customer: " + (booking.getOwnerName() != null ? booking.getOwnerName() : "Unknown"));

        Email from = new Email(extractEmail(fromEmail), extractName(fromEmail));
        Email to = new Email(emailAddress);
        String subject = getServiceStatusSubject(newStatus, booking.getServiceType()) + " - PET&CO Booking #" + booking.getId();
        System.out.println("📝 Subject: " + subject);
        Content content = new Content("text/html", createServiceStatusUpdateHtml(booking, oldStatus, newStatus));
        
        Mail mail = new Mail(from, subject, to, content);
        
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        
        try {
            System.out.println("📡 Sending service status email via SendGrid...");
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            int statusCode = response.getStatusCode();
            if (statusCode == 202) {
                System.out.println("✅ SUCCESS: Service status email sent successfully!");
                System.out.println("📊 SendGrid Status: " + statusCode + " (Accepted)");
                System.out.println("📬 Email queued for delivery to " + emailAddress);
                System.out.println("🎯 Email will notify customer about " + booking.getServiceType() + " service status change to '" + newStatus + "'");
            } else if (statusCode >= 200 && statusCode < 300) {
                System.out.println("✅ SUCCESS: Service status email processed successfully!");
                System.out.println("📊 SendGrid Status: " + statusCode);
            } else {
                System.err.println("⚠️  WARNING: Unexpected status code: " + statusCode);
                System.err.println("📄 Response: " + response.getBody());
            }
        } catch (IOException ex) {
            System.err.println("❌ ERROR: Failed to send service status email - " + ex.getMessage());
            System.err.println("📧 Customer will NOT receive notification about " + booking.getServiceType() + " service status change");
            throw ex;
        }
        System.out.println("=== END EMAIL SERVICE ===");
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

    private String getOrderStatusSubject(String status) {
        return switch (status.toLowerCase()) {
            case "pending" -> "📦 Order Received";
            case "processing" -> "⚡ Order Processing";
            case "shipped" -> "🚚 Order Shipped";
            case "delivered" -> "✅ Order Delivered";
            case "cancelled" -> "❌ Order Cancelled";
            default -> "📋 Order Status Update";
        };
    }

    private String getServiceStatusSubject(String status) {
        return switch (status.toUpperCase()) {
            case "CONFIRMED" -> "✅ Service Confirmed";
            case "IN_PROGRESS" -> "🔄 Service In Progress";
            case "COMPLETED" -> "🎉 Service Completed";
            case "CANCELLED" -> "❌ Service Cancelled";
            default -> "📋 Service Status Update";
        };
    }
    
    private String getServiceStatusSubject(String status, String serviceType) {
        String serviceIcon = getServiceTypeIcon(serviceType);
        return switch (status.toUpperCase()) {
            case "CONFIRMED" -> serviceIcon + " Service Confirmed";
            case "IN_PROGRESS" -> serviceIcon + " Service In Progress";
            case "COMPLETED" -> serviceIcon + " Service Completed";
            case "CANCELLED" -> "❌ Service Cancelled";
            default -> serviceIcon + " Service Status Update";
        };
    }
    
    private String getServiceTypeIcon(String serviceType) {
        if (serviceType == null) return "🐶";
        return switch (serviceType.toUpperCase()) {
            case "GROOMING" -> "✂️";
            case "WALKING", "PET_WALKING" -> "🚶";
            case "BOARDING", "PET_BOARDING" -> "🏠";
            case "TRAINING", "PET_TRAINING" -> "🎯";
            case "SITTING", "PET_SITTING" -> "🧑‍🐈";
            case "VETERINARY", "VET" -> "⚕️";
            case "DAYCARE", "PET_DAYCARE" -> "🏫";
            default -> "🐶";
        };
    }

    private String createOrderStatusUpdateHtml(Order order, String oldStatus, String newStatus) {
        String dashboardUrl = frontendUrl + "/user-account-dashboard";
        String statusMessage = getOrderStatusMessage(newStatus);
        String statusColor = getOrderStatusColor(newStatus);
        
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Status Update - PET&CO</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        background-color: #f8f9fa;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, %s 0%%, %s 100%%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                    }
                    .header p {
                        margin: 10px 0 0 0;
                        font-size: 16px;
                        opacity: 0.9;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .order-details {
                        background: #f8fafc;
                        border-radius: 8px;
                        padding: 24px;
                        margin: 24px 0;
                        border-left: 4px solid %s;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 12px;
                        padding: 8px 0;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                    }
                    .detail-label {
                        font-weight: 600;
                        color: #475569;
                    }
                    .detail-value {
                        color: #1e293b;
                        font-weight: 500;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-weight: 600;
                        text-transform: uppercase;
                        color: white;
                        background: %s;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #6366f1 0%%, #8b5cf6 100%%);
                        color: white !important;
                        text-decoration: none;
                        padding: 16px 32px;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        text-align: center;
                        margin: 24px 0;
                        transition: transform 0.2s;
                    }
                    .footer {
                        background: #f1f5f9;
                        padding: 30px;
                        text-align: center;
                        border-top: 1px solid #e2e8f0;
                    }
                    .footer p {
                        margin: 5px 0;
                        color: #64748b;
                        font-size: 14px;
                    }
                    .highlight {
                        color: %s;
                        font-weight: 600;
                    }
                    .price {
                        font-size: 18px;
                        font-weight: 700;
                        color: #059669;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>%s</h1>
                        <p>Order #%s</p>
                    </div>
                    
                    <div class="content">
                        <p>Hello <strong>%s</strong>,</p>
                        
                        <p>%s</p>
                        
                        <div style="text-align: center; margin: 24px 0;">
                            <span class="status-badge">%s</span>
                        </div>
                        
                        <div class="order-details">
                            <h3 style="margin-top: 0; color: #1e293b;">📦 Order Details</h3>
                            
                            <div class="detail-row">
                                <span class="detail-label">Order ID:</span>
                                <span class="detail-value">#%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Order Date:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Total Amount:</span>
                                <span class="detail-value price">₹%,.2f</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Payment Method:</span>
                                <span class="detail-value">%s</span>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" class="cta-button">
                                📱 View Order Details
                            </a>
                        </div>
                        
                        %s
                        
                        <p>Thank you for choosing <strong>PET&CO</strong>!</p>
                        
                        <p>Best regards,<br>
                        <strong>The PET&CO Team</strong></p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>PET&CO - Premium Pet Care Products</strong></p>
                        <p>📞 Contact us: +91-XXXXXXXXXX | ✉️ support@pet-co.com</p>
                        <p>🌐 Visit: <a href="%s" style="color: #6366f1;">www.pet-co.com</a></p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                statusColor, statusColor, statusColor, statusColor, statusColor,
                getOrderStatusSubject(newStatus), order.getId(),
                order.getUser().getName() != null ? order.getUser().getName() : "Valued Customer",
                statusMessage, newStatus.toUpperCase(),
                order.getId(), 
                order.getCreatedAt() != null ? order.getCreatedAt().toLocalDate().toString() : "N/A",
                order.getTotal() != null ? order.getTotal() : 0.0,
                order.getPaymentMethod() != null ? order.getPaymentMethod() : "N/A",
                dashboardUrl,
                getOrderStatusAdditionalInfo(newStatus),
                frontendUrl
            );
    }

    private String createServiceStatusUpdateHtml(ServiceBookingDTO booking, String oldStatus, String newStatus) {
        String dashboardUrl = frontendUrl + "/user-account-dashboard";
        String statusMessage = getServiceStatusMessage(newStatus);
        String statusColor = getServiceStatusColor(newStatus);
        
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Service Status Update - PET&CO</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        background-color: #f8f9fa;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, %s 0%%, %s 100%%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                    }
                    .header p {
                        margin: 10px 0 0 0;
                        font-size: 16px;
                        opacity: 0.9;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .booking-details {
                        background: #f8fafc;
                        border-radius: 8px;
                        padding: 24px;
                        margin: 24px 0;
                        border-left: 4px solid %s;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 12px;
                        padding: 8px 0;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                    }
                    .detail-label {
                        font-weight: 600;
                        color: #475569;
                    }
                    .detail-value {
                        color: #1e293b;
                        font-weight: 500;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-weight: 600;
                        text-transform: uppercase;
                        color: white;
                        background: %s;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #6366f1 0%%, #8b5cf6 100%%);
                        color: white !important;
                        text-decoration: none;
                        padding: 16px 32px;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        text-align: center;
                        margin: 24px 0;
                        transition: transform 0.2s;
                    }
                    .footer {
                        background: #f1f5f9;
                        padding: 30px;
                        text-align: center;
                        border-top: 1px solid #e2e8f0;
                    }
                    .footer p {
                        margin: 5px 0;
                        color: #64748b;
                        font-size: 14px;
                    }
                    .highlight {
                        color: %s;
                        font-weight: 600;
                    }
                    .price {
                        font-size: 18px;
                        font-weight: 700;
                        color: #059669;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>%s</h1>
                        <p>Booking #%s</p>
                    </div>
                    
                    <div class="content">
                        <p>Hello <strong>%s</strong>,</p>
                        
                        <p>%s</p>
                        
                        <div style="text-align: center; margin: 24px 0;">
                            <span class="status-badge">%s</span>
                        </div>
                        
                        <div class="booking-details">
                            <h3 style="margin-top: 0; color: #1e293b;">🐾 Booking Details</h3>
                            
                            <div class="detail-row">
                                <span class="detail-label">Pet Name:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Service:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Date:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Time:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">Total Amount:</span>
                                <span class="detail-value price">₹%,.2f</span>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" class="cta-button">
                                📱 View Booking Details
                            </a>
                        </div>
                        
                        %s
                        
                        <p>Thank you for choosing <strong>PET&CO</strong> for your pet's care!</p>
                        
                        <p>Best regards,<br>
                        <strong>The PET&CO Team</strong></p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>PET&CO - Premium Pet Care Services</strong></p>
                        <p>📞 Contact us: +91-XXXXXXXXXX | ✉️ support@pet-co.com</p>
                        <p>🌐 Visit: <a href="%s" style="color: #6366f1;">www.pet-co.com</a></p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                statusColor, statusColor, statusColor, statusColor, statusColor,
                getServiceStatusSubject(newStatus), booking.getId(),
                booking.getOwnerName(),
                statusMessage, newStatus.toUpperCase(),
                booking.getPetName(),
                booking.getServiceName(),
                booking.getPreferredDate() != null ? booking.getPreferredDate().toString() : "N/A",
                booking.getPreferredTime(),
                booking.getTotalAmount() != null ? booking.getTotalAmount() : 0.0,
                dashboardUrl,
                getServiceStatusAdditionalInfo(newStatus),
                frontendUrl
            );
    }

    private String getOrderStatusMessage(String status) {
        return switch (status.toLowerCase()) {
            case "pending" -> "We've received your order and are preparing it for processing.";
            case "processing" -> "Great news! Your order is being processed and packed with care.";
            case "shipped" -> "Your order is on its way! You'll receive tracking details soon.";
            case "delivered" -> "Your order has been delivered! We hope your pets love their new goodies.";
            case "cancelled" -> "Your order has been cancelled as requested. If this was unexpected, please contact us.";
            default -> "Your order status has been updated.";
        };
    }

    private String getServiceStatusMessage(String status) {
        return switch (status.toUpperCase()) {
            case "CONFIRMED" -> "Your service booking has been confirmed! Our team will be ready for your appointment.";
            case "IN_PROGRESS" -> "Our team is currently providing the service for your pet.";
            case "COMPLETED" -> "The service for your pet has been completed! We hope they enjoyed the experience.";
            case "CANCELLED" -> "Your service booking has been cancelled. If this was unexpected, please contact us.";
            default -> "Your service booking status has been updated.";
        };
    }

    private String getOrderStatusColor(String status) {
        return switch (status.toLowerCase()) {
            case "pending" -> "#f59e0b";
            case "processing" -> "#3b82f6";
            case "shipped" -> "#8b5cf6";
            case "delivered" -> "#10b981";
            case "cancelled" -> "#ef4444";
            default -> "#6366f1";
        };
    }

    private String getServiceStatusColor(String status) {
        return switch (status.toUpperCase()) {
            case "CONFIRMED" -> "#10b981";
            case "IN_PROGRESS" -> "#3b82f6";
            case "COMPLETED" -> "#059669";
            case "CANCELLED" -> "#ef4444";
            default -> "#6366f1";
        };
    }

    private String getOrderStatusAdditionalInfo(String status) {
        return switch (status.toLowerCase()) {
            case "pending" -> "<div style=\"background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;\">\n<p style=\"margin: 0; color: #92400e;\"><strong>📝 Next Steps:</strong> We're reviewing your order and will start processing it within 24 hours.</p>\n</div>";
            case "processing" -> "<div style=\"background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; margin: 24px 0;\">\n<p style=\"margin: 0; color: #1e40af;\"><strong>📦 Processing:</strong> Your items are being carefully packed and will ship soon.</p>\n</div>";
            case "shipped" -> "<div style=\"background: #ede9fe; border: 1px solid #8b5cf6; border-radius: 8px; padding: 16px; margin: 24px 0;\">\n<p style=\"margin: 0; color: #6b21a8;\"><strong>🚚 Shipped:</strong> Your order is on its way! Estimated delivery: 2-5 business days.</p>\n</div>";
            case "delivered" -> "<div style=\"background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin: 24px 0;\">\n<p style=\"margin: 0; color: #065f46;\"><strong>✅ Delivered:</strong> Enjoy your purchase! Don't forget to leave a review.</p>\n</div>";
            case "cancelled" -> "<div style=\"background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; padding: 16px; margin: 24px 0;\">\n<p style=\"margin: 0; color: #991b1b;\"><strong>❌ Cancelled:</strong> If you have any questions about this cancellation, please contact our support team.</p>\n</div>";
            default -> "";
        };
    }

    private String getServiceStatusAdditionalInfo(String status) {
        return switch (status.toUpperCase()) {
            case "CONFIRMED" -> "<div style=\"background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin: 24px 0;\">\n<p style=\"margin: 0; color: #065f46;\"><strong>✅ Confirmed:</strong> Please arrive 10-15 minutes early for your appointment.</p>\n</div>";
            case "IN_PROGRESS" -> "<div style=\"background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; margin: 24px 0;\">\n<p style=\"margin: 0; color: #1e40af;\"><strong>🔄 In Progress:</strong> Our team is currently providing excellent care for your pet.</p>\n</div>";
            case "COMPLETED" -> "<div style=\"background: #d1fae5; border: 1px solid #059669; border-radius: 8px; padding: 16px; margin: 24px 0;\">\n<p style=\"margin: 0; color: #065f46;\"><strong>🎉 Completed:</strong> Service completed successfully! We hope your pet enjoyed the experience.</p>\n</div>";
            case "CANCELLED" -> "<div style=\"background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; padding: 16px; margin: 24px 0;\">\n<p style=\"margin: 0; color: #991b1b;\"><strong>❌ Cancelled:</strong> If you need to reschedule, please contact our support team.</p>\n</div>";
            default -> "";
        };
    }

    private String createBookingConfirmationHtml(ServiceBookingDTO booking) {
        String dashboardUrl = frontendUrl + "/user-account-dashboard";
        
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmed - PET&CO</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        background-color: #f8f9fa;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                    }
                    .header p {
                        margin: 10px 0 0 0;
                        font-size: 16px;
                        opacity: 0.9;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .booking-details {
                        background: #f8fafc;
                        border-radius: 8px;
                        padding: 24px;
                        margin: 24px 0;
                        border-left: 4px solid #6366f1;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 12px;
                        padding: 8px 0;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                    }
                    .detail-label {
                        font-weight: 600;
                        color: #475569;
                    }
                    .detail-value {
                        color: #1e293b;
                        font-weight: 500;
                    }
                    .cta-button {
                        display: inline-block;
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                        color: white !important;
                        text-decoration: none;
                        padding: 16px 32px;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        text-align: center;
                        margin: 24px 0;
                        transition: transform 0.2s;
                    }
                    .cta-button:hover {
                        transform: translateY(-2px);
                    }
                    .footer {
                        background: #f1f5f9;
                        padding: 30px;
                        text-align: center;
                        border-top: 1px solid #e2e8f0;
                    }
                    .footer p {
                        margin: 5px 0;
                        color: #64748b;
                        font-size: 14px;
                    }
                    .highlight {
                        color: #6366f1;
                        font-weight: 600;
                    }
                    .price {
                        font-size: 20px;
                        font-weight: 700;
                        color: #059669;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Booking Confirmed!</h1>
                        <p>Your pet's grooming appointment is all set</p>
                    </div>
                    
                    <div class="content">
                        <p>Hello <strong>%s</strong>,</p>
                        
                        <p>Great news! Your pet grooming appointment has been <span class="highlight">confirmed</span>. We're excited to pamper <strong>%s</strong>!</p>
                        
                        <div class="booking-details">
                            <h3 style="margin-top: 0; color: #1e293b;">📋 Appointment Details</h3>
                            
                            <div class="detail-row">
                                <span class="detail-label">🐾 Pet Name:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">🐱/🐶 Pet Type:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">✨ Service:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">📅 Date:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">🕐 Time:</span>
                                <span class="detail-value">%s</span>
                            </div>
                            
                            <div class="detail-row">
                                <span class="detail-label">💰 Total Amount:</span>
                                <span class="detail-value price">₹%,.2f</span>
                            </div>
                        </div>
                        
                        <p>Our grooming experts will take excellent care of your furry friend. We'll contact you if we need any additional information.</p>
                        
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="%s" class="cta-button">
                                📱 View My Dashboard
                            </a>
                        </div>
                        
                        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 24px 0;">
                            <p style="margin: 0; color: #92400e;"><strong>📍 Important:</strong> Please bring your pet 10-15 minutes early for the appointment. If you need to reschedule, please contact us at least 24 hours in advance.</p>
                        </div>
                        
                        <p>Thank you for choosing <strong>PET&CO</strong> for your pet's grooming needs!</p>
                        
                        <p>Best regards,<br>
                        <strong>The PET&CO Team</strong></p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>PET&CO - Premium Pet Care Services</strong></p>
                        <p>📞 Contact us: +91-XXXXXXXXXX | ✉️ support@pet-co.com</p>
                        <p>🌐 Visit: <a href="%s" style="color: #6366f1;">www.pet-co.com</a></p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                booking.getOwnerName(),
                booking.getPetName(),
                booking.getPetName(),
                booking.getPetType().substring(0, 1).toUpperCase() + booking.getPetType().substring(1),
                booking.getServiceName(),
                booking.getPreferredDate().toString(),
                booking.getPreferredTime(),
                booking.getTotalAmount(),
                dashboardUrl,
                frontendUrl
            );
    }
}