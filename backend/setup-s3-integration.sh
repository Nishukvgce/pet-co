#!/bin/bash

# AWS S3 Setup Script for Pet-Co Project
# This script sets up the S3 bucket and IAM permissions for image storage

echo "🚀 Setting up AWS S3 for Pet-Co Image Storage..."

# Configuration
BUCKET_NAME="database-images-pet-co"
REGION="ap-south-1"
IAM_ROLE_NAME="pet-co-s3-role"
IAM_POLICY_NAME="pet-co-s3-policy"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Not logged in to AWS. Run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured"

# Create S3 bucket
echo "📦 Creating S3 bucket: $BUCKET_NAME"
if aws s3api create-bucket --bucket $BUCKET_NAME --region $REGION --create-bucket-configuration LocationConstraint=$REGION; then
    echo "✅ S3 bucket created successfully"
else
    echo "⚠️  S3 bucket might already exist or creation failed"
fi

# Set bucket versioning (optional but recommended)
echo "🔄 Enabling versioning on S3 bucket"
aws s3api put-bucket-versioning --bucket $BUCKET_NAME --versioning-configuration Status=Enabled

# Set bucket public access block (for security)
echo "🔒 Setting bucket security policies"
aws s3api put-public-access-block --bucket $BUCKET_NAME --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# Create IAM policy for S3 access
echo "📋 Creating IAM policy: $IAM_POLICY_NAME"
cat > /tmp/s3-policy.json << EOF
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
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::$BUCKET_NAME"
        }
    ]
}
EOF

# Create the IAM policy
POLICY_ARN=$(aws iam create-policy --policy-name $IAM_POLICY_NAME --policy-document file:///tmp/s3-policy.json --query 'Policy.Arn' --output text 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ IAM policy created: $POLICY_ARN"
else
    echo "⚠️  IAM policy might already exist"
    POLICY_ARN=$(aws iam list-policies --scope Local --query "Policies[?PolicyName=='$IAM_POLICY_NAME'].Arn" --output text)
fi

# Create IAM role for EC2 (if needed)
echo "👤 Creating IAM role for EC2: $IAM_ROLE_NAME"
cat > /tmp/trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "ec2.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

aws iam create-role --role-name $IAM_ROLE_NAME --assume-role-policy-document file:///tmp/trust-policy.json &> /dev/null

# Attach policy to role
if [ ! -z "$POLICY_ARN" ]; then
    echo "🔗 Attaching policy to role"
    aws iam attach-role-policy --role-name $IAM_ROLE_NAME --policy-arn $POLICY_ARN
fi

# Create instance profile (needed for EC2)
echo "📋 Creating instance profile"
aws iam create-instance-profile --instance-profile-name $IAM_ROLE_NAME &> /dev/null
aws iam add-role-to-instance-profile --instance-profile-name $IAM_ROLE_NAME --role-name $IAM_ROLE_NAME &> /dev/null

# Clean up temporary files
rm -f /tmp/s3-policy.json /tmp/trust-policy.json

echo ""
echo "🎉 AWS S3 Setup Complete!"
echo ""
echo "📦 S3 Bucket: $BUCKET_NAME"
echo "🌍 Region: $REGION"
echo "👤 IAM Role: $IAM_ROLE_NAME"
echo "📋 IAM Policy: $IAM_POLICY_NAME"
echo ""
echo "🔧 Next Steps:"
echo "1. Attach the IAM role '$IAM_ROLE_NAME' to your EC2 instance"
echo "2. Set environment variables:"
echo "   export AWS_REGION=$REGION"
echo "   export AWS_S3_BUCKET=$BUCKET_NAME"
echo "3. Restart your application"
echo ""
echo "🧪 Test your setup:"
echo "   curl http://localhost:8081/api/test/s3/config"
echo ""

# Create environment file for easy deployment
cat > ./aws-s3-env.sh << EOF
#!/bin/bash
# AWS S3 Environment Variables for Pet-Co
export AWS_REGION=$REGION
export AWS_S3_BUCKET=$BUCKET_NAME
echo "🌍 AWS S3 environment variables set for Pet-Co"
EOF

chmod +x ./aws-s3-env.sh

echo "💾 Environment script created: ./aws-s3-env.sh"
echo "   Run 'source ./aws-s3-env.sh' to set environment variables"