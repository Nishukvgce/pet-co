# AWS Environment Setup for Pet&Co Backend (Windows PowerShell)
# This script provides commands to set environment variables on AWS EC2

Write-Host "🚀 Pet&Co AWS Environment Setup Guide" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

Write-Host "`n📋 STEP 1: SSH to your AWS EC2 instance" -ForegroundColor Yellow
Write-Host "ssh ec2-user@13.126.182.89" -ForegroundColor White

Write-Host "`n📧 STEP 2: Set Email Configuration (SendGrid)" -ForegroundColor Yellow
Write-Host "Add these to ~/.bashrc:" -ForegroundColor Cyan
Write-Host "export SENDGRID_API_KEY='SG.xxxxxxxxxxxx'" -ForegroundColor White
Write-Host "export EMAIL_FROM='PETCO <your-verified-email@domain.com>'" -ForegroundColor White

Write-Host "`n💳 STEP 3: Set Payment Configuration (Razorpay)" -ForegroundColor Yellow
Write-Host "Add these to ~/.bashrc:" -ForegroundColor Cyan
Write-Host "export RAZORPAY_KEY_ID='rzp_live_xxxxxxxxxxxx'" -ForegroundColor White
Write-Host "export RAZORPAY_KEY_SECRET='your_razorpay_secret'" -ForegroundColor White

Write-Host "`n📷 STEP 4: Set Image Storage Configuration (Cloudinary)" -ForegroundColor Yellow
Write-Host "Add these to ~/.bashrc:" -ForegroundColor Cyan
Write-Host "export CLOUDINARY_CLOUD_NAME='your_cloud_name'" -ForegroundColor White
Write-Host "export CLOUDINARY_API_KEY='your_api_key'" -ForegroundColor White
Write-Host "export CLOUDINARY_API_SECRET='your_api_secret'" -ForegroundColor White

Write-Host "`n🔧 STEP 5: Apply Changes" -ForegroundColor Yellow
Write-Host "nano ~/.bashrc" -ForegroundColor White
Write-Host "# Add all export statements above" -ForegroundColor Gray
Write-Host "source ~/.bashrc" -ForegroundColor White

Write-Host "`n🚀 STEP 6: Rebuild and Deploy" -ForegroundColor Yellow
Write-Host "# Kill existing process" -ForegroundColor Gray
Write-Host "pkill -f 'pet-co'" -ForegroundColor White
Write-Host "# Start with production profile" -ForegroundColor Gray
Write-Host "nohup java -jar pet-co-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod > app.log 2>&1 &" -ForegroundColor White

Write-Host "`n✅ STEP 7: Verify Setup" -ForegroundColor Green
Write-Host "curl http://13.126.182.89:8081/api/test/health" -ForegroundColor White
Write-Host "curl http://13.126.182.89:8081/api/admin/products/customer" -ForegroundColor White

Write-Host "`n⚠️  IMPORTANT SETUP REQUIREMENTS:" -ForegroundColor Red
Write-Host "1. SendGrid API Key: Get from https://sendgrid.com/" -ForegroundColor White
Write-Host "2. Razorpay Keys: Get from https://dashboard.razorpay.com/" -ForegroundColor White
Write-Host "3. Cloudinary Account: Sign up at https://cloudinary.com/" -ForegroundColor White
Write-Host "4. Verify sender email in SendGrid" -ForegroundColor White
Write-Host "5. EC2 Security Group: Allow port 8081 inbound" -ForegroundColor White

Write-Host "`n🔍 Common Issues & Solutions:" -ForegroundColor Cyan
Write-Host "- CORS errors: Rebuild backend after IP changes" -ForegroundColor White
Write-Host "- Images not loading: Set up Cloudinary properly" -ForegroundColor White
Write-Host "- Payments failing: Check Razorpay key configuration" -ForegroundColor White
Write-Host "- Emails not sending: Verify SendGrid API key and sender email" -ForegroundColor White