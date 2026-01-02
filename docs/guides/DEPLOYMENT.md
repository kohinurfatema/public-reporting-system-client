# Deployment Guide

## Public Infrastructure Issue Reporting System

This guide covers deploying the application to production environments.

---

## Overview

| Component | Platform | URL |
|-----------|----------|-----|
| Client | Firebase Hosting | https://public-reporting-system-351f1.web.app |
| Server | Vercel | https://public-reporting-system-server-kappa.vercel.app |

---

## Prerequisites

- Node.js 20.x installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Vercel CLI installed (`npm install -g vercel`)
- GitHub CLI installed (optional, for CI/CD)

---

## Client Deployment (Firebase Hosting)

### Initial Setup

**1. Login to Firebase:**
```bash
firebase login
```

**2. Initialize Firebase (if not done):**
```bash
cd public-reporting-system-client
firebase init hosting
```

Select:
- Use existing project: `public-reporting-system-351f1`
- Public directory: `dist`
- Single-page app: Yes
- Automatic builds: No

**3. Verify `firebase.json`:**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Deployment Steps

**1. Update environment variables for production:**
```env
# .env.production
VITE_API_BASE_URL=https://public-reporting-system-server-kappa.vercel.app
```

**2. Build the application:**
```bash
npm run build
```

**3. Deploy to Firebase:**
```bash
firebase deploy --only hosting
```

**Output:**
```
✔ Deploy complete!

Hosting URL: https://public-reporting-system-351f1.web.app
```

### Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS verification steps
4. Wait for SSL certificate provisioning

---

## Server Deployment (Vercel)

### Initial Setup

**1. Login to Vercel:**
```bash
vercel login
```

**2. Initialize Vercel (if not done):**
```bash
cd public-reporting-system-server
vercel
```

Follow the prompts to link to your Vercel account.

**3. Create `vercel.json`:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ]
}
```

### Environment Variables

Set environment variables in Vercel Dashboard:

1. Go to Project Settings > Environment Variables
2. Add the following:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://...` |
| `ALLOWED_ORIGINS` | `https://public-reporting-system-351f1.web.app` |
| `APP_NAME` | `Public Infrastructure Issue Reporting System` |

**For Firebase Admin SDK:**
- Convert the JSON credentials to environment variables, or
- Use Vercel's encrypted files feature

### Deployment Steps

**1. Deploy to production:**
```bash
vercel --prod
```

**Output:**
```
✅ Production: https://public-reporting-system-server-kappa.vercel.app
```

### Verify Deployment

```bash
curl https://public-reporting-system-server-kappa.vercel.app/
```

Expected response:
```json
{
  "status": "ok",
  "service": "Public Infrastructure Issue Reporting System"
}
```

---

## Environment Configuration

### Client Environment Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_API_BASE_URL` | `http://localhost:5000` | `https://...vercel.app` |
| `VITE_FIREBASE_*` | Same | Same |

### Server Environment Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `MONGODB_URI` | Local or Atlas | Atlas |
| `PORT` | `5000` | Set by Vercel |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Production URL |

---

## CI/CD Setup (Optional)

### GitHub Actions for Client

Create `.github/workflows/deploy-client.yml`:

```yaml
name: Deploy Client to Firebase

on:
  push:
    branches: [main]
    paths:
      - 'public-reporting-system-client/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: public-reporting-system-client

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: public-reporting-system-client/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          # ... other VITE_* variables

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: public-reporting-system-351f1
          channelId: live
          entryPoint: public-reporting-system-client
```

### GitHub Actions for Server

Create `.github/workflows/deploy-server.yml`:

```yaml
name: Deploy Server to Vercel

on:
  push:
    branches: [main]
    paths:
      - 'public-reporting-system-server/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: public-reporting-system-server
          vercel-args: '--prod'
```

---

## Monitoring & Logs

### Firebase Hosting

- Firebase Console > Hosting > Usage
- View bandwidth, requests, and errors

### Vercel

- Vercel Dashboard > Project > Logs
- Real-time function logs
- Error tracking

### MongoDB Atlas

- Atlas Dashboard > Metrics
- Connection monitoring
- Performance advisor

---

## Rollback Procedures

### Firebase Rollback

```bash
# List deployment history
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:clone <previous-version> live
```

### Vercel Rollback

1. Go to Vercel Dashboard
2. Select deployment to rollback to
3. Click "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

---

## Production Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Build succeeds locally
- [ ] API endpoints tested
- [ ] CORS configured correctly
- [ ] Security headers in place

### Post-Deployment

- [ ] Verify home page loads
- [ ] Test login/registration
- [ ] Test API endpoints
- [ ] Check browser console for errors
- [ ] Verify HTTPS working
- [ ] Test on mobile devices

### Security Checklist

- [ ] Firebase Admin SDK key not exposed
- [ ] MongoDB credentials not in code
- [ ] CORS restricts to production domain
- [ ] Environment variables set correctly
- [ ] No sensitive data in client bundle

---

## Troubleshooting

### Firebase Deployment Issues

**Error: Permission denied**
```bash
firebase login --reauth
```

**Error: Functions deployment failed**
- Check Firebase billing (Blaze plan required for functions)
- Verify Node.js version in `package.json`

### Vercel Deployment Issues

**Error: Build failed**
- Check build logs in Vercel Dashboard
- Verify `vercel.json` configuration
- Check Node.js version

**Error: 500 Internal Server Error**
- Check function logs in Vercel
- Verify environment variables
- Check MongoDB connection

### CORS Issues in Production

Ensure `ALLOWED_ORIGINS` includes the exact production URL:
```
https://public-reporting-system-351f1.web.app
```

Note: No trailing slash!

---

## Cost Estimation

### Firebase (Free Tier)
- Hosting: 10GB storage, 360MB/day bandwidth
- Auth: 10K verifications/month
- **Estimated Cost:** $0

### Vercel (Hobby)
- 100GB bandwidth
- Serverless function executions
- **Estimated Cost:** $0

### MongoDB Atlas (M0)
- 512MB storage
- Shared cluster
- **Estimated Cost:** $0

### ImgBB (Free)
- 32MB max file size
- Unlimited storage
- **Estimated Cost:** $0

**Total Monthly Cost:** $0 (within free tier limits)

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
