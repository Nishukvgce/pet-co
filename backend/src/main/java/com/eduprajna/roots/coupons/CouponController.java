package com.eduprajna.roots.coupons;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.eduprajna.service.UserService;
import com.eduprajna.entity.User;
import com.eduprajna.repository.CheckoutSelectionRepository;
import com.eduprajna.entity.CheckoutSelection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {
    private static final Logger logger = LoggerFactory.getLogger(CouponController.class);

    private final CouponService service;
    private final UserService userService;
    private final CheckoutSelectionRepository selectionRepo;

    public CouponController(CouponService service, UserService userService, CheckoutSelectionRepository selectionRepo) {
        this.service = service; this.userService = userService; this.selectionRepo = selectionRepo;
    }

    @GetMapping
    public List<Coupon> list() { return service.listAll(); }

    @PostMapping
    public Coupon create(@RequestBody Coupon c) { return service.create(c); }

    @PutMapping("/{id}")
    public Coupon update(@PathVariable Long id, @RequestBody Coupon c) { return service.update(id, c); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }

    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody Map<String, Object> payload) {
        String code = (String) payload.getOrDefault("code", "");
        double subtotal = ((Number) payload.getOrDefault("subtotal", 0)).doubleValue();
        String petType = (String) payload.getOrDefault("petType", null);
        String category = (String) payload.getOrDefault("category", null);
        String subcategory = (String) payload.getOrDefault("subcategory", null);
        // Try to resolve userId if passed either as userId or email
        Long userId = null;
        if (payload.containsKey("userId") && payload.get("userId") instanceof Number) {
            userId = ((Number) payload.get("userId")).longValue();
        } else if (payload.containsKey("email") && payload.get("email") instanceof String) {
            String email = ((String) payload.get("email")).trim();
            if (!email.isEmpty()) {
                User u = userService.findByEmail(email).orElse(null);
                if (u != null) userId = u.getId();
            }
        }

        CouponService.ValidationResult vr = service.validate(code, subtotal, petType, category, subcategory, LocalDateTime.now(), userId);
        if (!vr.isValid()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "reason", vr.getReason()));
        }
        return ResponseEntity.ok(Map.of(
                "valid", true,
                "discount", vr.getDiscount(),
                "coupon", Map.of(
                        "code", vr.getCoupon().getCode(),
                        "description", vr.getCoupon().getDescription(),
                        "discountType", vr.getCoupon().getDiscountType(),
                        "value", vr.getCoupon().getValue()
                )
        ));
    }

    /**
     * Apply a coupon for a logged-in user and persist to CheckoutSelection.
     * This both validates and stores the coupon on the server so redemption can be recorded at order time.
     */
    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody Map<String, Object> payload) {
        String code = (String) payload.getOrDefault("code", "");
        double subtotal = ((Number) payload.getOrDefault("subtotal", 0)).doubleValue();
        String petType = (String) payload.getOrDefault("petType", null);
        String category = (String) payload.getOrDefault("category", null);
        String subcategory = (String) payload.getOrDefault("subcategory", null);

        // resolve user
        User user = null;
        if (payload.containsKey("userId") && payload.get("userId") instanceof Number) {
            Long uid = ((Number) payload.get("userId")).longValue();
            user = userService.findById(uid).orElse(null);
        } else if (payload.containsKey("email") && payload.get("email") instanceof String) {
            String email = ((String) payload.get("email")).trim();
            if (!email.isEmpty()) user = userService.findByEmail(email).orElse(null);
        }

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("valid", false, "reason", "User login required to apply coupon"));
        }

        CouponService.ValidationResult vr = service.validate(code, subtotal, petType, category, subcategory, LocalDateTime.now(), user.getId());
        if (!vr.isValid()) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "reason", vr.getReason()));
        }

        // compute shipping by threshold (₹50 below 500)
        double shippingFee = (subtotal >= 500.0) ? 0.0 : 50.0;
        double discount = vr.getDiscount();
        double total = Math.max(0.0, subtotal + shippingFee - discount);

        try {
            final User finalUser = user;
            CheckoutSelection selection = selectionRepo.findByUser(finalUser).orElseGet(() -> {
                CheckoutSelection s = new CheckoutSelection();
                s.setUser(finalUser);
                s.setDeliveryOption("standard");
                s.setPaymentMethod("cod");
                return s;
            });
            selection.setCouponCode(code);
            selection.setSubtotal(subtotal);
            selection.setShippingFee(shippingFee);
            selection.setTotal(total);
            selectionRepo.save(selection);
            logger.info("Applied coupon {} for user {} saved to checkout selection", code, user.getEmail());
        } catch (Exception e) {
            logger.warn("Failed to persist coupon to checkout selection: {}", e.getMessage());
        }

        return ResponseEntity.ok(Map.of("valid", true, "discount", discount, "subtotal", subtotal, "shippingFee", shippingFee, "total", total));
    }
}
