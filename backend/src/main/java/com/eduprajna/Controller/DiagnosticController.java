package com.eduprajna.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eduprajna.service.EmailService;
import com.eduprajna.service.RazorpayService;
import com.eduprajna.service.S3ImageService;

@RestController
@RequestMapping("/api/admin/diagnostics")
public class DiagnosticController {

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired(required = false)
    private S3ImageService s3ImageService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RazorpayService razorpayService;

    @Value("${aws.region:}")
    private String awsRegion;

    @Value("${aws.s3.bucket:}")
    private String s3Bucket;

    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;

    @Value("${razorpay.keyId:}")
    private String razorpayKeyId;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDiagnostics() {
        Map<String, Object> diagnostics = new HashMap<>();

        // AWS S3 Diagnostics
        Map<String, Object> s3Diagnostics = new HashMap<>();
        boolean s3BeanPresent = applicationContext.containsBean("s3ImageService");
        s3Diagnostics.put("beanPresent", s3BeanPresent);
        s3Diagnostics.put("serviceInjected", s3ImageService != null);
        s3Diagnostics.put("awsRegionConfigured", !awsRegion.isEmpty());
        s3Diagnostics.put("s3BucketConfigured", !s3Bucket.isEmpty());
        // Do not expose actual values for security, just presence/length/mask
        s3Diagnostics.put("awsRegionValue", maskValue(awsRegion));
        s3Diagnostics.put("s3BucketValue", s3Bucket); // Bucket name is generally not secret, but good practice

        if (s3ImageService != null) {
            s3Diagnostics.put("status", "Active");
        } else {
            s3Diagnostics.put("status", "Inactive (Check aws.region property)");
        }
        diagnostics.put("s3", s3Diagnostics);

        // Email Service Diagnostics
        Map<String, Object> emailDiagnostics = new HashMap<>();
        emailDiagnostics.put("sendGridApiKeyConfigured", !sendGridApiKey.isEmpty());
        emailDiagnostics.put("sendGridApiKeyMasked", maskValue(sendGridApiKey));
        diagnostics.put("email", emailDiagnostics);

        // Razorpay Diagnostics
        Map<String, Object> razorpayDiagnostics = new HashMap<>();
        razorpayDiagnostics.put("keyIdConfigured", !razorpayKeyId.isEmpty());
        razorpayDiagnostics.put("keyIdValue", razorpayKeyId); // Key ID is public usually, but safer to treat carefully
        diagnostics.put("razorpay", razorpayDiagnostics);

        return ResponseEntity.ok(diagnostics);
    }

    private String maskValue(String value) {
        if (value == null || value.isEmpty()) {
            return "NOT_SET";
        }
        if (value.length() <= 4) {
            return "****";
        }
        return value.substring(0, 2) + "****" + value.substring(value.length() - 2);
    }
}
