# Deploy to AWS S3 + CloudFront
Write-Host "🚀 Deploying Pet&Co Frontend to AWS..." -ForegroundColor Green

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
    Write-Host "✅ AWS CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not found. Please install AWS CLI first:" -ForegroundColor Red
    Write-Host "https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# S3 bucket name (change this to your bucket name)
$bucketName = "pet-co"

Write-Host "🌐 Deploying to S3 bucket: $bucketName" -ForegroundColor Yellow

# Create bucket if it doesn't exist
aws s3 mb s3://$bucketName --region ap-south-1 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ S3 bucket created: $bucketName" -ForegroundColor Green
} else {
    Write-Host "ℹ️  S3 bucket already exists or using existing: $bucketName" -ForegroundColor Cyan
}

# Enable static website hosting
Write-Host "🌍 Configuring static website hosting..." -ForegroundColor Yellow
aws s3 website s3://$bucketName --index-document index.html --error-document index.html

# Upload files with proper content types
Write-Host "📤 Uploading files..." -ForegroundColor Yellow

# Upload HTML files
aws s3 cp dist/ s3://$bucketName/ --recursive --exclude "*" --include "*.html" --content-type "text/html" --cache-control "no-cache"

# Upload CSS files
aws s3 cp dist/ s3://$bucketName/ --recursive --exclude "*" --include "*.css" --content-type "text/css" --cache-control "max-age=31536000"

# Upload JS files
aws s3 cp dist/ s3://$bucketName/ --recursive --exclude "*" --include "*.js" --content-type "application/javascript" --cache-control "max-age=31536000"

# Upload other assets
aws s3 cp dist/ s3://$bucketName/ --recursive --exclude "*.html" --exclude "*.css" --exclude "*.js" --cache-control "max-age=31536000"

# Make bucket publicly accessible for static hosting
Write-Host "🔓 Setting bucket policy for public access..." -ForegroundColor Yellow

$bucketPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$bucketName/*"
        }
    ]
}
"@

$bucketPolicy | aws s3api put-bucket-policy --bucket $bucketName --policy file:///dev/stdin

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "📍 Website URL: http://$bucketName.s3-website.ap-south-1.amazonaws.com" -ForegroundColor Cyan
Write-Host "🔗 Backend API: http://ec2-13-202-136-219.ap-south-1.compute.amazonaws.com:8081/api" -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Test your website at the URL above" -ForegroundColor White
Write-Host "2. Consider setting up CloudFront for better performance" -ForegroundColor White
Write-Host "3. Configure your custom domain if needed" -ForegroundColor White

Write-Host "`n⚡ For CloudFront setup, run: aws cloudfront create-distribution" -ForegroundColor Blue