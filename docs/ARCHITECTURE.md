# System Architecture

## Public Infrastructure Issue Reporting System

**Version:** 1.0.0
**Last Updated:** January 2, 2026

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [System Components](#system-components)
3. [Data Flow](#data-flow)
4. [Authentication Flow](#authentication-flow)
5. [Client Architecture](#client-architecture)
6. [Server Architecture](#server-architecture)
7. [Database Design](#database-design)
8. [API Design](#api-design)
9. [Security Architecture](#security-architecture)
10. [Deployment Architecture](#deployment-architecture)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRESENTATION LAYER                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    React SPA (Vite + React 19)                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │   │
│  │  │  Pages   │  │Components│  │  Hooks   │  │  Context/State   │    │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                          Axios + TanStack Query                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY LAYER                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Express.js REST API                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │   │
│  │  │  Routes  │  │Middleware│  │Controllers│  │   Validators     │    │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE LAYER                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────────┐   │
│  │ Firebase Auth │  │    MongoDB    │  │        External APIs          │   │
│  │  (Admin SDK)  │  │   (Mongoose)  │  │   (ImgBB, Stripe/SSLCommerz) │   │
│  └───────────────┘  └───────────────┘  └───────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## System Components

### Frontend (Client)

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | React 19 | UI library |
| Build Tool | Vite 7 | Fast development & bundling |
| Routing | React Router v7 | Client-side navigation |
| State Management | TanStack Query | Server state management |
| Auth State | React Context | Client-side auth state |
| HTTP Client | Axios | API requests |
| Styling | Tailwind CSS + DaisyUI | Utility-first CSS |
| Charts | Recharts | Data visualization |
| PDF Generation | @react-pdf/renderer | Invoice generation |
| Notifications | SweetAlert2 + react-hot-toast | User feedback |
| Forms | react-hook-form | Form management |
| Carousel | Swiper | Image sliders |

### Backend (Server)

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js | JavaScript runtime |
| Framework | Express 5 | Web framework |
| Database | MongoDB | Document database |
| ODM | Mongoose | MongoDB object modeling |
| Authentication | Firebase Admin SDK | Token verification |
| Logging | Morgan | HTTP request logging |
| Security | CORS, Helmet | Security middleware |

### External Services

| Service | Purpose |
|---------|---------|
| Firebase Authentication | User authentication |
| MongoDB Atlas | Cloud database |
| ImgBB | Image hosting |
| Firebase Hosting | Client deployment |
| Vercel | Server deployment |

---

## Data Flow

### Issue Reporting Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Citizen │────▶│  Client  │────▶│  Server  │────▶│ MongoDB  │
│  Reports │     │   Form   │     │   API    │     │  Issues  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                       │                │
                       ▼                ▼
                 ┌──────────┐     ┌──────────┐
                 │  ImgBB   │     │ Timeline │
                 │  Upload  │     │  Entry   │
                 └──────────┘     └──────────┘
```

### Issue Resolution Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Admin   │────▶│  Assign  │────▶│  Staff   │────▶│  Resolve │
│  Review  │     │  Staff   │     │  Works   │     │  Issue   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                │                │
     ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                    TIMELINE ENTRIES                          │
│  Created → Assigned → In-Progress → Working → Resolved      │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AUTHENTICATION FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

1. LOGIN/REGISTER
   ┌──────────┐     ┌──────────────┐     ┌──────────┐
   │  Client  │────▶│ Firebase Auth│────▶│  Token   │
   │   Form   │     │   (Client)   │     │ Received │
   └──────────┘     └──────────────┘     └──────────┘

2. API REQUEST
   ┌──────────┐     ┌──────────────┐     ┌──────────┐
   │  Client  │────▶│    Axios     │────▶│  Server  │
   │ Request  │     │ Interceptor  │     │   API    │
   └──────────┘     │ (Add Token)  │     └──────────┘
                    └──────────────┘           │
                                               ▼
3. TOKEN VERIFICATION                    ┌──────────────┐
   ┌──────────┐     ┌──────────────┐     │   Firebase   │
   │ Verified │◀────│  verifyToken │◀────│  Admin SDK   │
   │ Request  │     │  Middleware  │     │   Verify     │
   └──────────┘     └──────────────┘     └──────────────┘

4. ROLE VERIFICATION
   ┌──────────┐     ┌──────────────┐     ┌──────────┐
   │ Process  │◀────│ verifyAdmin/ │◀────│  MongoDB │
   │ Request  │     │ verifyStaff  │     │   User   │
   └──────────┘     └──────────────┘     └──────────┘
```

### Token Flow Detail

```javascript
// Client: Axios Interceptor
axios.interceptors.request.use((config) => {
  const token = await user.getIdToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Server: Token Verification
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  req.user = decodedToken;
  next();
};
```

---

## Client Architecture

### Current Structure

```
src/
├── App.jsx                      # Root component
├── main.jsx                     # Entry point
│
├── context/
│   └── AuthContext/
│       ├── AuthContext.jsx      # Auth context definition
│       └── AuthProvider.jsx     # Auth provider with Firebase
│
├── hooks/
│   ├── useAuth.jsx              # Auth hook
│   ├── useAxiosSecure.jsx       # Axios with interceptors
│   └── useUserRole.jsx          # Role fetching hook
│
├── routes/
│   ├── router.jsx               # Route definitions
│   ├── PrivateRoute.jsx         # Auth-protected wrapper
│   └── RoleRoute.jsx            # Role-based wrapper
│
├── layouts/
│   ├── RootLayout.jsx           # Public layout (Navbar + Footer)
│   └── DashboardLayout.jsx      # Dashboard layout (Sidebar)
│
├── pages/
│   ├── Home.jsx
│   ├── AllIssues.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── NotFound.jsx
│   ├── PaymentSuccess.jsx
│   ├── PaymentCancel.jsx
│   └── Dashboard/
│       ├── Admin/
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminDashboardHome.jsx
│       │   ├── AdminAllIssues.jsx
│       │   ├── AdminManageUsers.jsx
│       │   ├── AdminManageStaff.jsx
│       │   ├── AdminPayments.jsx
│       │   └── AdminProfile.jsx
│       ├── Staff/
│       │   ├── StaffDashboard.jsx
│       │   ├── StaffDashboardHome.jsx
│       │   ├── StaffAssignedIssues.jsx
│       │   └── StaffProfile.jsx
│       ├── CitizenDashboard.jsx
│       ├── CitizenDashboardHome.jsx
│       ├── CitizenProfile.jsx
│       ├── MyIssues.jsx
│       ├── ReportIssue.jsx
│       └── IssueDetails.jsx
│
├── components/
│   ├── Home/
│   │   ├── BannerSection.jsx
│   │   ├── LatestResolvedIssues.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── StatsSection.jsx
│   │   └── CTASection.jsx
│   └── Invoice/
│       └── InvoicePDF.jsx
│
├── pages/Shared/
│   ├── Navbar/
│   │   └── Navbar.jsx
│   └── Footer/
│       └── Footer.jsx
│
└── firebase/
    └── firebase.init.js         # Firebase configuration
```

### Proposed Feature-Based Structure (Phase 2)

```
src/
├── app/
│   ├── App.jsx
│   ├── providers/
│   │   ├── AuthProvider.jsx
│   │   ├── ThemeProvider.jsx
│   │   └── QueryProvider.jsx
│   └── router/
│       └── router.jsx
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   ├── issues/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   └── dashboard/
│       ├── admin/
│       ├── staff/
│       └── citizen/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── constants/
│
└── pages/
```

---

## Server Architecture

### Current Structure

```
src/
├── index.js                     # Entry point, Express setup
│
├── config/
│   └── firebase.js              # Firebase Admin SDK init
│
├── middleware/
│   └── auth.js                  # verifyToken, verifyAdmin, verifyStaff
│
├── models/
│   ├── User.js                  # User schema
│   ├── Issue.js                 # Issue schema with Timeline
│   └── Payment.js               # Payment schema
│
└── routes/
    ├── userRoutes.js            # /users endpoints
    ├── issueRoutes.js           # /issues endpoints
    ├── adminRoutes.js           # /admin endpoints
    ├── staffRoutes.js           # /staff endpoints
    └── paymentRoutes.js         # /payments endpoints
```

### Request Processing Pipeline

```
Request → CORS → Morgan → JSON Parser → Routes → Middleware → Handler → Response
           │                              │         │
           │                              │         ├── verifyToken
           │                              │         ├── verifyAdmin
           │                              │         └── verifyStaff
           │                              │
           │                              ├── /users
           │                              ├── /issues
           │                              ├── /admin
           │                              ├── /staff
           │                              └── /payments
           │
           └── Allowed Origins: Firebase Hosting, localhost
```

---

## Database Design

### Collections Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         MONGODB                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                     │
│  │  Users  │    │  Issues │    │Payments │                     │
│  └────┬────┘    └────┬────┘    └────┬────┘                     │
│       │              │              │                           │
│       │    ┌─────────┴─────────┐    │                           │
│       └────┤   Relationships   ├────┘                           │
│            └───────────────────┘                                │
│                                                                  │
│  User.email ──────▶ Issue.reporterEmail                         │
│  User.email ──────▶ Issue.assignedStaff                         │
│  User.email ──────▶ Payment.userEmail                           │
│  Issue._id  ──────▶ Payment.issueId (for boost)                 │
└─────────────────────────────────────────────────────────────────┘
```

### Entity Relationship

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    USER     │         │    ISSUE    │         │   PAYMENT   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ email (PK)  │◀────────│reporterEmail│         │ _id (PK)    │
│ name        │         │ title       │         │ userEmail   │──┐
│ photoURL    │         │ description │         │ amount      │  │
│ role        │◀────────│assignedStaff│         │ type        │  │
│ isPremium   │         │ category    │         │ issueId     │──┼──▶ Issue
│ isBlocked   │         │ status      │         │ createdAt   │  │
│ issueCount  │         │ priority    │         └─────────────┘  │
│ createdAt   │         │ location    │                          │
└─────────────┘         │ image       │                          │
       │                │ upvotes[]   │                          │
       │                │ timeline[]  │◀─── Embedded Document    │
       │                │ createdAt   │                          │
       │                └─────────────┘                          │
       │                                                         │
       └─────────────────────────────────────────────────────────┘
```

---

## API Design

### RESTful Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Users** |
| POST | /users | - | Create user |
| GET | /users/:email | Token | Get user profile |
| PATCH | /users/:email | Token | Update profile |
| PATCH | /users/upgrade/:email | Token | Upgrade to premium |
| **Issues** |
| GET | /issues | - | Get all issues (paginated) |
| GET | /issues/latest-resolved | - | Get latest resolved |
| POST | /issues | Token | Create issue |
| GET | /issues/user/:email | Token | Get user's issues |
| GET | /issues/stats/:email | Token | Get user stats |
| GET | /issues/:id | Token | Get issue details |
| PATCH | /issues/:id | Token | Update issue |
| DELETE | /issues/:id | Token | Delete issue |
| PATCH | /issues/boost/:id | Token | Boost priority |
| PATCH | /issues/:id/upvote | Token | Upvote issue |
| **Admin** |
| GET | /admin/stats | Admin | Dashboard stats |
| GET | /admin/issues | Admin | All issues |
| PATCH | /admin/issues/:id/assign | Admin | Assign staff |
| PATCH | /admin/issues/:id/reject | Admin | Reject issue |
| GET | /admin/users | Admin | All citizens |
| PATCH | /admin/users/:email/block | Admin | Block/unblock |
| GET | /admin/staff | Admin | All staff |
| POST | /admin/staff | Admin | Create staff |
| PATCH | /admin/staff/:email | Admin | Update staff |
| DELETE | /admin/staff/:email | Admin | Delete staff |
| GET | /admin/payments | Admin | All payments |
| GET | /admin/latest | Admin | Latest data |
| **Staff** |
| GET | /staff/stats/:email | Staff | Staff stats |
| GET | /staff/issues/:email | Staff | Assigned issues |
| PATCH | /staff/issues/:id/status | Staff | Change status |
| **Payments** |
| POST | /payments | Token | Create payment |
| GET | /payments/user/:email | Token | User payments |
| GET | /payments/invoice/:id | Token | Invoice data |

---

## Security Architecture

### Authentication Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Transport Security                                     │
│  └── HTTPS (TLS 1.3)                                            │
│                                                                  │
│  Layer 2: CORS Policy                                            │
│  └── Whitelist: Firebase Hosting, localhost                     │
│                                                                  │
│  Layer 3: Authentication                                         │
│  └── Firebase ID Token Verification                             │
│                                                                  │
│  Layer 4: Authorization                                          │
│  └── Role-based middleware (Admin, Staff, Citizen)              │
│                                                                  │
│  Layer 5: Data Validation                                        │
│  └── Input validation, sanitization                             │
│                                                                  │
│  Layer 6: Environment Security                                   │
│  └── Secrets in environment variables                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Protected Routes Matrix

| Route | Public | Token | Admin | Staff |
|-------|--------|-------|-------|-------|
| GET /issues | yes | - | - | - |
| POST /issues | - | yes | - | - |
| GET /admin/* | - | - | yes | - |
| GET /staff/* | - | - | - | yes |
| POST /payments | - | yes | - | - |

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                         │
└─────────────────────────────────────────────────────────────────┘

                         ┌─────────────┐
                         │   Users     │
                         │  (Browser)  │
                         └──────┬──────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                        CDN (Firebase)                          │
│                   Static Assets Delivery                       │
└───────────────────────────────────────────────────────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
              ▼                                   ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│    Firebase Hosting     │         │       Vercel            │
│    (React Client)       │         │    (Express API)        │
│                         │         │                         │
│ public-reporting-       │         │ public-reporting-       │
│ system-351f1.web.app    │────────▶│ system-server-kappa.    │
│                         │  API    │ vercel.app              │
└─────────────────────────┘ Calls   └───────────┬─────────────┘
                                                │
              ┌─────────────────────────────────┼─────────────┐
              │                                 │             │
              ▼                                 ▼             ▼
┌─────────────────────┐         ┌─────────────────────┐  ┌────────┐
│   Firebase Auth     │         │   MongoDB Atlas     │  │ ImgBB  │
│  (Authentication)   │         │    (Database)       │  │(Images)│
└─────────────────────┘         └─────────────────────┘  └────────┘
```

---

## Performance Considerations

### Client-Side

- **Code Splitting**: React.lazy for route-based splitting
- **TanStack Query**: Automatic caching and background refetching
- **Image Optimization**: ImgBB CDN delivery
- **Bundle Size**: Vite tree-shaking

### Server-Side

- **Database Indexing**: Indexed fields for queries
- **Pagination**: Server-side pagination for large datasets
- **Connection Pooling**: Mongoose connection pooling

---

## Future Architecture Considerations

1. **Microservices**: Split into auth, issues, payments services
2. **Message Queue**: Redis/RabbitMQ for async operations
3. **Real-time**: WebSocket for live updates
4. **Caching**: Redis for API response caching
5. **Search**: Elasticsearch for advanced search
6. **Monitoring**: APM integration (New Relic, Datadog)

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
