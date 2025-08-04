# Food App Backend

## Vercel Deployment Instructions

### 1. Environment Variables Setup

Make sure to set these environment variables in your Vercel dashboard:

```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### 2. Required Environment Variables

- `MONGO_URL`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Set to "production" for Vercel

### 3. Optional Environment Variables

- `CLOUDINARY_CLOUD_NAME`: If using Cloudinary for image uploads
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `MAILGUN_API_KEY`: If using Mailgun for emails
- `MAILGUN_DOMAIN`: Mailgun domain

### 4. Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy the backend directory
4. Test the health endpoint: `https://your-domain.vercel.app/api/health`

### 5. Troubleshooting

If you get a 500 error:

1. Check Vercel logs for specific error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB connection string is valid
4. Test the health endpoint first

### 6. API Endpoints

- Health Check: `GET /api/health`
- Users: `POST /api/users/login`, `POST /api/users/register`
- Foods: `GET /api/foods`
- Orders: `POST /api/orders`
- Upload: `POST /api/upload` 