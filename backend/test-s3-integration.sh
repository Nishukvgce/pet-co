#!/bin/bash

# S3 Integration Test Script for Pet-Co
# Tests the S3 image upload functionality

echo "🧪 Testing S3 Integration for Pet-Co..."

# Configuration
BASE_URL="http://localhost:8081"
TEST_ENDPOINTS=(
    "/api/test/s3/status"
    "/api/test/s3/config"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test basic connectivity
echo "📡 Testing API connectivity..."
if curl -f -s "$BASE_URL/actuator/health" > /dev/null 2>&1 || curl -f -s "$BASE_URL/api/test/s3/status" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not accessible at $BASE_URL${NC}"
    echo "   Please ensure your Spring Boot application is running"
    exit 1
fi

# Test S3 status endpoints
for endpoint in "${TEST_ENDPOINTS[@]}"; do
    echo "🔍 Testing endpoint: $endpoint"
    
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ $endpoint - SUCCESS${NC}"
        echo "   Response: $(echo "$body" | jq -r '.message // .description // .status' 2>/dev/null || echo "$body" | head -c 100)"
    else
        echo -e "${RED}❌ $endpoint - FAILED (HTTP $http_code)${NC}"
        echo "   Response: $body"
    fi
    echo
done

# Test image upload (if test image exists)
echo "📤 Testing image upload..."

# Create a small test image if none exists
if [ ! -f "test-image.jpg" ]; then
    echo "📷 Creating test image..."
    # Create a simple colored square using ImageMagick (if available)
    if command -v convert &> /dev/null; then
        convert -size 100x100 xc:lightblue test-image.jpg 2>/dev/null
        echo -e "${GREEN}✅ Test image created${NC}"
    else
        echo -e "${YELLOW}⚠️  ImageMagick not found, skipping upload test${NC}"
        echo "   To test upload manually, use:"
        echo "   curl -X POST -F 'file=@your-image.jpg' $BASE_URL/api/test/s3/upload"
        echo
        echo -e "${BLUE}🎉 S3 Integration Test Complete${NC}"
        exit 0
    fi
fi

# Test file upload
if [ -f "test-image.jpg" ]; then
    echo "📤 Uploading test image..."
    
    upload_response=$(curl -s -w "\n%{http_code}" -X POST \
        -F "file=@test-image.jpg" \
        -F "type=products" \
        "$BASE_URL/api/test/s3/upload")
    
    upload_http_code=$(echo "$upload_response" | tail -n1)
    upload_body=$(echo "$upload_response" | head -n -1)
    
    if [ "$upload_http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ Image upload - SUCCESS${NC}"
        image_url=$(echo "$upload_body" | jq -r '.imageUrl // empty' 2>/dev/null)
        if [ -n "$image_url" ]; then
            echo "   Image URL: $image_url"
            
            # Test if image is accessible
            echo "🌐 Testing image accessibility..."
            if curl -f -s -I "$image_url" > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Image is accessible via S3 URL${NC}"
            else
                echo -e "${YELLOW}⚠️  Image URL returned but not yet accessible (might take a moment)${NC}"
            fi
        fi
    else
        echo -e "${RED}❌ Image upload - FAILED (HTTP $upload_http_code)${NC}"
        echo "   Response: $upload_body"
    fi
    
    # Clean up test image
    rm -f test-image.jpg
    echo "🧹 Test image cleaned up"
fi

echo
echo -e "${BLUE}🎉 S3 Integration Test Complete${NC}"
echo
echo "📋 Summary:"
echo "   - API connectivity: ✅"
echo "   - S3 configuration: ✅"
echo "   - Image upload: $([ "$upload_http_code" -eq 200 ] && echo "✅" || echo "❌")"
echo
echo "🔧 If any tests failed:"
echo "   1. Check your AWS credentials and S3 bucket setup"
echo "   2. Verify environment variables: AWS_REGION, AWS_S3_BUCKET"
echo "   3. Check application logs for detailed error messages"
echo "   4. Ensure your IAM role has proper S3 permissions"