# API Documentation

## Public Infrastructure Issue Reporting System

**Base URL:** `https://public-reporting-system-server-kappa.vercel.app`
**Version:** 1.0.0
**Last Updated:** January 2, 2026

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Endpoints](#user-endpoints)
3. [Issue Endpoints](#issue-endpoints)
4. [Admin Endpoints](#admin-endpoints)
5. [Staff Endpoints](#staff-endpoints)
6. [Payment Endpoints](#payment-endpoints)
7. [Error Handling](#error-handling)

---

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header.

```
Authorization: Bearer <firebase_id_token>
```

### Token Acquisition

```javascript
// Client-side token retrieval
const token = await firebase.auth().currentUser.getIdToken();
```

### Authentication Levels

| Level | Description | Middleware |
|-------|-------------|------------|
| Public | No authentication required | None |
| Protected | Valid Firebase token required | `verifyToken` |
| Admin | Token + Admin role required | `verifyToken` + `verifyAdmin` |
| Staff | Token + Staff role required | `verifyToken` + `verifyStaff` |

---

## User Endpoints

### Create User

Creates a new user in the database after Firebase registration.

```
POST /users
```

**Auth Level:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "photoURL": "https://i.ibb.co/xxx/photo.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "email": "user@example.com",
    "name": "John Doe",
    "photoURL": "https://i.ibb.co/xxx/photo.jpg",
    "role": "citizen",
    "isPremium": false,
    "isBlocked": false,
    "issueCount": 0,
    "createdAt": "2025-12-15T10:30:00.000Z"
  }
}
```

---

### Get User Profile

```
GET /users/:email
```

**Auth Level:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "name": "John Doe",
    "photoURL": "https://i.ibb.co/xxx/photo.jpg",
    "role": "citizen",
    "isPremium": false,
    "isBlocked": false,
    "issueCount": 2,
    "createdAt": "2025-12-15T10:30:00.000Z"
  }
}
```

---

### Update User Profile

```
PATCH /users/:email
```

**Auth Level:** Protected

**Request Body:**
```json
{
  "name": "John Updated",
  "photoURL": "https://i.ibb.co/xxx/new-photo.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

### Upgrade to Premium

```
PATCH /users/upgrade/:email
```

**Auth Level:** Protected

**Response (200):**
```json
{
  "success": true,
  "message": "Upgraded to premium successfully",
  "data": {
    "isPremium": true
  }
}
```

---

## Issue Endpoints

### Get All Issues (Paginated)

```
GET /issues
```

**Auth Level:** Public

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| search | string | - | Search in title, category, location |
| status | string | - | Filter by status |
| priority | string | - | Filter by priority |
| category | string | - | Filter by category |

**Example:**
```
GET /issues?page=1&limit=10&status=Pending&search=pothole
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Large Pothole on Main Street",
      "description": "...",
      "category": "Pothole",
      "status": "Pending",
      "priority": "High",
      "location": "123 Main Street",
      "image": "https://i.ibb.co/xxx/issue.jpg",
      "reporterEmail": "user@example.com",
      "reporterName": "John Doe",
      "upvoteCount": 5,
      "createdAt": "2025-12-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### Get Latest Resolved Issues

```
GET /issues/latest-resolved
```

**Auth Level:** Public

**Response (200):**
```json
{
  "success": true,
  "data": [
    // 6 most recently resolved issues
  ]
}
```

---

### Create Issue

```
POST /issues
```

**Auth Level:** Protected

**Request Body:**
```json
{
  "title": "Broken Streetlight",
  "description": "The streetlight at the corner has been out for 3 days",
  "category": "Streetlight",
  "location": "456 Oak Avenue",
  "image": "https://i.ibb.co/xxx/streetlight.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Issue reported successfully",
  "data": {
    "_id": "...",
    "title": "Broken Streetlight",
    "status": "Pending",
    "priority": "Normal",
    "timeline": [
      {
        "status": "Pending",
        "message": "Issue reported by citizen",
        "updatedBy": "user@example.com",
        "updatedByRole": "citizen",
        "timestamp": "2025-12-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Error (403) - Issue Limit:**
```json
{
  "success": false,
  "message": "Free users can only report 3 issues. Please upgrade to premium.",
  "error": "ISSUE_LIMIT_REACHED"
}
```

---

### Get User's Issues

```
GET /issues/user/:email
```

**Auth Level:** Protected

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status |
| category | string | Filter by category |

**Response (200):**
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

### Get User Statistics

```
GET /issues/stats/:email
```

**Auth Level:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "pending": 2,
    "inProgress": 1,
    "resolved": 2,
    "totalPayments": 1100
  }
}
```

---

### Get Single Issue

```
GET /issues/:id
```

**Auth Level:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "...",
    "description": "...",
    "category": "...",
    "status": "...",
    "priority": "...",
    "location": "...",
    "image": "...",
    "reporterEmail": "...",
    "reporterName": "...",
    "assignedStaff": "...",
    "assignedStaffName": "...",
    "upvotes": ["user1@example.com"],
    "upvoteCount": 1,
    "timeline": [ ... ],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Update Issue

```
PATCH /issues/:id
```

**Auth Level:** Protected (Owner only, Pending status only)

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "Pothole",
  "location": "New location"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Issue updated successfully"
}
```

---

### Delete Issue

```
DELETE /issues/:id
```

**Auth Level:** Protected (Owner only, Pending status only)

**Response (200):**
```json
{
  "success": true,
  "message": "Issue deleted successfully"
}
```

---

### Boost Issue Priority

```
PATCH /issues/boost/:id
```

**Auth Level:** Protected

**Response (200):**
```json
{
  "success": true,
  "message": "Issue priority boosted to High",
  "data": {
    "priority": "High"
  }
}
```

---

### Upvote Issue

```
PATCH /issues/:id/upvote
```

**Auth Level:** Protected

**Response (200):**
```json
{
  "success": true,
  "message": "Issue upvoted successfully",
  "data": {
    "upvoteCount": 6
  }
}
```

**Error (400) - Already Upvoted:**
```json
{
  "success": false,
  "message": "You have already upvoted this issue"
}
```

---

## Admin Endpoints

All admin endpoints require `verifyToken` + `verifyAdmin` middleware.

### Get Admin Statistics

```
GET /admin/stats
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalIssues": 100,
    "pendingIssues": 30,
    "resolvedIssues": 50,
    "rejectedIssues": 5,
    "totalPayments": 15000,
    "totalUsers": 50,
    "totalStaff": 5
  }
}
```

---

### Get All Issues (Admin)

```
GET /admin/issues
```

**Query Parameters:** Same as public GET /issues

**Response (200):** Same format with all issues

---

### Assign Staff to Issue

```
PATCH /admin/issues/:id/assign
```

**Request Body:**
```json
{
  "staffEmail": "staff@example.com",
  "staffName": "Jane Smith"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Staff assigned successfully"
}
```

---

### Reject Issue

```
PATCH /admin/issues/:id/reject
```

**Response (200):**
```json
{
  "success": true,
  "message": "Issue rejected successfully"
}
```

---

### Get All Citizens

```
GET /admin/users
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "email": "...",
      "name": "...",
      "role": "citizen",
      "isPremium": false,
      "isBlocked": false
    }
  ]
}
```

---

### Block/Unblock User

```
PATCH /admin/users/:email/block
```

**Request Body:**
```json
{
  "isBlocked": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User blocked successfully"
}
```

---

### Get All Staff

```
GET /admin/staff
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "email": "...",
      "name": "...",
      "phone": "...",
      "role": "staff"
    }
  ]
}
```

---

### Create Staff

```
POST /admin/staff
```

**Request Body:**
```json
{
  "email": "newstaff@example.com",
  "password": "password123",
  "name": "New Staff",
  "phone": "01712345678",
  "photoURL": "https://..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Staff created successfully"
}
```

---

### Update Staff

```
PATCH /admin/staff/:email
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "01798765432"
}
```

---

### Delete Staff

```
DELETE /admin/staff/:email
```

---

### Get All Payments

```
GET /admin/payments
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter: "boost" or "subscription" |

