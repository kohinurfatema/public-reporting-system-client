# Database Schema Documentation

## Public Infrastructure Issue Reporting System

**Database:** MongoDB
**ODM:** Mongoose
**Version:** 1.0.0
**Last Updated:** January 2, 2026

---

## Overview

The system uses MongoDB as its primary database with three main collections: Users, Issues, and Payments. The schema is designed to support the multi-role workflow of issue reporting, assignment, and resolution.

---

## Collections

### 1. Users Collection

Stores all user information including citizens, staff, and admins.

#### Schema Definition

```javascript
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  photoURL: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['citizen', 'staff', 'admin'],
    default: 'citizen'
  },
  phone: {
    type: String,
    default: ''
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  issueCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | String | Yes | Unique identifier, used for auth |
| `name` | String | Yes | Display name |
| `photoURL` | String | No | Profile picture URL (ImgBB) |
| `role` | String | Yes | User role: citizen/staff/admin |
| `phone` | String | No | Contact number (staff only) |
| `isPremium` | Boolean | No | Premium subscription status |
| `isBlocked` | Boolean | No | Account blocked by admin |
| `issueCount` | Number | No | Total issues submitted |
| `createdAt` | Date | No | Account creation timestamp |

#### Indexes

```javascript
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });
```

#### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "email": "citizen@example.com",
  "name": "John Doe",
  "photoURL": "https://i.ibb.co/xxx/photo.jpg",
  "role": "citizen",
  "phone": "",
  "isPremium": false,
  "isBlocked": false,
  "issueCount": 2,
  "createdAt": "2025-12-15T10:30:00.000Z"
}
```

---

### 2. Issues Collection

Stores all reported infrastructure issues with embedded timeline.

#### Schema Definition

```javascript
const TimelineSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  },
  updatedByRole: {
    type: String,
    enum: ['citizen', 'staff', 'admin', 'system'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const IssueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Pothole',
      'Streetlight',
      'Water Leakage',
      'Garbage',
      'Footpath',
      'Drainage',
      'Traffic Signal',
      'Road Damage',
      'Other'
    ]
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Working', 'Resolved', 'Closed', 'Rejected'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Normal', 'High'],
    default: 'Normal'
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  reporterEmail: {
    type: String,
    required: true
  },
  reporterName: {
    type: String,
    required: true
  },
  assignedStaff: {
    type: String,
    default: null
  },
  assignedStaffName: {
    type: String,
    default: null
  },
  upvotes: [{
    type: String  // Array of user emails
  }],
  upvoteCount: {
    type: Number,
    default: 0
  },
  timeline: [TimelineSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Issue title (max 200 chars) |
| `description` | String | Yes | Detailed description (max 2000 chars) |
| `category` | String | Yes | Issue category (enum) |
| `status` | String | Yes | Current workflow status |
| `priority` | String | Yes | Normal or High (boosted) |
| `location` | String | Yes | Physical location |
| `image` | String | Yes | Issue photo URL |
| `reporterEmail` | String | Yes | Citizen who reported |
| `reporterName` | String | Yes | Reporter's display name |
| `assignedStaff` | String | No | Staff email (if assigned) |
| `assignedStaffName` | String | No | Staff name (if assigned) |
| `upvotes` | Array | No | List of user emails who upvoted |
| `upvoteCount` | Number | No | Total upvote count |
| `timeline` | Array | No | Embedded timeline entries |
| `createdAt` | Date | No | Issue creation timestamp |
| `updatedAt` | Date | No | Last update timestamp |

#### Timeline Entry Structure

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | Status at this point |
| `message` | String | Description of action |
| `updatedBy` | String | Email of person who made change |
| `updatedByRole` | String | Role: citizen/staff/admin/system |
| `timestamp` | Date | When action occurred |

#### Indexes

```javascript
IssueSchema.index({ reporterEmail: 1 });
IssueSchema.index({ assignedStaff: 1 });
IssueSchema.index({ status: 1 });
IssueSchema.index({ priority: -1, createdAt: -1 });
IssueSchema.index({ category: 1 });
IssueSchema.index({ createdAt: -1 });
IssueSchema.index({ title: 'text', location: 'text', category: 'text' });
```

#### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "title": "Large Pothole on Main Street",
  "description": "There is a dangerous pothole approximately 2 feet wide...",
  "category": "Pothole",
  "status": "In-Progress",
  "priority": "High",
  "location": "123 Main Street, Downtown",
  "image": "https://i.ibb.co/xxx/pothole.jpg",
  "reporterEmail": "citizen@example.com",
  "reporterName": "John Doe",
  "assignedStaff": "staff@example.com",
  "assignedStaffName": "Jane Smith",
  "upvotes": ["user1@example.com", "user2@example.com"],
  "upvoteCount": 2,
  "timeline": [
    {
      "status": "Pending",
      "message": "Issue reported by citizen",
      "updatedBy": "citizen@example.com",
      "updatedByRole": "citizen",
      "timestamp": "2025-12-15T10:30:00.000Z"
    },
    {
      "status": "Pending",
      "message": "Issue priority boosted to High",
      "updatedBy": "citizen@example.com",
      "updatedByRole": "system",
      "timestamp": "2025-12-15T11:00:00.000Z"
    },
    {
      "status": "Pending",
      "message": "Issue assigned to Staff: Jane Smith",
      "updatedBy": "admin@example.com",
      "updatedByRole": "admin",
      "timestamp": "2025-12-16T09:00:00.000Z"
    },
    {
      "status": "In-Progress",
      "message": "Work started on the issue",
      "updatedBy": "staff@example.com",
      "updatedByRole": "staff",
      "timestamp": "2025-12-16T14:00:00.000Z"
    }
  ],
  "createdAt": "2025-12-15T10:30:00.000Z",
  "updatedAt": "2025-12-16T14:00:00.000Z"
}
```

