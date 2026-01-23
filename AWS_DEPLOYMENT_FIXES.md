# AWS Deployment Troubleshooting Guide

## Issues Identified & Solutions

Your application at `http://13.126.182.89/homepage` is failing because of several configuration mismatches between development and production environments.

### 🔴 **Critical Issues Found:**

#### 1. **CORS Configuration Mismatch**
- **Problem**: Your current AWS IP `13.126.182.89` was not in the CORS allowed origins
- **Solution**: ✅ **FIXED** - Added your IP to CorsConfig.java and PaymentController

#### 2. **Backend API URL Configuration**
- **Problem**: Frontend was looking for API at `/api` instead of full backend URL
- **Solution**: ✅ **FIXED** - Updated `.env.production` to use `http://13.126.182.89:8081/api`

#### 3. **Missing Environment Variables**
- **Problem**: Production environment missing critical configurations
- **Solution**: ✅ **FIXED** - Updated application-prod.properties with proper config

### 🚀 **Immediate Actions Required:**

#### Step 1: Set Environment Variables on AWS EC2
SSH to your server and set these variables:

```bash
# SSH to your EC2 instance
ssh ec2-user@13.126.182.89

# Edit environment file
nano ~/.bashrc

# Add these environment variables:
export SENDGRID_API_KEY="SG.your_sendgrid_api_key_here"
export EMAIL_FROM="PETCO <your-verified-email@domain.com>"
export RAZORPAY_KEY_ID="rzp_live_your_key_id"
export RAZORPAY_KEY_SECRET="your_razorpay_secret"
export CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
export CLOUDINARY_API_KEY="your_cloudinary_api_key"
export CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Apply changes
source ~/.bashrc
```

#### Step 2: Rebuild and Deploy Backend
```bash
# In your local backend directory
./mvnw clean package -DskipTests

# Copy to AWS (update IP if needed)
scp target/pet-co-0.0.1-SNAPSHOT.jar ec2-user@13.126.182.89:/home/ec2-user/

# SSH and restart
ssh ec2-user@13.126.182.89
pkill -f 'pet-co'  # Kill existing process
nohup java -jar pet-co-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod > app.log 2>&1 &
```

#### Step 3: Rebuild and Deploy Frontend
```bash
# In your local frontend directory
npm run build

# Deploy to your web server
# (Copy dist/ contents to your web server's document root)
```

### 🔍 **Verification Steps:**

1. **Test Backend Health:**
   ```bash
   curl http://13.126.182.89:8081/api/test/health
   ```

2. **Test CORS:**
   ```bash
   curl -H "Origin: http://13.126.182.89" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        http://13.126.182.89:8081/api/admin/products/customer
   ```

3. **Test Products API:**
   ```bash
   curl http://13.126.182.89:8081/api/admin/products/customer
   ```

### 📧 **Email Setup Requirements:**

1. **Get SendGrid API Key:**
   - Sign up at https://sendgrid.com/
   - Create API Key with "Mail Send" permissions
   - Verify sender email address

2. **Configure in AWS:**
   ```bash
   export SENDGRID_API_KEY="SG.your_actual_api_key"
   export EMAIL_FROM="PETCO <verified-email@yourdomain.com>"
   ```

### 💳 **Payment Setup Requirements:**

1. **Get Razorpay Credentials:**
   - Log in to https://dashboard.razorpay.com/
   - Go to Account & Settings → API Keys
   - Generate/copy Key ID and Secret

2. **Configure in AWS:**
   ```bash
   export RAZORPAY_KEY_ID="rzp_live_your_key_id"
   export RAZORPAY_KEY_SECRET="your_secret"
   ```

### 📷 **Image Upload Fix:**

Your app needs cloud storage for images in production:

1. **Set up Cloudinary:**
   - Sign up at https://cloudinary.com/
   - Get Cloud Name, API Key, and API Secret

2. **Configure in AWS:**
   ```bash
   export CLOUDINARY_CLOUD_NAME="your_cloud_name"
   export CLOUDINARY_API_KEY="your_api_key"
   export CLOUDINARY_API_SECRET="your_api_secret"
   ```

### 🔧 **EC2 Security Group Configuration:**

Ensure your EC2 security group allows:
- **Port 80** (HTTP) - for frontend
- **Port 8081** - for backend API
- **Port 22** (SSH) - for management

### 🚨 **Common Issues & Solutions:**

#### Images Not Loading:
- **Cause**: Using local file storage instead of cloud storage
- **Fix**: Set up Cloudinary environment variables

#### CORS Errors:
- **Cause**: Frontend domain not in allowed origins
- **Fix**: Already updated - rebuild backend

#### Payment Failures:
- **Cause**: Razorpay keys not configured
- **Fix**: Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET

#### Email Not Sending:
- **Cause**: SendGrid not configured or sender not verified
- **Fix**: Set up SendGrid API key and verify sender email

### 📞 **Next Steps After Environment Setup:**

1. Restart your backend application
2. Test each functionality:
   - Product loading
   - Image uploads
   - Email sending
   - Payment processing
3. Monitor application logs for any remaining errors

### 🔍 **Debugging Commands:**

```bash
# Check if backend is running
ps aux | grep java

# View application logs
tail -f app.log

# Check environment variables
echo $SENDGRID_API_KEY
echo $RAZORPAY_KEY_ID

# Test API endpoints
curl -X GET http://13.126.182.89:8081/api/admin/products/customer
```

**The fixes are now in place - you need to set up the environment variables and redeploy for everything to work correctly.**