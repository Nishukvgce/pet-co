# AWS S3 Image Storage Implementation

## Overview
Your pet-co project now uses AWS S3 as the primary image storage solution. Images are uploaded to S3, and only the URLs are stored in the database.

## Architecture Flow

### When a new product/service image is uploaded:
```
Frontend → Backend API → S3 Bucket → S3 URL → Database
```

1. **Frontend** sends image via multipart form data
2. **Backend** receives the image and uploads to S3
3. **S3** stores the image and returns a URL
4. **Database** stores only the S3 URL (not the image file)

## Implementation Details

### ✅ Step 1: AWS S3 Dependency Added
- Added `software.amazon.awssdk:s3:2.29.15` to [pom.xml](backend/pom.xml)

### ✅ Step 2: Configuration Setup
- Added S3 settings to [application.properties](backend/src/main/resources/application.properties):
  ```properties
  aws.region=ap-south-1
  aws.s3.bucket=database-images-pet-co
  ```

### ✅ Step 3: S3 Configuration Bean
- Created [S3Config.java](backend/src/main/java/com/eduprajna/config/S3Config.java)
- Uses IAM role authentication (no access keys in code)

### ✅ Step 4: S3 Image Service
- Created [S3ImageService.java](backend/src/main/java/com/eduprajna/service/S3ImageService.java) with:
  - Image validation (file type checking)
  - UUID-based unique filenames
  - Folder organization (products/, services/)
  - Error handling and logging
  - Image deletion capabilities

### ✅ Step 5: Controller Integration
- Updated [ProductController.java](backend/src/main/java/com/eduprajna/Controller/ProductController.java):
  - S3 as primary storage method
  - Cloudinary as fallback
  - Local storage as final fallback
  - Maintains backward compatibility

## Storage Priority Order

1. **Primary**: AWS S3 (production)
2. **Fallback**: Cloudinary (existing backup)
3. **Final Fallback**: Local storage (development)

## File Organization in S3

```
database-images-pet-co/
├── products/
│   ├── uuid1_product-image.jpg
│   ├── uuid2_product-image.png
│   └── ...
└── services/
    ├── uuid3_service-image.jpg
    └── ...
```

## Database Storage

Only S3 URLs are stored in the database:
```sql
-- Example stored URLs
imageUrl = 'https://database-images-pet-co.s3.ap-south-1.amazonaws.com/products/uuid_image.jpg'
```

## Key Features

### ✅ Image Validation
- Only allows image file types: jpg, jpeg, png, gif, webp, avif, bmp
- Content validation before upload

### ✅ Duplicate Prevention
- Content-based hash checking
- Prevents uploading identical images

### ✅ Error Handling
- Graceful fallbacks if S3 fails
- Detailed logging for debugging

### ✅ Scalability
- No local storage issues
- No server rebuild image loss
- Cloud-based storage

## Environment Variables

For deployment, set these environment variables:

```bash
# AWS Configuration (if not using IAM roles)
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# S3 Configuration (optional overrides)
AWS_REGION=ap-south-1
AWS_S3_BUCKET=database-images-pet-co
```

## IAM Permissions Required

Your EC2 instance or deployment environment needs these S3 permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::database-images-pet-co/*"
        }
    ]
}
```

## Testing

### Manual Testing
1. Start your backend application
2. Upload a product image via admin panel
3. Check that the image URL in database starts with `https://database-images-pet-co.s3.amazonaws.com/`
4. Verify the image is accessible via the S3 URL

### Logs to Monitor
- Look for "Successfully uploaded image to S3" messages
- Watch for any S3 upload failures and fallback usage

## Benefits

✅ **No Server Storage**: Images don't consume EC2 disk space
✅ **No Rebuild Loss**: Images persist through deployments
✅ **Scalable**: Handles unlimited images
✅ **Fast**: CDN-backed S3 URLs for quick loading
✅ **Secure**: IAM role-based access
✅ **Cost-Effective**: Pay only for storage used

## Migration Notes

- Existing Cloudinary images will continue working
- New uploads will go to S3 first
- Gradual migration without breaking existing functionality