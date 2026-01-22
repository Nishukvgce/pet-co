#!/bin/bash

# Frontend S3 Deployment Script
echo "🚀 Starting S3 deployment..."

# Build the project first
echo "📦 Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Sync to S3 bucket (replace files)
echo "☁️ Uploading to S3..."
aws s3 sync dist/ s3://pet-co --delete

# Check if upload was successful
if [ $? -eq 0 ]; then
    echo "🎉 Deployment completed successfully!"
    echo "🌐 Your website is available at: http://pet-co.s3-website.ap-south-1.amazonaws.com"
else
    echo "❌ Upload failed!"
    exit 1
fi