# Recommendations & Best Practices

## Public Infrastructure Issue Reporting System

**Version:** 1.0.0
**Last Updated:** January 2, 2026

---

## Executive Summary

This document provides actionable recommendations to improve code quality, performance, security, and maintainability of the application.

---

## Priority Matrix

| Priority | Category | Impact | Effort |
|----------|----------|--------|--------|
| P0 | Critical | High | Any |
| P1 | High | High | Low-Medium |
| P2 | Medium | Medium | Medium |
| P3 | Low | Low | High |

---

## 1. Architecture Improvements

### P1: Implement Feature-Based Architecture

**Current State:** Components scattered across folders
**Recommended:** Group by feature for better maintainability

```bash
# Proposed structure
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.js
│   ├── issues/
│   └── dashboard/
├── shared/
│   ├── components/ui/
│   ├── hooks/
│   └── utils/
└── pages/
```

**Benefits:**
- Better code organization
- Easier to find related code
- Simpler dependency management
- Better for team scaling

---

### P1: Implement Service Layer Pattern

**Current State:** API calls directly in components
**Recommended:** Abstract API calls through service layer

```javascript
// services/issueService.js
export const issueService = {
  getAll: async (filters) => {
    const response = await axiosSecure.get('/issues', { params: filters });
    return response.data;
  },

  create: async (data) => {
    const response = await axiosSecure.post('/issues', data);
    return response.data;
  },

  // ... other methods
};

// Usage in hooks
const useIssues = (filters) => {
  return useQuery({
    queryKey: ['issues', filters],
    queryFn: () => issueService.getAll(filters)
  });
};
```

**Benefits:**
- Single source of truth for API calls
- Easier to mock in tests
- Centralized error handling
- Type safety with TypeScript

---

### P2: Implement Repository Pattern (Server)

**Current State:** Database operations in route handlers
**Recommended:** Abstract database operations

```javascript
// repositories/issueRepository.js
class IssueRepository {
  async findAll(query, options) {
    return Issue.find(query)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit);
  }

  async findById(id) {
    return Issue.findById(id);
  }

  async create(data) {
    return Issue.create(data);
  }

  // ... other methods
}

export default new IssueRepository();
```

**Benefits:**
- Database-agnostic code
- Easier to test with mocks
- Centralized query logic
- Better separation of concerns

---

## 2. Code Quality Improvements

### P0: Add Input Validation

**Current State:** Limited validation
**Recommended:** Comprehensive validation with Zod/Joi

```javascript
// Server: validation schemas
import Joi from 'joi';

export const createIssueSchema = Joi.object({
  title: Joi.string().min(3).max(200).required()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string().max(2000).required(),
  category: Joi.string().valid(...VALID_CATEGORIES).required(),
  location: Joi.string().min(3).required(),
  image: Joi.string().uri().required()
});

// Middleware
export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    });
  }

  req.body = value;
  next();
};
```

---

### P1: Implement Proper Error Handling

**Current State:** Basic try-catch
**Recommended:** Custom error classes with centralized handling

```javascript
// errors/AppError.js
export class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

export class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(errors) {
    super('Validation failed', 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

// Centralized handler
export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.uid
  });

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      errors: err.errors
    });
  }

  // Don't leak internal errors
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
};
```

---

### P1: Add Constants File

**Current State:** Magic strings/numbers scattered
**Recommended:** Centralized constants

