# ADR-002: Database Selection

## Status
**Accepted**

## Date
December 10, 2025

## Context

The application requires a database to store:
- User profiles and roles
- Infrastructure issues with embedded timeline
- Payment transactions
- Upvote tracking

Key requirements:
- Flexible schema for evolving issue data
- Embedded documents for timeline entries
- Array operations for upvotes
- Efficient querying for dashboards
- Free hosting option

## Decision

We chose **MongoDB** with **Mongoose ODM**, hosted on **MongoDB Atlas**.

### Implementation Details

**Schema Design:**
- Document-based model fits issue data naturally
- Embedded Timeline subdocuments for audit history
- Array field for upvote tracking
- References via email strings (not ObjectId) for simplicity

```javascript
// Embedded Timeline Pattern
const IssueSchema = new mongoose.Schema({
  // ... other fields
  timeline: [{
    status: String,
    message: String,
    updatedBy: String,
    timestamp: Date
  }]
});
```

**Hosting:**
- MongoDB Atlas M0 (Free tier)
- 512MB storage
- Shared cluster

## Consequences

### Positive
- **Schema Flexibility**: Easy to add fields without migrations
- **Embedded Documents**: Timeline entries co-located with issues
- **Array Operations**: Native support for upvote tracking (`$addToSet`, `$pull`)
- **JSON Compatibility**: Natural fit with JavaScript/Node.js
- **Free Tier**: Sufficient for development and demo
- **Aggregation Pipeline**: Powerful queries for dashboard statistics

### Negative
- **No Transactions** (in free tier): Must handle consistency manually
- **No Foreign Keys**: Referential integrity not enforced
- **Query Complexity**: Joins require `$lookup` aggregation
- **Storage Limits**: 512MB on free tier

### Neutral
- Learning curve for aggregation pipelines
- Different mental model from relational databases

## Alternatives Considered

### 1. PostgreSQL
**Pros:** ACID compliance, strong consistency, relational model
**Cons:** Schema migrations required, less flexible, JSON support secondary
**Rejected:** Document model better fits issue data with variable fields

### 2. Firebase Firestore
**Pros:** Real-time sync, Firebase ecosystem integration
**Cons:** Query limitations, pricing complexity, vendor lock-in
**Rejected:** MongoDB offers more query flexibility

### 3. MySQL
**Pros:** Widely used, strong tooling
**Cons:** Rigid schema, poor JSON support
**Rejected:** Not suitable for semi-structured data

### 4. SQLite
**Pros:** Simple, no server needed
**Cons:** Not suitable for production, no cloud hosting
**Rejected:** Not scalable

## Data Model Decisions

### Why Email as Reference (not ObjectId)?
- Firebase Auth uses email as primary identifier
- Simplifies queries and debugging
- No need for population in most cases

### Why Embedded Timeline?
- Timeline entries always accessed with issue
- No need for separate queries
- Atomic updates

### Why Array for Upvotes?
- Easy to check if user already upvoted
- Simple increment/decrement
- No need for separate collection

## Related Decisions
- ADR-001: Authentication Strategy (user roles in MongoDB)
- ADR-005: API Design (pagination, filtering)

---

*Author: Development Team*
*Reviewed: January 2, 2026*
