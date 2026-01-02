# ADR-005: API Design

## Status
**Accepted**

## Date
December 12, 2025

## Context

The backend needs to expose APIs for:
- User management
- Issue CRUD operations
- Role-specific operations (admin, staff)
- Payment processing
- Statistics and reporting

Design considerations:
- RESTful principles
- Authentication and authorization
- Pagination for large datasets
- Error handling consistency
- API versioning strategy

## Decision

We chose a **RESTful API** design with **route-based authorization**.

### URL Structure

```
Base URL: /api/v1 (implicit, no versioning currently)

/users          - User management
/issues         - Issue operations
/admin          - Admin-only operations
/staff          - Staff-only operations
/payments       - Payment operations
```

### Implementation Details

**Route Organization:**
```javascript
// index.js
app.use('/users', userRoutes);
app.use('/issues', issueRoutes);
app.use('/admin', verifyToken, verifyAdmin, adminRoutes);
app.use('/staff', verifyToken, verifyStaff, staffRoutes);
app.use('/payments', verifyToken, paymentRoutes);
```

**Middleware Chain:**
```
Public:    Route Handler
Protected: verifyToken → Route Handler
Admin:     verifyToken → verifyAdmin → Route Handler
Staff:     verifyToken → verifyStaff → Route Handler
```

**Pagination Pattern:**
```javascript
// Query parameters
GET /issues?page=1&limit=10&status=Pending&search=pothole

// Response format
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Consequences

### Positive
- **Intuitive URLs**: Resource-based paths are self-documenting
- **Role Separation**: Clear route prefixes for different roles
- **Standard Methods**: GET, POST, PATCH, DELETE as expected
- **Middleware Reuse**: Auth middleware applied at route level
- **Client Simplicity**: Easy to construct API calls

### Negative
- **No API Versioning**: Breaking changes require coordination
- **Some Redundancy**: Similar endpoints across roles
- **No GraphQL**: Fixed response shapes

### Neutral
- Express routing is straightforward
- Manual query parameter parsing

## API Conventions

### HTTP Methods

| Method | Usage | Example |
|--------|-------|---------|
| GET | Read resources | GET /issues |
| POST | Create resource | POST /issues |
| PATCH | Partial update | PATCH /issues/:id |
| DELETE | Remove resource | DELETE /issues/:id |

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Issue created successfully",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Issue not found",
  "error": "NOT_FOUND"
}
```

### Status Codes

| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## Alternatives Considered

### 1. GraphQL
**Pros:** Flexible queries, no over-fetching, strong typing
**Cons:** Learning curve, complexity, caching challenges
**Rejected:** REST sufficient for project scope

### 2. tRPC
**Pros:** Type-safe, no code generation, great DX
**Cons:** Requires TypeScript, less common
**Rejected:** Adding TypeScript would increase scope

### 3. JSON:API Specification
**Pros:** Standardized, relationship handling
**Cons:** More complex responses, learning curve
**Rejected:** Over-engineered for project needs

## Authentication Flow

```
1. Client sends request with Authorization header
2. verifyToken middleware extracts and validates token
3. req.user populated with decoded token
4. Role middleware checks user role from MongoDB
5. Handler processes request if authorized
```

## Related Decisions
- ADR-001: Authentication Strategy
- ADR-002: Database Selection
- ADR-004: State Management

---

*Author: Development Team*
*Reviewed: January 2, 2026*
