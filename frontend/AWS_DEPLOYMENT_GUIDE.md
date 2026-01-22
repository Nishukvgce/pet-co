# AWS Deployment Guide

## Build Files Ready
Your `dist/` folder contains all production-ready files:
- `index.html`
- `assets/` (CSS, JS, images)
- `favicon.ico`, `manifest.json`, `robots.txt`

## AWS Deployment Options

### Option 1: S3 + CloudFront (Recommended)
```bash
# Install AWS CLI if not installed
# aws configure (set your credentials)

# Create S3 bucket
aws s3 mb s3://your-petco-frontend-bucket

# Upload dist folder contents
aws s3 sync dist/ s3://your-petco-frontend-bucket --delete

# Enable static website hosting
aws s3 website s3://your-petco-frontend-bucket --index-document index.html --error-document index.html

# Create CloudFront distribution for global CDN
```

### Option 2: EC2 with Nginx
```bash
# On your EC2 instance
sudo apt update
sudo apt install nginx

# Copy dist files to nginx directory
sudo cp -r dist/* /var/www/html/

# Configure nginx for SPA routing
sudo nano /etc/nginx/sites-available/default
```

Nginx configuration for SPA:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 3: Amplify (Easiest)
1. Push your code to GitHub
2. Connect to AWS Amplify
3. Set build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```

## Environment Variables
Make sure your production environment points to your AWS backend:
```
VITE_API_BASE_URL=http://your-aws-backend-url:8081/api
```

## Quick Deploy Script
Create `deploy-aws-s3.ps1`:
```powershell
# Build the project
npm run build

# Sync to S3 (replace with your bucket name)
aws s3 sync dist/ s3://your-petco-frontend-bucket --delete

Write-Host "Deployed to AWS S3!" -ForegroundColor Green
```