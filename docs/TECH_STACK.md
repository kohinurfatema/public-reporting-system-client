# Technology Stack

## Public Infrastructure Issue Reporting System

**Version:** 1.0.0
**Last Updated:** January 2, 2026

---

## Overview

This document outlines the technology choices for the Public Infrastructure Issue Reporting System, including rationale for each decision.

---

## Frontend Stack

### Core Framework

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **React** | 19.x | UI Library | Industry standard, component-based architecture, large ecosystem |
| **Vite** | 7.x | Build Tool | Fast HMR, optimized builds, better DX than CRA |
| **React Router** | 7.x | Routing | De-facto standard for React routing, nested routes support |

### State Management

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **TanStack Query** | 5.x | Server State | Automatic caching, background refetch, optimistic updates |
| **React Context** | Built-in | Client State | Simple auth state, no need for Redux complexity |

### Styling

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Tailwind CSS** | 4.x | Utility CSS | Rapid development, consistent design, small bundle |
| **DaisyUI** | 4.x | Component Library | Pre-built components, Tailwind integration |

### HTTP & Data

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Axios** | 1.x | HTTP Client | Interceptors support, better error handling than fetch |
| **react-hook-form** | 7.x | Form Management | Performance, minimal re-renders, validation |

### Authentication

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Firebase Auth** | 10.x | Authentication | Easy setup, social login, secure token management |

### UI Components

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Recharts** | 2.x | Charts | React-friendly, declarative, good documentation |
| **Swiper** | 11.x | Carousel | Modern, touch-friendly, performant |
| **SweetAlert2** | 11.x | Dialogs | Beautiful alerts, promise-based |
| **react-hot-toast** | 2.x | Toasts | Lightweight, customizable |
| **@react-pdf/renderer** | 3.x | PDF Generation | React components to PDF |
| **react-icons** | 5.x | Icons | Multiple icon libraries |

### Development Tools

| Technology | Purpose |
|------------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **PostCSS** | CSS processing |
| **Autoprefixer** | CSS vendor prefixes |

---

## Backend Stack

### Core Framework

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Node.js** | 20.x LTS | Runtime | JavaScript everywhere, large ecosystem |
| **Express** | 5.x | Web Framework | Minimal, flexible, well-documented |

### Database

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **MongoDB** | 7.x | Database | Flexible schema, document model fits issue data |
| **Mongoose** | 8.x | ODM | Schema validation, middleware, population |
| **MongoDB Atlas** | Cloud | Hosting | Free tier, automatic scaling, backups |

### Authentication

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Firebase Admin SDK** | 12.x | Token Verification | Secure server-side verification |

### Middleware

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **cors** | 2.x | CORS | Cross-origin request handling |
| **morgan** | 1.x | Logging | HTTP request logging |
| **dotenv** | 16.x | Environment | Environment variable management |

---

## External Services

### Cloud Services

| Service | Purpose | Tier |
|---------|---------|------|
| **Firebase** | Auth + Hosting | Spark (Free) |
| **MongoDB Atlas** | Database | M0 (Free) |
| **Vercel** | API Hosting | Hobby (Free) |
| **ImgBB** | Image Hosting | Free |

### Third-Party APIs

| Service | Purpose |
|---------|---------|
| **ImgBB API** | Image upload and CDN |
| **Google OAuth** | Social authentication |

---

## Development Environment

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| npm | 10.x | Package manager |
| Git | 2.x | Version control |
| VS Code | Latest | IDE (recommended) |

### VS Code Extensions (Recommended)

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- GitLens

---

## Package Dependencies

### Client (package.json)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0",
    "react-router-dom": "^7.0.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "firebase": "^10.7.0",
    "react-hook-form": "^7.48.0",
    "recharts": "^2.10.0",
    "swiper": "^11.0.0",
    "sweetalert2": "^11.10.0",
    "react-hot-toast": "^2.4.0",
    "@react-pdf/renderer": "^3.1.0",
    "react-icons": "^5.0.0"
  },
  "devDependencies": {
    "vite": "^7.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^4.0.0",
    "daisyui": "^4.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.55.0"
  }
}
```

### Server (package.json)

```json
{
  "dependencies": {
    "express": "^5.0.0",
    "mongoose": "^8.0.0",
    "firebase-admin": "^12.0.0",
    "cors": "^2.8.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## Architecture Decisions

### Why React over Vue/Angular?

- Larger ecosystem and community
- More job market demand
- Flexible and unopinionated
- Better for learning component patterns

### Why Vite over Create React App?

- CRA is deprecated/unmaintained
- Vite has faster cold start (native ESM)
- Better HMR performance
- Smaller production bundles

### Why TanStack Query over Redux?

- Server state is different from client state
- Built-in caching and synchronization
- Less boilerplate code
- Automatic background refetching

### Why MongoDB over PostgreSQL?

- Flexible schema suits issue data model
- JSON-like documents match JavaScript
- Easy to scale horizontally
- Free tier sufficient for project

### Why Firebase Auth over JWT?

- Managed authentication service
- Built-in social providers
- Secure token management
- No need to manage refresh tokens

### Why Express over Fastify/Nest?

- Simple and minimal
- Large middleware ecosystem
- Well-documented
- Sufficient for project scope

---

## Performance Benchmarks

### Client Build

| Metric | Value |
|--------|-------|
| Build Time | ~15s |
| Bundle Size (gzip) | ~250KB |
| First Contentful Paint | <1.5s |
| Lighthouse Score | 85+ |

### Server Response

| Endpoint | Avg Response |
|----------|--------------|
| GET /issues | ~100ms |
| POST /issues | ~150ms |
| GET /admin/stats | ~200ms |

---

## Future Technology Considerations

### Phase 2 Additions

| Technology | Purpose |
|------------|---------|
| **Vitest** | Unit testing |
| **React Testing Library** | Component testing |
| **Framer Motion** | Animations |
| **Zod** | Schema validation |

### Future Scaling

| Technology | Purpose |
|------------|---------|
| **Redis** | Caching |
| **Socket.io** | Real-time updates |
| **AWS S3** | File storage |
| **Docker** | Containerization |

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
