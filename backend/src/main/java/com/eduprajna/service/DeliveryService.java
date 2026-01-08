package com.eduprajna.service;

import org.springframework.stereotype.Service;

@Service
public class DeliveryService {

    /**
     * Check if delivery is available for the given pincode.
     * Currently supports delivery only to Bangalore (pincodes starting with 560).
     * 
     * @param pincode The pincode to check
     * @return true if delivery is available, false otherwise
     */
    public boolean isDeliveryAvailable(String pincode) {
        if (pincode == null || pincode.trim().isEmpty()) {
            return false;
        }
        
        // Clean pincode (remove spaces, etc.)
        String cleanPincode = pincode.trim().replaceAll("\\s+", "");
        
        // Validate pincode format (should be 6 digits)
        if (!cleanPincode.matches("\\d{6}")) {
            return false;
        }
        
        // Check if pincode starts with 560 (Bangalore)
        return cleanPincode.startsWith("560");
    }

    /**
     * Get delivery information for a pincode
     * 
     * @param pincode The pincode to check
     * @return DeliveryInfo object with details
     */
    public DeliveryInfo getDeliveryInfo(String pincode) {
        boolean isAvailable = isDeliveryAvailable(pincode);
        
        if (isAvailable) {
            return new DeliveryInfo(
                true, 
                "Available", 
                "Standard delivery available in 3-5 business days",
                0.0, // Free delivery for 560xxx pincodes
                "3-5 business days"
            );
        } else {
            return new DeliveryInfo(
                false, 
                "Not Available", 
                "Sorry, delivery is currently not available in your area. We only deliver to Bangalore (560xxx) at the moment.",
                null,
                null
            );
        }
    }

    /**
     * Inner class to represent delivery information
     */
    public static class DeliveryInfo {
        private final boolean available;
        private final String status;
        private final String message;
        private final Double deliveryCharge;
        private final String estimatedTime;

        public DeliveryInfo(boolean available, String status, String message, Double deliveryCharge, String estimatedTime) {
            this.available = available;
            this.status = status;
            this.message = message;
            this.deliveryCharge = deliveryCharge;
            this.estimatedTime = estimatedTime;
        }

        public boolean isAvailable() { return available; }
        public String getStatus() { return status; }
        public String getMessage() { return message; }
        public Double getDeliveryCharge() { return deliveryCharge; }
        public String getEstimatedTime() { return estimatedTime; }
    }
}