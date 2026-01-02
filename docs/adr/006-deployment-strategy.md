# ADR-006: Deployment Strategy

## Status
**Accepted**

## Date
December 20, 2025

## Context

The application consists of two deployable units:
1. **Client**: React SPA (static files)
2. **Server**: Express.js API

Requirements:
- Free or low-cost hosting
- HTTPS support
- Custom domain capability
- Easy deployment process
- Reasonable performance

## Decision

We chose:
- **Firebase Hosting** for the client
- **Vercel** for the server

### Implementation Details

**Client Deployment (Firebase):**
```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting
```

**Firebase Configuration (firebase.json):**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Server Deployment (Vercel):**
```bash
vercel --prod
```

**Vercel Configuration (vercel.json):**
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

## Consequences

### Positive

**Firebase Hosting:**
- Free SSL certificates
- Global CDN
- Easy CI/CD with GitHub
- Firebase ecosystem integration
- Custom domain support

**Vercel:**
- Serverless functions
- Automatic HTTPS
- Git integration
- Zero configuration
- Free tier generous

### Negative
- **Cold Starts**: Vercel serverless may have cold starts
- **Vendor Lock-in**: Tied to specific platforms
- **Environment Variables**: Must configure separately

### Neutral
- Both platforms have good documentation
- Free tiers sufficient for project

## Deployment URLs

| Component | URL |
|-----------|-----|
| Client | https://public-reporting-system-351f1.web.app |
| Server | https://public-reporting-system-server-kappa.vercel.app |

## Environment Configuration

**Client (.env):**
```
VITE_API_BASE_URL=https://public-reporting-system-server-kappa.vercel.app
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
# ... other Firebase config
```

**Server (.env on Vercel):**
```
MONGODB_URI=mongodb+srv://...
ALLOWED_ORIGINS=https://public-reporting-system-351f1.web.app
# Firebase Admin SDK via JSON file
```

## Alternatives Considered

### Client Alternatives

#### 1. Vercel (for client too)
**Pros:** Same platform as server
**Cons:** Firebase Hosting already integrated
**Rejected:** Firebase Hosting optimized for SPAs

#### 2. Netlify
**Pros:** Great DX, form handling
**Cons:** No Firebase integration
**Rejected:** Firebase Hosting better for project

#### 3. GitHub Pages
**Pros:** Free, simple
**Cons:** No server-side features, limited routing
**Rejected:** Less features than Firebase Hosting

### Server Alternatives

#### 1. Railway
**Pros:** Easy setup, database hosting
**Cons:** Limited free tier
**Rejected:** Vercel free tier more generous

#### 2. Render
**Pros:** Docker support, databases
**Cons:** Slower cold starts, limited free tier
**Rejected:** Vercel simpler for Express

#### 3. Heroku
**Pros:** Long history, many features
**Cons:** No free tier anymore
**Rejected:** Cost

#### 4. AWS Lambda + API Gateway
**Pros:** Scalable, enterprise-grade
**Cons:** Complex setup, configuration heavy
**Rejected:** Overkill for project scope

## CI/CD Pipeline (Future)

```yaml
# Proposed GitHub Actions workflow
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-client:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0

  deploy-server:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
```

## Related Decisions
- ADR-001: Authentication Strategy (Firebase integration)
- ADR-003: Frontend Framework (build output)

---

*Author: Development Team*
*Reviewed: January 2, 2026*
