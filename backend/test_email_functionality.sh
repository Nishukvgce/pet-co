#!/bin/bash

echo "Testing Email Functionality for PET&CO"
echo "======================================"

BASE_URL="http://localhost:8081/api"

echo ""
echo "1. Testing Order Status Update Email..."
echo "----------------------------------------"

# Test updating an order status (assuming order ID 1 exists)
curl -X POST "$BASE_URL/orders/admin/1/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}' \
  --verbose

echo ""
echo ""
echo "2. Testing Service Booking Status Update Email..."
echo "------------------------------------------------"

# Test updating a service booking status (assuming booking ID 1 exists)
curl -X PATCH "$BASE_URL/service-bookings/1/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS", "notes": "Service started"}' \
  --verbose

echo ""
echo ""
echo "3. Testing Service Booking Status Update to COMPLETED..."
echo "-------------------------------------------------------"

curl -X PATCH "$BASE_URL/service-bookings/1/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "COMPLETED", "notes": "Service completed successfully"}' \
  --verbose

echo ""
echo ""
echo "Test completed. Check the application logs for email sending status."
echo "Also check the configured email account for received emails."