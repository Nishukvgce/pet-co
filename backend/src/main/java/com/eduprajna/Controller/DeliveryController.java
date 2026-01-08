package com.eduprajna.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eduprajna.service.DeliveryService;
import com.eduprajna.service.UserService;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "https://nishmitha-pet-co.vercel.app"}, allowCredentials = "true")
public class DeliveryController {
    
    private final DeliveryService deliveryService;
    private final UserService userService;

    public DeliveryController(DeliveryService deliveryService, UserService userService) {
        this.deliveryService = deliveryService;
        this.userService = userService;
    }

    /**
     * Check if delivery is available for a pincode
     */
    @GetMapping("/check/{pincode}")
    public ResponseEntity<?> checkDelivery(@PathVariable String pincode) {
        try {
            DeliveryService.DeliveryInfo deliveryInfo = deliveryService.getDeliveryInfo(pincode);
            return ResponseEntity.ok(Map.of(
                "pincode", pincode,
                "available", deliveryInfo.isAvailable(),
                "status", deliveryInfo.getStatus(),
                "message", deliveryInfo.getMessage(),
                "deliveryCharge", deliveryInfo.getDeliveryCharge(),
                "estimatedTime", deliveryInfo.getEstimatedTime()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to check delivery availability",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Update user's pincode
     */
    @PostMapping("/update-pincode")
    public ResponseEntity<?> updateUserPincode(@RequestParam("email") String email, @RequestBody Map<String, String> body) {
        try {
            String pincode = body.get("pincode");
            
            if (pincode == null || pincode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Pincode is required"));
            }
            
            // Validate pincode format
            String cleanPincode = pincode.trim().replaceAll("\\s+", "");
            if (!cleanPincode.matches("\\d{6}")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Please enter a valid 6-digit pincode"));
            }
            
            return userService.findByEmail(email)
                .<ResponseEntity<?>>map(user -> {
                    user.setPincode(cleanPincode);
                    userService.save(user);
                    
                    // Also return delivery info for the pincode
                    DeliveryService.DeliveryInfo deliveryInfo = deliveryService.getDeliveryInfo(cleanPincode);
                    
                    return ResponseEntity.ok(Map.of(
                        "message", "Pincode updated successfully",
                        "pincode", cleanPincode,
                        "deliveryInfo", Map.of(
                            "available", deliveryInfo.isAvailable(),
                            "status", deliveryInfo.getStatus(),
                            "message", deliveryInfo.getMessage(),
                            "deliveryCharge", deliveryInfo.getDeliveryCharge(),
                            "estimatedTime", deliveryInfo.getEstimatedTime()
                        )
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "User not found")));
                
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to update pincode",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Get user's current pincode and delivery info
     */
    @GetMapping("/user-pincode")
    public ResponseEntity<?> getUserPincode(@RequestParam("email") String email) {
        try {
            return userService.findByEmail(email)
                .<ResponseEntity<?>>map(user -> {
                    String pincode = user.getPincode();
                    
                    if (pincode == null || pincode.trim().isEmpty()) {
                        return ResponseEntity.ok(Map.of(
                            "pincode", null,
                            "deliveryInfo", Map.of(
                                "available", false,
                                "status", "No Pincode Set",
                                "message", "Please set your pincode to check delivery availability"
                            )
                        ));
                    }
                    
                    DeliveryService.DeliveryInfo deliveryInfo = deliveryService.getDeliveryInfo(pincode);
                    
                    return ResponseEntity.ok(Map.of(
                        "pincode", pincode,
                        "deliveryInfo", Map.of(
                            "available", deliveryInfo.isAvailable(),
                            "status", deliveryInfo.getStatus(),
                            "message", deliveryInfo.getMessage(),
                            "deliveryCharge", deliveryInfo.getDeliveryCharge(),
                            "estimatedTime", deliveryInfo.getEstimatedTime()
                        )
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "User not found")));
                
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Failed to get user pincode",
                "message", e.getMessage()
            ));
        }
    }
}