---

### Get Latest Data

```
GET /admin/latest
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "latestIssues": [ ... ],
    "latestUsers": [ ... ],
    "latestPayments": [ ... ]
  }
}
```

---

## Staff Endpoints

All staff endpoints require `verifyToken` + `verifyStaff` middleware.

### Get Staff Statistics

```
GET /staff/stats/:email
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assigned": 10,
    "resolved": 7,
    "pending": 2,
    "inProgress": 1
  }
}
```

---

### Get Assigned Issues

```
GET /staff/issues/:email
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status |
| priority | string | Filter by priority |

---

### Change Issue Status

```
PATCH /staff/issues/:id/status
```

**Request Body:**
```json
{
  "status": "In-Progress"
}
```

**Valid Status Transitions:**
- Pending → In-Progress
- In-Progress → Working
- Working → Resolved
- Resolved → Closed

---

## Payment Endpoints

### Create Payment

```
POST /payments
```

**Auth Level:** Protected

**Request Body:**
```json
{
  "amount": 100,
  "type": "boost",
  "issueId": "...",
  "issueTitle": "...",
  "transactionId": "TXN_xxx"
}
```

---

### Get User Payments

```
GET /payments/user/:email
```

---

### Get Invoice Data

```
GET /payments/invoice/:id
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "ERROR_CODE"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Invalid or missing token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid input data |
| ISSUE_LIMIT_REACHED | 403 | Free user issue limit |
| ALREADY_UPVOTED | 400 | User already upvoted |
| CANNOT_UPVOTE_OWN | 400 | Cannot upvote own issue |
| INVALID_STATUS_TRANSITION | 400 | Invalid workflow transition |
| SERVER_ERROR | 500 | Internal server error |

---

## Rate Limiting

Currently no rate limiting implemented. Consider for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 24, 2025 | Initial API release |

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
