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
        PROD_DOMAIN_2
    };
}