```javascript
// constants/index.js

// Issue
export const ISSUE_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In-Progress',
  WORKING: 'Working',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected'
};

export const ISSUE_PRIORITY = {
  NORMAL: 'Normal',
  HIGH: 'High'
};

export const ISSUE_CATEGORIES = [
  'Pothole',
  'Streetlight',
  'Water Leakage',
  'Garbage',
  'Footpath',
  'Drainage',
  'Traffic Signal',
  'Road Damage',
  'Other'
];

// User
export const USER_ROLES = {
  CITIZEN: 'citizen',
  STAFF: 'staff',
  ADMIN: 'admin'
};

export const FREE_USER_ISSUE_LIMIT = 3;
export const BOOST_PRICE = 100;
export const SUBSCRIPTION_PRICE = 1000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// Validation
export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 200;
export const DESCRIPTION_MAX_LENGTH = 2000;

// Status workflow
export const STATUS_TRANSITIONS = {
  [ISSUE_STATUS.PENDING]: [ISSUE_STATUS.IN_PROGRESS, ISSUE_STATUS.REJECTED],
  [ISSUE_STATUS.IN_PROGRESS]: [ISSUE_STATUS.WORKING],
  [ISSUE_STATUS.WORKING]: [ISSUE_STATUS.RESOLVED],
  [ISSUE_STATUS.RESOLVED]: [ISSUE_STATUS.CLOSED],
  [ISSUE_STATUS.CLOSED]: [],
  [ISSUE_STATUS.REJECTED]: []
};
```

---

## 3. Performance Improvements

### P1: Implement Skeleton Loaders

**Current State:** Basic spinner
**Recommended:** Content-aware skeleton loaders

```jsx
// components/ui/Skeleton/index.jsx
export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const IssueCardSkeleton = () => (
  <div className="card bg-white shadow">
    <Skeleton className="h-48 w-full rounded-t-lg" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export const IssueListSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <IssueCardSkeleton key={i} />
    ))}
  </div>
);

// Usage
const IssueList = () => {
  const { data, isLoading } = useIssues();

  if (isLoading) return <IssueListSkeleton />;

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.issues.map(issue => <IssueCard key={issue._id} issue={issue} />)}
    </div>
  );
};
```

---

### P2: Optimize TanStack Query Configuration

```javascript
// lib/queryClient.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes
      staleTime: 5 * 60 * 1000,

      // Cache for 10 minutes
      gcTime: 10 * 60 * 1000,

      // Don't refetch on window focus (configurable per query)
      refetchOnWindowFocus: false,

      // Retry failed requests once
      retry: 1,

      // Retry after 1 second
      retryDelay: 1000,

      // Show stale data while revalidating
      placeholderData: (previousData) => previousData
    },
    mutations: {
      // Retry mutations once
      retry: 1
    }
  }
});

// Query keys factory
export const queryKeys = {
  issues: {
    all: ['issues'],
    lists: () => [...queryKeys.issues.all, 'list'],
    list: (filters) => [...queryKeys.issues.lists(), filters],
    details: () => [...queryKeys.issues.all, 'detail'],
    detail: (id) => [...queryKeys.issues.details(), id],
    user: (email) => [...queryKeys.issues.all, 'user', email],
    stats: (email) => [...queryKeys.issues.all, 'stats', email]
  },
  users: {
    all: ['users'],
    detail: (email) => [...queryKeys.users.all, email],
    role: (email) => [...queryKeys.users.all, 'role', email]
  },
  payments: {
    all: ['payments'],
    user: (email) => [...queryKeys.payments.all, 'user', email]
  }
};
```

---

### P2: Add Database Indexes

```javascript
// models/Issue.js - ensure proper indexes
IssueSchema.index({ reporterEmail: 1 });
IssueSchema.index({ assignedStaff: 1 });
IssueSchema.index({ status: 1 });
IssueSchema.index({ category: 1 });
IssueSchema.index({ priority: -1, createdAt: -1 });
IssueSchema.index({ createdAt: -1 });

// Text index for search
IssueSchema.index(
  { title: 'text', location: 'text', category: 'text' },
  { weights: { title: 10, location: 5, category: 3 } }
);

// Compound index for common queries
IssueSchema.index({ status: 1, priority: -1, createdAt: -1 });
```

---

## 4. Security Improvements

### P0: Add Input Sanitization

```javascript
// middleware/sanitize.js
import sanitizeHtml from 'sanitize-html';

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, sanitizeValue(v)])
    );
  }
  return value;
};

export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  next();
};

// Apply globally
app.use(express.json());
app.use(sanitizeBody);
```

