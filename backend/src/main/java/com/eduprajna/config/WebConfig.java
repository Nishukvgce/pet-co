package com.eduprajna.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Serve files from project uploads directory at /uploads/** URL pattern
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("classpath:/static/uploads/", "file:./uploads/");
        
        // Also serve files from runtime uploads directory for admin product images
        registry.addResourceHandler("/admin/products/images/**")
                .addResourceLocations("file:./uploads/", "classpath:/static/uploads/");
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://3.110.55.100",
                                          "http://3.110.55.100:*",
                                   "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
                
        // Additional mapping for uploads and static resources
        registry.addMapping("/uploads/**")
                .allowedOrigins(CorsConfig.ALLOWED_ORIGINS)
                .allowedMethods("GET", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}
