package com.eduprajna.config;

/**
 * Centralized CORS configuration constants
 * All allowed origins for the application are defined here for easy maintenance
 */
public class CorsConfig {
    
    // Local development origins
    public static final String LOCALHOST_3000 = "http://localhost:3000";
    public static final String LOCALHOST_5173 = "http://localhost:5173"; // Vite dev server
    public static final String LOCALHOST_IP_3000 = "http://127.0.0.1:3000";
    public static final String LOCALHOST_IP_5173 = "http://127.0.0.1:5173";
    
    // Production frontend domains
    public static final String VERCEL_OLD = "https://nishmitha-pet-co.vercel.app";
    public static final String VERCEL_NEW = "https://pet-co-seven.vercel.app";
    public static final String PROD_DOMAIN_1 = "https://pet-cotraditional.in";
    public static final String PROD_DOMAIN_2 = "https://www.pet-cotraditional.in";
    
    // AWS EC2 origins
    public static final String AWS_EC2_HTTP = "http://ec2-13-202-136-219.ap-south-1.compute.amazonaws.com";
    public static final String AWS_EC2_HTTPS = "https://ec2-13-202-136-219.ap-south-1.compute.amazonaws.com";
    public static final String AWS_IP_HTTP = "http://13.202.136.219";
    public static final String AWS_IP_HTTPS = "https://13.202.136.219";
    
    // Current AWS deployment IP
    public static final String AWS_CURRENT_IP_HTTP = "https://petandco.in";
    public static final String AWS_CURRENT_IP_HTTPS = "https://petandco.in";
    
    // AWS S3 static website origins (for when you deploy frontend to S3)
    public static final String AWS_S3_BUCKET = "http://petco-frontend-static.s3-website.ap-south-1.amazonaws.com";
    public static final String AWS_S3_BUCKET_HTTPS = "https://petco-frontend-static.s3-website.ap-south-1.amazonaws.com";
    public static final String AWS_S3_ACTUAL = "http://pet-co.s3-website.ap-south-1.amazonaws.com";
    public static final String AWS_S3_ACTUAL_HTTPS = "https://pet-co.s3-website.ap-south-1.amazonaws.com";
    
    /**
     * All allowed origins for CORS configuration
     * Add new origins here when needed
     */
    public static final String[] ALLOWED_ORIGINS = {
        LOCALHOST_3000,
        LOCALHOST_5173,
        LOCALHOST_IP_3000,
        LOCALHOST_IP_5173,
        VERCEL_OLD,
        VERCEL_NEW,
        PROD_DOMAIN_1,
        PROD_DOMAIN_2,
        AWS_EC2_HTTP,
        AWS_EC2_HTTPS,
        AWS_IP_HTTP,
        AWS_IP_HTTPS,
        AWS_CURRENT_IP_HTTP,
        AWS_CURRENT_IP_HTTPS,
        AWS_S3_BUCKET,
        AWS_S3_BUCKET_HTTPS,
        AWS_S3_ACTUAL,
        AWS_S3_ACTUAL_HTTPS
    };
}