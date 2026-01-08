#!/bin/bash

# Test script to verify pincode saving functionality with 560xxx validation
# This script tests the profile update endpoint directly

echo "Testing Profile Update with Pincode Validation..."

# Test 1: Valid Bangalore pincode (560001)
echo "Test 1: Valid Bangalore pincode (560001) for admin@petco.com"
curl -X PUT "http://localhost:8080/auth/profile?email=admin@petco.com" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "pincode": "560001"
  }' \
  -w "\nStatus Code: %{http_code}\n\n"

# Test 2: Valid Bangalore pincode (560454)
echo "Test 2: Valid Bangalore pincode (560454) for nishu@gmail.com"
curl -X PUT "http://localhost:8080/auth/profile?email=nishu@gmail.com" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nishu",
    "pincode": "560454"
  }' \
  -w "\nStatus Code: %{http_code}\n\n"

# Test 3: Invalid pincode (not Bangalore - 110001)
echo "Test 3: Invalid pincode (110001 - Delhi) for nishu@gmail.com"
curl -X PUT "http://localhost:8080/auth/profile?email=nishu@gmail.com" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nishu",
    "pincode": "110001"
  }' \
  -w "\nStatus Code: %{http_code}\n\n"

# Test 4: Invalid pincode format (12345)
echo "Test 4: Invalid pincode format (12345) for nishu@gmail.com"
curl -X PUT "http://localhost:8080/auth/profile?email=nishu@gmail.com" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nishu",
    "pincode": "12345"
  }' \
  -w "\nStatus Code: %{http_code}\n\n"

# Test 5: Get updated profile to verify save
echo "Test 5: Getting updated profile for nishu@gmail.com"
curl -X GET "http://localhost:8080/auth/profile?email=nishu@gmail.com" \
  -H "Content-Type: application/json" \
  -w "\nStatus Code: %{http_code}\n\n"

echo "Tests completed. Check backend console for DEBUG logs."
echo "Expected results:"
echo "- Tests 1 and 2 should return 200 (success)"
echo "- Tests 3 and 4 should return 400 (validation error)"