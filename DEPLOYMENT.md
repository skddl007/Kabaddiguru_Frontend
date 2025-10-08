# Frontend Deployment Guide

## Overview
This guide explains how to deploy the Kabaddi Guru frontend to Google Cloud Run using GitHub Actions CI/CD.

## Backend Configuration
- **Production Backend URL**: `https://ddlsandeep-kabaddiguru-backend.hf.space`
- **Local Development URL**: `http://localhost:8000`

## Prerequisites

### 1. Google Cloud Platform Setup
- Google Cloud Project with billing enabled
- Cloud Run API enabled
- Cloud Build API enabled
- Container Registry API enabled

### 2. Service Account Setup
Create a service account with the following roles:
- Cloud Run Admin
- Cloud Build Editor
- Storage Admin
- Service Account User

### 3. GitHub Secrets
Add the following secrets to your GitHub repository:
- `GCP_PROJECT_ID`: Your Google Cloud Project ID
- `GCP_SA_KEY`: Service account JSON key (base64 encoded)

## Deployment Process

### Automatic Deployment (Recommended)
1. Push to `main` or `master` branch
2. GitHub Actions will automatically:
   - Run tests
   - Build the application
   - Deploy to Cloud Run
   - Provide deployment status

### Manual Deployment
```bash
# Build and deploy using Cloud Build
gcloud builds submit --config cloudbuild.yaml --project=YOUR_PROJECT_ID
```

## Environment Variables
The application uses the following environment variables:
- `NEXT_PUBLIC_API_URL`: Backend API URL (set in config.env)
- `NODE_ENV`: Set to 'production' in deployment

## Service Configuration
- **Service Name**: `kabaddi-frontend`
- **Region**: `us-central1`
- **Port**: `3000`
- **Memory**: `1Gi`
- **CPU**: `1`
- **Max Instances**: `10`
- **Authentication**: Public (unauthenticated)

## Monitoring
- View logs: `gcloud logs tail --service=kabaddi-frontend --region=us-central1`
- Service status: `gcloud run services describe kabaddi-frontend --region=us-central1`

## Troubleshooting
1. Check GitHub Actions logs for build errors
2. Verify service account permissions
3. Ensure all required APIs are enabled
4. Check Cloud Run service logs for runtime errors

## Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
