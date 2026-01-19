# Deploy script for Vercel with production environment
Write-Host "Building and deploying frontend to Vercel with AWS backend configuration..." -ForegroundColor Green

# Verify environment variables
Write-Host "Current production API URL:" -ForegroundColor Yellow
Get-Content .env.production | Select-String "VITE_API_BASE_URL"

# Build the project with production environment variables
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

# Deploy to Vercel with environment variable override
Write-Host "Deploying to Vercel with correct environment..." -ForegroundColor Yellow
$env:VITE_API_BASE_URL = "http://ec2-13-202-136-219.ap-south-1.compute.amazonaws.com:8081/api"
vercel --prod --env VITE_API_BASE_URL="http://ec2-13-202-136-219.ap-south-1.compute.amazonaws.com:8081/api"

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Frontend: https://pet-co-seven.vercel.app" -ForegroundColor Cyan
Write-Host "Backend: http://ec2-13-202-136-219.ap-south-1.compute.amazonaws.com:8081/api" -ForegroundColor Cyan
Write-Host "Make sure your AWS EC2 backend is running!" -ForegroundColor Yellow