---

### P1: Add Rate Limiting

```javascript
// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// General API limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict limit for auth
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts'
  }
});

// Limit for creating issues
export const createIssueLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many issues created, please try again later'
  }
});
```

---

### P1: Add Security Headers

```javascript
// middleware/security.js
import helmet from 'helmet';

export const securityMiddleware = [
  helmet(),
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://i.ibb.co', 'https://*.firebaseapp.com'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://*.firebase.com', 'https://*.firebaseio.com']
    }
  }),
  helmet.referrerPolicy({ policy: 'same-origin' })
];

// Apply
app.use(securityMiddleware);
```

---

## 5. Testing Recommendations

### P1: Set Up Testing Framework

```javascript
// Client: vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
});

// src/test/setup.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn()
}));
```

---

### P2: Write Critical Path Tests

```javascript
// Test examples

// hooks/useAuth.test.jsx
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('returns user when logged in', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toBeDefined();
    });
  });

  it('returns null when logged out', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });
});

// services/issueService.test.js
import { issueService } from './issueService';
import { axiosSecure } from '../lib/axios';

vi.mock('../lib/axios');

describe('issueService', () => {
  it('fetches issues with correct params', async () => {
    const mockData = { data: { issues: [], pagination: {} } };
    axiosSecure.get.mockResolvedValue(mockData);

    const result = await issueService.getAll({ status: 'Pending' });

    expect(axiosSecure.get).toHaveBeenCalledWith('/issues', {
      params: { status: 'Pending' }
    });
    expect(result).toEqual(mockData.data);
  });
});
```

---

## 6. Developer Experience

### P2: Add Pre-commit Hooks

```json
// package.json
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx",
    "lint:fix": "eslint src --ext .js,.jsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,css}",
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{css,json,md}": "prettier --write"
  }
}
```

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

---

### P2: Add TypeScript (Future)

```typescript
// types/issue.ts
export interface Issue {
  _id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  location: string;
  image: string;
  reporterEmail: string;
  reporterName: string;
  assignedStaff: string | null;
  assignedStaffName: string | null;
  upvotes: string[];
  upvoteCount: number;
  timeline: TimelineEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export type IssueCategory =
  | 'Pothole'
  | 'Streetlight'
  | 'Water Leakage'
  | 'Garbage'
  | 'Footpath'
  | 'Drainage'
  | 'Traffic Signal'
  | 'Road Damage'
  | 'Other';

export type IssueStatus =
  | 'Pending'
  | 'In-Progress'
  | 'Working'
  | 'Resolved'
  | 'Closed'
  | 'Rejected';
```

---

## Implementation Roadmap

### Phase 1: Critical (Week 1)
- [ ] Add input validation (Joi/Zod)
- [ ] Implement centralized error handling
- [ ] Add input sanitization
- [ ] Create constants file

### Phase 2: High Priority (Week 2)
- [ ] Implement service layer pattern
- [ ] Add skeleton loaders
- [ ] Set up rate limiting
- [ ] Add security headers

### Phase 3: Medium Priority (Week 3)
- [ ] Refactor to feature-based architecture
- [ ] Implement repository pattern
- [ ] Optimize TanStack Query config
- [ ] Add database indexes

### Phase 4: Testing (Week 4)
- [ ] Set up Vitest
- [ ] Write hook tests
- [ ] Write service tests
- [ ] Write component tests

### Phase 5: DX Improvements (Week 5)
- [ ] Add pre-commit hooks
- [ ] Set up ESLint + Prettier
- [ ] Add TypeScript (optional)
- [ ] Set up CI/CD

---

## Quick Wins (Implement Now)

1. **Constants file** - 30 mins
2. **Custom error classes** - 1 hour
3. **Rate limiting** - 30 mins
4. **Skeleton loader component** - 1 hour
5. **Query keys factory** - 30 mins

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
