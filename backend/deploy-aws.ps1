# Deploy script for AWS EC2 backend (Windows PowerShell)

Write-Host "Building backend with updated CORS configuration..." -ForegroundColor Green

# Clean and build the project
Write-Host "Cleaning and building project..." -ForegroundColor Yellow
./mvnw.cmd clean package -DskipTests

Write-Host "Build complete!" -ForegroundColor Green
Write-Host "JAR file created at: target/pet-co-0.0.1-SNAPSHOT.jar" -ForegroundColor Cyan
Write-Host ""
Write-Host "To deploy to your AWS EC2 instance:" -ForegroundColor Yellow
Write-Host "1. Copy the JAR file to your EC2 instance using SCP or your preferred method" -ForegroundColor White
Write-Host "2. SSH to your EC2 instance and run the following commands:" -ForegroundColor White
Write-Host "   java -jar pet-co-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will be available at: http://ec2-13-202-136-219.ap-south-1.compute.amazonaws.com:8081" -ForegroundColor Green
Write-Host "Now configured to accept requests from: https://pet-co-seven.vercel.app" -ForegroundColor Green