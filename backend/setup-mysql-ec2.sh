#!/bin/bash
# Install and setup MySQL on AWS EC2

echo "🔧 Installing MySQL on EC2..."

# Update system
sudo yum update -y

# Install MySQL
sudo yum install mysql-server -y

# Start MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Get temporary root password (if any)
echo "📋 Getting MySQL initial setup..."
sudo grep 'temporary password' /var/log/mysqld.log | tail -1

# Setup MySQL database and user
echo "🔐 Setting up MySQL database..."
sudo mysql -e "
CREATE DATABASE IF NOT EXISTS petco;
CREATE USER IF NOT EXISTS 'petco'@'localhost' IDENTIFIED BY 'Nishu@123';
GRANT ALL PRIVILEGES ON petco.* TO 'petco'@'localhost';
FLUSH PRIVILEGES;
"

echo "✅ MySQL setup complete!"
echo "Database: petco"
echo "User: petco" 
echo "Password: Nishu@123"
echo ""
echo "🚀 Now you can run your application:"
echo "java -jar pet-co.jar"