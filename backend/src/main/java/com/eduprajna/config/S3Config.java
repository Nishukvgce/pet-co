package com.eduprajna.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

/**
 * AWS S3 Configuration
 * 
 * This configuration sets up the S3Client bean for connecting to AWS S3.
 * Uses IAM role authentication when deployed on EC2 (no access keys needed).
 * For local development, AWS credentials should be configured via:
 * - AWS CLI: aws configure
 * - Environment variables: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
 * - AWS credentials file: ~/.aws/credentials
 * 
 * This configuration is conditional and only loads when aws.region property is defined.
 */
@Configuration
@ConditionalOnProperty(name = "aws.region")
public class S3Config {

    @Value("${aws.region}")
    private String region;

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .build();
    }
}