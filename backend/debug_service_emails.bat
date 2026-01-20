@echo off
echo ================================================================
echo                SERVICE EMAIL DEBUGGING SCRIPT
echo ================================================================
echo This script will test service email functionality
echo.

set BACKEND_URL=http://localhost:8080

echo 1. Testing Debug Email Status...
echo.
curl -X GET "%BACKEND_URL%/api/debug/email-status" ^
     -H "Content-Type: application/json" ^
     2>nul

echo.
echo.
echo 2. Testing Service Email (Grooming Service)...
echo ⚠️  IMPORTANT: Update the email address in this script before running!
echo.
curl -X POST "%BACKEND_URL%/api/debug/test-service-email" ^
     -H "Content-Type: application/json" ^
     -d "{\"serviceType\": \"GROOMING\", \"customerName\": \"Test Customer\", \"email\": \"nishmitha928@gmail.com\"}" ^
     2>nul

echo.
echo.
echo 3. Creating a test service booking...
echo.
curl -X POST "%BACKEND_URL%/api/service-bookings" ^
     -H "Content-Type: application/json" ^
     -d "{\"serviceType\": \"GROOMING\", \"customerName\": \"Debug Test\", \"email\": \"nishmitha928@gmail.com\", \"phone\": \"+1234567890\", \"petName\": \"TestPet\", \"petType\": \"Dog\", \"breed\": \"Golden Retriever\", \"requestedDate\": \"2024-12-20\", \"requestedTime\": \"10:00\", \"additionalNotes\": \"Test booking for email debugging\"}" ^
     2>nul

echo.
echo.
echo ================================================================
echo                     DEBUGGING COMPLETE
echo ================================================================
echo.
echo If emails are not being sent, check the Spring Boot console logs
echo for detailed debugging information starting with 📧, 📮, 📬, ✅, or ❌
echo.
echo To test with your actual email, replace "your-email@example.com" 
echo in this script with your real email address.
echo.
pause