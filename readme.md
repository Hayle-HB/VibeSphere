# Server Configuration

PORT=5000
NODE_ENV=development
API_VERSION=v1
CORS_ORIGIN=http://localhost:3000

# Database

MONGODB_URI=mongodb://localhost:27017/realtimechat
REDIS_URL=redis://localhost:6379

# Authentication

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# OAuth

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
OAUTH_CALLBACK_URL=http://localhost:5000/api/v1/auth/oauth/callback

# File Storage

STORAGE_TYPE=local # or s3, cloudinary
UPLOADS_FOLDER=uploads
MAX_FILE_SIZE=10485760 # 10MB

# AWS S3 (if using s3 storage)

AWS_BUCKET_NAME=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Email (optional)

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
EMAIL_FROM=noreply@realtimechat.com

# Push Notifications

VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
