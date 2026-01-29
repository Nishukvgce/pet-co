# AWS S3 Setup Script for Pet-Co Project (PowerShell)
# This script sets up the S3 bucket and IAM permissions for image storage

Write-Host "🚀 Setting up AWS S3 for Pet-Co Image Storage..." -ForegroundColor Green

# Configuration
$BUCKET_NAME = "database-images-pet-co"
$REGION = "ap-south-1"
$IAM_ROLE_NAME = "pet-co-s3-role"
$IAM_POLICY_NAME = "pet-co-s3-policy"

# Check if AWS CLI is installed
try {
    aws --version | Out-Null
    Write-Host "✅ AWS CLI is available" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if user is logged in to AWS
try {
    aws sts get-caller-identity | Out-Null
    Write-Host "✅ AWS CLI is configured" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to AWS. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}

# Create S3 bucket
Write-Host "📦 Creating S3 bucket: $BUCKET_NAME" -ForegroundColor Blue
try {
    aws s3api create-bucket --bucket $BUCKET_NAME --region $REGION --create-bucket-configuration LocationConstraint=$REGION | Out-Null
    Write-Host "✅ S3 bucket created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️  S3 bucket might already exist or creation failed" -ForegroundColor Yellow
}

# Set bucket versioning
Write-Host "🔄 Enabling versioning on S3 bucket" -ForegroundColor Blue
aws s3api put-bucket-versioning --bucket $BUCKET_NAME --versioning-configuration Status=Enabled

# Set bucket public access block
Write-Host "🔒 Setting bucket security policies" -ForegroundColor Blue
aws s3api put-public-access-block --bucket $BUCKET_NAME --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Create IAM policy
Write-Host "📋 Creating IAM policy: $IAM_POLICY_NAME" -ForegroundColor Blue

$policyDocument = @"
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
"@

$policyDocument | Out-File -FilePath "$env:TEMP\s3-policy.json" -Encoding utf8

# Create the IAM policy
try {
    $policyArn = aws iam create-policy --policy-name $IAM_POLICY_NAME --policy-document "file://$env:TEMP\s3-policy.json" --query 'Policy.Arn' --output text
    Write-Host "✅ IAM policy created: $policyArn" -ForegroundColor Green
} catch {
    Write-Host "⚠️  IAM policy might already exist" -ForegroundColor Yellow
    $policyArn = aws iam list-policies --scope Local --query "Policies[?PolicyName=='$IAM_POLICY_NAME'].Arn" --output text
}

# Create IAM role for EC2
Write-Host "👤 Creating IAM role for EC2: $IAM_ROLE_NAME" -ForegroundColor Blue

$trustPolicy = @"
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
"@

$trustPolicy | Out-File -FilePath "$env:TEMP\trust-policy.json" -Encoding utf8

try {
    aws iam create-role --role-name $IAM_ROLE_NAME --assume-role-policy-document "file://$env:TEMP\trust-policy.json" | Out-Null
} catch {
    Write-Host "⚠️  IAM role might already exist" -ForegroundColor Yellow
}

# Attach policy to role
if ($policyArn) {
    Write-Host "🔗 Attaching policy to role" -ForegroundColor Blue
    aws iam attach-role-policy --role-name $IAM_ROLE_NAME --policy-arn $policyArn
}

# Create instance profile
Write-Host "📋 Creating instance profile" -ForegroundColor Blue
try {
    aws iam create-instance-profile --instance-profile-name $IAM_ROLE_NAME | Out-Null
    aws iam add-role-to-instance-profile --instance-profile-name $IAM_ROLE_NAME --role-name $IAM_ROLE_NAME | Out-Null
} catch {
    Write-Host "⚠️  Instance profile might already exist" -ForegroundColor Yellow
}

# Clean up temporary files
Remove-Item "$env:TEMP\s3-policy.json" -ErrorAction SilentlyContinue
Remove-Item "$env:TEMP\trust-policy.json" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "🎉 AWS S3 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 S3 Bucket: $BUCKET_NAME" -ForegroundColor Cyan
Write-Host "🌍 Region: $REGION" -ForegroundColor Cyan
Write-Host "👤 IAM Role: $IAM_ROLE_NAME" -ForegroundColor Cyan
Write-Host "📋 IAM Policy: $IAM_POLICY_NAME" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Attach the IAM role '$IAM_ROLE_NAME' to your EC2 instance"
Write-Host "2. Set environment variables:"
Write-Host "   `$env:AWS_REGION = '$REGION'"
Write-Host "   `$env:AWS_S3_BUCKET = '$BUCKET_NAME'"
Write-Host "3. Restart your application"
Write-Host ""
Write-Host "🧪 Test your setup:" -ForegroundColor Yellow
Write-Host "   curl http://localhost:8081/api/test/s3/config"
Write-Host ""

# Create environment script
$envScript = @"
# AWS S3 Environment Variables for Pet-Co
`$env:AWS_REGION = "$REGION"
`$env:AWS_S3_BUCKET = "$BUCKET_NAME"
Write-Host "🌍 AWS S3 environment variables set for Pet-Co" -ForegroundColor Green
"@

$envScript | Out-File -FilePath ".\aws-s3-env.ps1" -Encoding utf8

Write-Host "💾 Environment script created: .\aws-s3-env.ps1" -ForegroundColor Magenta
Write-Host "   Run '.\aws-s3-env.ps1' to set environment variables" -ForegroundColor Magenta