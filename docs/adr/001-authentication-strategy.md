# ADR-001: Authentication Strategy

## Status
**Accepted**

## Date
December 10, 2025

## Context

The Public Infrastructure Issue Reporting System requires a robust authentication mechanism that supports:
- Email/password authentication
- Social login (Google)
- Role-based access control (Admin, Staff, Citizen)
- Secure token-based API authentication
- Session persistence across page refreshes

We needed to decide between:
1. Custom JWT implementation
2. Third-party authentication service (Firebase Auth, Auth0, Clerk)
3. OAuth-only approach

## Decision

We chose **Firebase Authentication** with **Firebase Admin SDK** for server-side token verification.

### Implementation Details

**Client-Side:**
- Firebase Auth SDK for user registration and login
- Google Sign-In provider for social authentication
- Token retrieval via `user.getIdToken()`
- Axios interceptors for automatic token attachment

**Server-Side:**
- Firebase Admin SDK for token verification
- Custom middleware: `verifyToken`, `verifyAdmin`, `verifyStaff`
- Role stored in MongoDB, not in Firebase custom claims

```javascript
// Server middleware
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  req.user = decodedToken;
  next();
};
```

## Consequences

### Positive
- **Reduced Development Time**: No need to implement password hashing, token generation, refresh logic
- **Security**: Firebase handles security best practices (bcrypt, secure tokens)
- **Social Login**: Easy integration with Google (and future providers)
- **Scalability**: Firebase Auth scales automatically
- **Free Tier**: Sufficient for project requirements

### Negative
- **Vendor Lock-in**: Tied to Firebase ecosystem
- **Limited Customization**: Cannot customize token claims easily
- **Separate User Store**: User roles stored in MongoDB, requiring sync
- **Network Dependency**: Requires Firebase availability

### Neutral
- Admin SDK JSON credentials must be securely managed
- Token verification adds network latency to API calls

## Alternatives Considered

### 1. Custom JWT Implementation
**Pros:** Full control, no vendor dependency
**Cons:** Security responsibility, more development time
**Rejected:** Higher risk of security vulnerabilities

### 2. Auth0
**Pros:** More features, better enterprise support
**Cons:** More complex, paid plans required for advanced features
**Rejected:** Overkill for project scope

### 3. Passport.js with Local Strategy
**Pros:** Flexible, widely used
**Cons:** Manual session management, more code
**Rejected:** Firebase provides better DX

## Related Decisions
- ADR-002: Database Selection (user roles stored in MongoDB)
- ADR-005: API Design (token-based authentication)

---

*Author: Development Team*
*Reviewed: January 2, 2026*