---

### 3. Payments Collection

Stores all payment transactions for boosts and subscriptions.

#### Schema Definition

```javascript
const PaymentSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['boost', 'subscription'],
    required: true
  },
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    default: null  // Only for boost payments
  },
  issueTitle: {
    type: String,
    default: null  // Only for boost payments
  },
  transactionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userEmail` | String | Yes | Payer's email |
| `userName` | String | Yes | Payer's name |
| `amount` | Number | Yes | Payment amount in BDT |
| `type` | String | Yes | boost (100tk) or subscription (1000tk) |
| `issueId` | ObjectId | No | Reference to boosted issue |
| `issueTitle` | String | No | Title of boosted issue |
| `transactionId` | String | Yes | Unique transaction identifier |
| `status` | String | Yes | Payment status |
| `createdAt` | Date | No | Payment timestamp |

#### Indexes

```javascript
PaymentSchema.index({ userEmail: 1 });
PaymentSchema.index({ type: 1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ transactionId: 1 }, { unique: true });
```

#### Sample Document

```json
{
  "_id": "ObjectId('...')",
  "userEmail": "citizen@example.com",
  "userName": "John Doe",
  "amount": 100,
  "type": "boost",
  "issueId": "ObjectId('...')",
  "issueTitle": "Large Pothole on Main Street",
  "transactionId": "TXN_1702654321_abc123",
  "status": "completed",
  "createdAt": "2025-12-15T11:00:00.000Z"
}
```

---

## Relationships

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     RELATIONSHIPS                                │
└─────────────────────────────────────────────────────────────────┘

Users (1) ────────────── (N) Issues
  │         reports              │
  │                              │
  │                              │
Users (1) ────────────── (N) Issues
  │       is assigned to         │
  │                              │
  │                              │
Users (1) ────────────── (N) Payments
  │         makes                │
  │                              │
  │                              │
Issues (1) ───────────── (N) Payments
            has boost for
```

### Relationship Details

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Issues (Reporter) | One-to-Many | A user can report many issues |
| User → Issues (Staff) | One-to-Many | A staff can be assigned many issues |
| User → Payments | One-to-Many | A user can make many payments |
| Issue → Payments | One-to-Many | An issue can have one boost payment |

---

## Data Integrity Rules

### Business Rules

1. **User Limits**
   - Free users: max 3 issues (tracked by `issueCount`)
   - Premium users: unlimited issues
   - Blocked users: cannot create/edit/upvote

2. **Issue Workflow**
   - Status progression: Pending → In-Progress → Working → Resolved → Closed
   - Only pending issues can be edited/deleted by reporter
   - Only pending issues can be rejected by admin

3. **Upvoting**
   - Users cannot upvote their own issues
   - Each user can upvote an issue only once
   - Upvote emails stored in array for verification

4. **Timeline Immutability**
   - Timeline entries are append-only
   - Cannot be edited or deleted

### Validation Rules

```javascript
// Email validation
email: {
  type: String,
  required: true,
  match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
}

// Status transitions
const validTransitions = {
  'Pending': ['In-Progress', 'Rejected'],
  'In-Progress': ['Working'],
  'Working': ['Resolved'],
  'Resolved': ['Closed'],
  'Closed': [],
  'Rejected': []
};
```

---

## Aggregation Queries

### Dashboard Statistics

```javascript
// Admin Dashboard Stats
db.issues.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: 1 },
      pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
      resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
      rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } }
    }
  }
]);

// Category Distribution
db.issues.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// Staff Performance
db.issues.aggregate([
  { $match: { assignedStaff: { $ne: null } } },
  {
    $group: {
      _id: '$assignedStaff',
      assigned: { $sum: 1 },
      resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } }
    }
  }
]);
```

---

## Migration History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | Dec 10, 2025 | Initial schema creation |
| 1.0.1 | Dec 15, 2025 | Added upvotes array to Issues |
| 1.0.2 | Dec 18, 2025 | Added Timeline embedded document |
| 1.0.3 | Dec 20, 2025 | Added Payment collection |

---

## Backup & Recovery

### Backup Strategy

- **Frequency**: Daily automated backups (MongoDB Atlas)
- **Retention**: 7 days
- **Point-in-time Recovery**: Available on Atlas

### Export Commands

```bash
# Export all collections
mongodump --uri="mongodb+srv://..." --out=./backup

# Export specific collection
mongoexport --uri="mongodb+srv://..." --collection=issues --out=issues.json
```

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
