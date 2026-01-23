#!/bin/bash
# AWS Environment Setup Script for Pet&Co Backend
# This script sets up all required environment variables for production deployment

echo "🚀 Setting up Pet&Co Backend Environment Variables for AWS..."

# Database Configuration (already configured in application-prod.properties)
echo "✅ Database configuration: Already set in application-prod.properties"

# Set Email Configuration (SendGrid)
echo "📧 Setting up Email Configuration..."
echo "Please set the following environment variables in your AWS EC2 instance:"
echo ""
echo "export SENDGRID_API_KEY='your_sendgrid_api_key_here'"
echo "export EMAIL_FROM='PETCO <your-verified-email@domain.com>'"

# Set Payment Configuration (Razorpay)
echo ""
echo "💳 Setting up Payment Configuration..."
echo "export RAZORPAY_KEY_ID='your_razorpay_key_id_here'"
echo "export RAZORPAY_KEY_SECRET='your_razorpay_key_secret_here'"

# Image Storage Configuration
echo ""
echo "📷 Setting up Image Storage..."
echo "export CLOUDINARY_CLOUD_NAME='your_cloudinary_cloud_name'"
echo "export CLOUDINARY_API_KEY='your_cloudinary_api_key'"
echo "export CLOUDINARY_API_SECRET='your_cloudinary_api_secret'"

echo ""
echo "🔧 To apply these environment variables:"
echo "1. SSH to your EC2 instance:"
echo "   ssh ec2-user@13.126.182.89"
echo ""
echo "2. Add these variables to your ~/.bashrc or ~/.profile:"
echo "   nano ~/.bashrc"
echo ""
echo "3. Add the export statements above to the file"
echo ""
echo "4. Reload the environment:"
echo "   source ~/.bashrc"
echo ""
echo "5. Restart your application with production profile:"
echo "   java -jar pet-co-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod"

echo ""
echo "⚠️  IMPORTANT NOTES:"
echo "1. Get SendGrid API key from https://sendgrid.com/docs/ui/account-and-settings/api-keys/"
echo "2. Get Razorpay keys from https://dashboard.razorpay.com/app/keys"
echo "3. Set up Cloudinary account at https://cloudinary.com/ for image storage"
echo "4. Verify sender email in SendGrid before sending emails"
echo "5. Make sure your EC2 security group allows inbound traffic on port 8081"

echo ""
echo "🔍 To test after setup:"
echo "curl http://13.126.182.89:8081/api/test/health"