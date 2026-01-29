package com.eduprajna.service;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

/**
 * S3 Image Service
 * 
 * This service handles image uploads to AWS S3 bucket.
 * It provides methods to upload and delete images from S3.
 * 
 * Key features:
 * - Validates image file types before upload
 * - Generates unique filenames using UUID
 * - Organizes files in folders (products/, services/, etc.)
 * - Returns S3 URLs for database storage
 * - Handles image deletion for cleanup
 */
@Service
@ConditionalOnBean(S3Client.class)
public class S3ImageService {

    private static final Logger log = LoggerFactory.getLogger(S3ImageService.class);

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    private final S3Client s3Client;

    // Allowed image file extensions
    private static final Set<String> ALLOWED_EXTENSIONS = new HashSet<>(Arrays.asList(
            "jpg", "jpeg", "png", "gif", "webp", "avif", "bmp"
    ));

    public S3ImageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Upload image to S3 bucket for products
     */
    public String uploadProductImage(MultipartFile file) throws IOException {
        return uploadImage(file, "products");
    }

    /**
     * Upload image to S3 bucket for services
     */
    public String uploadServiceImage(MultipartFile file) throws IOException {
        return uploadImage(file, "services");
    }

    /**
     * Generic image upload method
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("File name is null");
        }

        String fileExtension = getFileExtension(originalFilename);
        if (!isValidImageType(fileExtension)) {
            throw new IllegalArgumentException("Only image files are allowed: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        // Generate unique filename
        String fileName = folder + "/" + UUID.randomUUID() + "_" + originalFilename;

        log.info("Uploading image to S3: {}", fileName);

        try {
            // Create S3 put request
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            // Upload to S3
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            // Generate S3 URL
            String s3Url = String.format("https://%s.s3.%s.amazonaws.com/%s", 
                                       bucketName, region, fileName);

            log.info("Successfully uploaded image to S3: {}", s3Url);
            return s3Url;

        } catch (Exception e) {
            log.error("Failed to upload image to S3: {}", e.getMessage(), e);
            throw new IOException("Failed to upload image to S3: " + e.getMessage(), e);
        }
    }

    /**
     * Delete image from S3 bucket
     */
    public void deleteImage(String s3Url) {
        if (s3Url == null || s3Url.isEmpty()) {
            return;
        }

        try {
            // Extract the key from S3 URL
            String key = extractKeyFromUrl(s3Url);
            if (key != null) {
                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();

                s3Client.deleteObject(deleteObjectRequest);
                log.info("Successfully deleted image from S3: {}", key);
            }
        } catch (Exception e) {
            log.error("Failed to delete image from S3: {}", e.getMessage(), e);
        }
    }

    /**
     * Extract file key from S3 URL
     */
    private String extractKeyFromUrl(String s3Url) {
        try {
            // Expected format: https://bucket.s3.region.amazonaws.com/key
            String[] parts = s3Url.split("/");
            if (parts.length >= 4) {
                // Join all parts after the domain
                return String.join("/", Arrays.copyOfRange(parts, 3, parts.length));
            }
        } catch (Exception e) {
            log.warn("Could not extract key from S3 URL: {}", s3Url);
        }
        return null;
    }

    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot > 0 && lastDot < filename.length() - 1) {
            return filename.substring(lastDot + 1).toLowerCase();
        }
        return "";
    }

    /**
     * Validate if file type is an allowed image type
     */
    private boolean isValidImageType(String extension) {
        return ALLOWED_EXTENSIONS.contains(extension.toLowerCase());
    }

    /**
     * Get the bucket name (for debugging/logging)
     */
    public String getBucketName() {
        return bucketName;
    }
}