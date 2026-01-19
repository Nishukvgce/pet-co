#!/bin/bash
# Deploy script for AWS EC2 backend

echo "Building backend with updated CORS configuration..."

# Clean and build the project
./mvnw clean package -DskipTests

echo "Build complete!"
echo "JAR file created at: target/pet-co-0.0.1-SNAPSHOT.jar"
echo ""
echo "To deploy to your AWS EC2 instance:"
echo "1. Copy the JAR file to your EC2 instance:"
echo "   scp target/pet-co-0.0.1-SNAPSHOT.jar ec2-user@ec2-13-202-136-219.ap-south-1.compute.amazonaws.com:/home/ec2-user/"
echo ""
echo "2. SSH to your EC2 instance and run:"
echo "   ssh ec2-user@ec2-13-202-136-219.ap-south-1.compute.amazonaws.com"
echo "   sudo systemctl stop your-app-service  # if you have a service setup"
echo "   java -jar pet-co-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod"
echo ""
echo "3. Or if using screen/tmux for background execution:"
echo "   screen -S pet-co-backend"
echo "   java -jar pet-co-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod"
echo "   # Press Ctrl+A then D to detach"