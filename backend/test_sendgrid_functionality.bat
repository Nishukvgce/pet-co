@echo off
echo Testing SendGrid Email Functionality for PET&CO
echo ===============================================

set BASE_URL=http://localhost:8081/api

echo.
echo 1. Testing SendGrid Configuration...
echo -----------------------------------

curl -X POST "%BASE_URL%/test/sendgrid-config" ^
  -H "Content-Type: application/json" ^
  --verbose

echo.
echo.
echo 2. Sending SendGrid Test Email...
echo ---------------------------------

curl -X POST "%BASE_URL%/test/send-sendgrid-test" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"nishmitha928@gmail.com\"}" ^
  --verbose

echo.
echo.
echo 3. Testing Order Status Update Email (via SendGrid)...
echo ----------------------------------------------------

curl -X POST "%BASE_URL%/orders/admin/1/status" ^
  -H "Content-Type: application/json" ^
  -d "{\"status\": \"processing\"}" ^
  --verbose

echo.
echo.
echo 4. Testing Service Booking Status Update Email (via SendGrid)...
echo --------------------------------------------------------------

curl -X PATCH "%BASE_URL%/service-bookings/1/status" ^
  -H "Content-Type: application/json" ^
  -d "{\"status\": \"IN_PROGRESS\", \"notes\": \"Service started\"}" ^
  --verbose

echo.
echo.
echo SendGrid Email Testing Completed!
echo =================================
echo.
echo Check your email inbox (nishmitha928@gmail.com) for:
echo - SendGrid test email
echo - Order status update email 
echo - Service booking status update email
echo.
echo If emails are not received, check:
echo 1. SendGrid API key is valid
echo 2. Sender email is verified in SendGrid
echo 3. Application logs for errors
echo 4. Spam/junk folder
echo.
pause