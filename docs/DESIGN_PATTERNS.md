# Design Patterns Guide

## Public Infrastructure Issue Reporting System

**Version:** 1.0.0
**Last Updated:** January 2, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Creational Patterns](#creational-patterns)
3. [Structural Patterns](#structural-patterns)
4. [Behavioral Patterns](#behavioral-patterns)
5. [React-Specific Patterns](#react-specific-patterns)
6. [Node.js/Express Patterns](#nodejsexpress-patterns)
7. [Implementation Examples](#implementation-examples)

---

## Overview

Design patterns are reusable solutions to common problems in software design. This document outlines the patterns used in our project and provides implementation guidelines.

### Pattern Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| Creational | Object creation | Factory, Singleton, Builder |
| Structural | Object composition | Adapter, Decorator, Facade |
| Behavioral | Object communication | Observer, Strategy, Command |

---

## Creational Patterns

### 1. Factory Pattern

Creates objects without specifying the exact class to create.

**Use Cases:**
- Creating different types of notifications
- Generating timeline entries
- Creating API response objects

**Implementation:**

```javascript
// utils/factories/notificationFactory.js
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const createNotification = (type, message, options = {}) => {
  const baseConfig = {
    message,
    duration: options.duration || 3000,
    position: options.position || 'top-right'
  };

  switch (type) {
    case NotificationType.SUCCESS:
      return {
        ...baseConfig,
        icon: 'check-circle',
        className: 'bg-green-500',
        title: options.title || 'Success'
      };
    case NotificationType.ERROR:
      return {
        ...baseConfig,
        icon: 'x-circle',
        className: 'bg-red-500',
        title: options.title || 'Error',
        duration: options.duration || 5000
      };
    case NotificationType.WARNING:
      return {
        ...baseConfig,
        icon: 'alert-triangle',
        className: 'bg-yellow-500',
        title: options.title || 'Warning'
      };
    default:
      return {
        ...baseConfig,
        icon: 'info',
        className: 'bg-blue-500',
        title: options.title || 'Info'
      };
  }
};

// Usage
const notification = createNotification(
  NotificationType.SUCCESS,
  'Issue reported successfully!'
);
```

```javascript
// utils/factories/timelineFactory.js
export const TimelineAction = {
  CREATED: 'created',
  ASSIGNED: 'assigned',
  STATUS_CHANGED: 'status_changed',
  BOOSTED: 'boosted',
  REJECTED: 'rejected',
  CLOSED: 'closed'
};

export const createTimelineEntry = (action, data) => {
  const base = {
    timestamp: new Date(),
    ...data
  };

  const templates = {
    [TimelineAction.CREATED]: {
      status: 'Pending',
      message: 'Issue reported by citizen',
      updatedByRole: 'citizen'
    },
    [TimelineAction.ASSIGNED]: {
      status: 'Pending',
      message: `Issue assigned to Staff: ${data.staffName}`,
      updatedByRole: 'admin'
    },
    [TimelineAction.STATUS_CHANGED]: {
      status: data.newStatus,
      message: getStatusMessage(data.newStatus),
      updatedByRole: 'staff'
    },
    [TimelineAction.BOOSTED]: {
      status: data.currentStatus,
      message: 'Issue priority boosted to High',
      updatedByRole: 'system'
    },
    [TimelineAction.REJECTED]: {
      status: 'Rejected',
      message: 'Issue rejected by admin',
      updatedByRole: 'admin'
    }
  };

  return { ...base, ...templates[action] };
};

const getStatusMessage = (status) => {
  const messages = {
    'In-Progress': 'Work started on the issue',
    'Working': 'Issue is being actively worked on',
    'Resolved': 'Issue marked as resolved',
    'Closed': 'Issue closed'
  };
  return messages[status] || `Status changed to ${status}`;
};
```

### 2. Singleton Pattern

Ensures a class has only one instance.

**Use Cases:**
- Database connection
- Firebase app instance
- Query client instance

**Implementation:**

```javascript
// config/database.js (Server)
import mongoose from 'mongoose';

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.connection = null;
    Database.instance = this;
  }

  async connect(uri) {
    if (this.connection) {
      console.log('Using existing database connection');
      return this.connection;
    }

    try {
      this.connection = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Database connected successfully');
      return this.connection;
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  getConnection() {
    return this.connection;
  }
}

export default new Database();
```

```javascript
// lib/queryClient.js (Client)
import { QueryClient } from '@tanstack/react-query';

let queryClientInstance = null;

export const getQueryClient = () => {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          cacheTime: 10 * 60 * 1000,
          refetchOnWindowFocus: false,
          retry: 1
        }
      }
    });
  }
  return queryClientInstance;
};
```

### 3. Builder Pattern

Constructs complex objects step by step.

**Use Cases:**
- Building complex queries
- Creating form configurations
- Constructing API requests

**Implementation:**

```javascript
// utils/builders/QueryBuilder.js
export class IssueQueryBuilder {
  constructor() {
    this.query = {};
    this.options = {
      sort: { createdAt: -1 },
      skip: 0,
      limit: 10
    };
  }

  withStatus(status) {
    if (status) {
      this.query.status = status;
    }
    return this;
  }

  withPriority(priority) {
    if (priority) {
      this.query.priority = priority;
    }
    return this;
  }

  withCategory(category) {
    if (category) {
      this.query.category = category;
    }
    return this;
  }

  withSearch(searchTerm) {
    if (searchTerm) {
      this.query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { location: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    return this;
  }

  withReporter(email) {
    if (email) {
      this.query.reporterEmail = email;
    }
    return this;
  }

  withAssignedStaff(email) {
    if (email) {
      this.query.assignedStaff = email;
    }
    return this;
  }

  sortBy(field, order = 'desc') {
    this.options.sort = { [field]: order === 'desc' ? -1 : 1 };
    return this;
  }

  sortByPriorityFirst() {
    this.options.sort = { priority: -1, createdAt: -1 };
    return this;
  }

  paginate(page, limit) {
    this.options.skip = (page - 1) * limit;
    this.options.limit = limit;
    return this;
  }

  build() {
    return {
      query: this.query,
      options: this.options
    };
  }
}

// Usage
const { query, options } = new IssueQueryBuilder()
  .withStatus('Pending')
  .withCategory('Pothole')
  .withSearch('main street')
  .sortByPriorityFirst()
  .paginate(1, 10)
  .build();

const issues = await Issue.find(query)
  .sort(options.sort)
  .skip(options.skip)
  .limit(options.limit);
```

---

## Structural Patterns

### 4. Adapter Pattern

Converts one interface to another.

**Use Cases:**
- Adapting API responses
- Normalizing data from different sources
- Converting between formats

**Implementation:**

```javascript
// adapters/issueAdapter.js
export const adaptIssueFromAPI = (apiIssue) => ({
  id: apiIssue._id,
  title: apiIssue.title,
  description: apiIssue.description,
  category: apiIssue.category,
  status: apiIssue.status,
  priority: apiIssue.priority,
  location: apiIssue.location,
  imageUrl: apiIssue.image,
  reporter: {
    email: apiIssue.reporterEmail,
    name: apiIssue.reporterName
  },
  assignedTo: apiIssue.assignedStaff ? {
    email: apiIssue.assignedStaff,
    name: apiIssue.assignedStaffName
  } : null,
  votes: {
    count: apiIssue.upvoteCount,
    voters: apiIssue.upvotes
  },
  timeline: apiIssue.timeline?.map(adaptTimelineEntry) || [],
  createdAt: new Date(apiIssue.createdAt),
  updatedAt: new Date(apiIssue.updatedAt)
});

export const adaptIssueToAPI = (issue) => ({
  title: issue.title,
  description: issue.description,
  category: issue.category,
  location: issue.location,
  image: issue.imageUrl
});

const adaptTimelineEntry = (entry) => ({
  status: entry.status,
  message: entry.message,
  actor: {
    email: entry.updatedBy,
    role: entry.updatedByRole
  },
  timestamp: new Date(entry.timestamp)
});
```

### 5. Decorator Pattern

Adds behavior to objects dynamically.

**Use Cases:**
- Adding loading states to components
- Enhancing API calls with logging
- Adding authentication to requests

**Implementation:**

```javascript
// decorators/withLoading.jsx
import React from 'react';
import Spinner from '../components/ui/Spinner';

export const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner size="lg" />
        </div>
      );
    }
    return <WrappedComponent {...props} />;
  };
};

// Usage
const IssueList = ({ issues }) => (
  <div>{issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}</div>
);

const IssueListWithLoading = withLoading(IssueList);

// In component
<IssueListWithLoading isLoading={isLoading} issues={issues} />
```

```javascript
// decorators/withErrorBoundary.jsx
import React, { Component } from 'react';

export const withErrorBoundary = (WrappedComponent, FallbackComponent) => {
  return class ErrorBoundary extends Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return FallbackComponent ? (
          <FallbackComponent error={this.state.error} />
        ) : (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            Something went wrong. Please try again.
          </div>
        );
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};
```

### 6. Facade Pattern

Provides a simplified interface to complex subsystems.

**Use Cases:**
- API service layer
- Authentication operations
- Complex form handling

**Implementation:**

```javascript
// services/issueService.js
import axiosSecure from '../lib/axiosSecure';
import { adaptIssueFromAPI, adaptIssueToAPI } from '../adapters/issueAdapter';

class IssueService {
  constructor(axios) {
    this.axios = axios;
    this.baseURL = '/issues';
  }

  // Facade methods hide complexity
  async getAll(filters = {}) {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);

    const response = await this.axios.get(`${this.baseURL}?${params}`);

    return {
      issues: response.data.data.map(adaptIssueFromAPI),
      pagination: response.data.pagination
    };
  }

  async getById(id) {
    const response = await this.axios.get(`${this.baseURL}/${id}`);
    return adaptIssueFromAPI(response.data.data);
  }

  async create(issueData) {
    const payload = adaptIssueToAPI(issueData);
    const response = await this.axios.post(this.baseURL, payload);
    return adaptIssueFromAPI(response.data.data);
  }

  async update(id, issueData) {
    const payload = adaptIssueToAPI(issueData);
    const response = await this.axios.patch(`${this.baseURL}/${id}`, payload);
    return response.data;
  }

  async delete(id) {
    const response = await this.axios.delete(`${this.baseURL}/${id}`);
    return response.data;
  }

  async upvote(id) {
    const response = await this.axios.patch(`${this.baseURL}/${id}/upvote`);
    return response.data;
  }

  async boost(id) {
    const response = await this.axios.patch(`${this.baseURL}/boost/${id}`);
    return response.data;
  }

  async getUserIssues(email, filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);

    const response = await this.axios.get(
      `${this.baseURL}/user/${email}?${params}`
    );
    return response.data.data.map(adaptIssueFromAPI);
  }

  async getStats(email) {
    const response = await this.axios.get(`${this.baseURL}/stats/${email}`);
    return response.data.data;
  }
}

export default new IssueService(axiosSecure);
```

---

## Behavioral Patterns

### 7. Observer Pattern

Notifies multiple objects about state changes.

**Use Cases:**
- Auth state changes
- Real-time updates
- Event handling

**Implementation:**

```javascript
// patterns/EventEmitter.js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export const authEvents = new EventEmitter();

// Events
export const AUTH_EVENTS = {
  LOGIN: 'auth:login',
  LOGOUT: 'auth:logout',
  TOKEN_EXPIRED: 'auth:token_expired',
  ROLE_CHANGED: 'auth:role_changed'
};

// Usage in AuthProvider
authEvents.emit(AUTH_EVENTS.LOGIN, { user });

// Usage in components
useEffect(() => {
  const unsubscribe = authEvents.on(AUTH_EVENTS.LOGOUT, () => {
    navigate('/login');
  });
  return unsubscribe;
}, []);
```

### 8. Strategy Pattern

Defines a family of interchangeable algorithms.

**Use Cases:**
- Sorting strategies
- Validation strategies
- Payment methods

**Implementation:**

```javascript
// strategies/sortStrategies.js
export const SortStrategy = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  MOST_UPVOTED: 'most_upvoted',
  PRIORITY: 'priority',
  STATUS: 'status'
};

const sortStrategies = {
  [SortStrategy.NEWEST]: (a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt),

  [SortStrategy.OLDEST]: (a, b) =>
    new Date(a.createdAt) - new Date(b.createdAt),

  [SortStrategy.MOST_UPVOTED]: (a, b) =>
    b.upvoteCount - a.upvoteCount,

  [SortStrategy.PRIORITY]: (a, b) => {
    const priorityOrder = { High: 0, Normal: 1 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  },

  [SortStrategy.STATUS]: (a, b) => {
    const statusOrder = {
      Pending: 0,
      'In-Progress': 1,
      Working: 2,
      Resolved: 3,
      Closed: 4,
      Rejected: 5
    };
    return statusOrder[a.status] - statusOrder[b.status];
  }
};

export const sortIssues = (issues, strategy) => {
  const sortFn = sortStrategies[strategy];
  if (!sortFn) return issues;
  return [...issues].sort(sortFn);
};

// Usage
const sortedIssues = sortIssues(issues, SortStrategy.PRIORITY);
```

```javascript
// strategies/validationStrategies.js
export const ValidationStrategy = {
  REQUIRED: 'required',
  EMAIL: 'email',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  PATTERN: 'pattern'
};

const validationStrategies = {
  [ValidationStrategy.REQUIRED]: (value) => ({
    isValid: value !== undefined && value !== null && value !== '',
    message: 'This field is required'
  }),

  [ValidationStrategy.EMAIL]: (value) => ({
    isValid: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
    message: 'Please enter a valid email address'
  }),

  [ValidationStrategy.MIN_LENGTH]: (value, min) => ({
    isValid: value && value.length >= min,
    message: `Must be at least ${min} characters`
  }),

  [ValidationStrategy.MAX_LENGTH]: (value, max) => ({
    isValid: !value || value.length <= max,
    message: `Must be no more than ${max} characters`
  }),

  [ValidationStrategy.PATTERN]: (value, pattern) => ({
    isValid: pattern.test(value),
    message: 'Invalid format'
  })
};

export const validate = (value, rules) => {
  for (const rule of rules) {
    const { type, param } = typeof rule === 'string'
      ? { type: rule, param: undefined }
      : rule;

    const strategy = validationStrategies[type];
    if (strategy) {
      const result = strategy(value, param);
      if (!result.isValid) {
        return result;
      }
    }
  }
  return { isValid: true, message: null };
};

// Usage
const result = validate(email, [
  ValidationStrategy.REQUIRED,
  ValidationStrategy.EMAIL
]);
```

### 9. Command Pattern

Encapsulates a request as an object.

**Use Cases:**
- Undo/redo operations
- Action queuing
- Transaction logging

**Implementation:**

```javascript
// patterns/Command.js
class Command {
  execute() {
    throw new Error('execute() must be implemented');
  }

  undo() {
    throw new Error('undo() must be implemented');
  }
}

class UpdateIssueStatusCommand extends Command {
  constructor(issueService, issueId, newStatus, previousStatus) {
    super();
    this.issueService = issueService;
    this.issueId = issueId;
    this.newStatus = newStatus;
    this.previousStatus = previousStatus;
  }

  async execute() {
    return await this.issueService.updateStatus(this.issueId, this.newStatus);
  }

  async undo() {
    return await this.issueService.updateStatus(this.issueId, this.previousStatus);
  }
}

class CommandHistory {
  constructor() {
    this.history = [];
    this.position = -1;
  }

  async execute(command) {
    const result = await command.execute();

    // Remove any commands after current position (for redo)
    this.history = this.history.slice(0, this.position + 1);
    this.history.push(command);
    this.position++;

    return result;
  }

  async undo() {
    if (this.position < 0) return null;

    const command = this.history[this.position];
    const result = await command.undo();
    this.position--;

    return result;
  }

  async redo() {
    if (this.position >= this.history.length - 1) return null;

    this.position++;
    const command = this.history[this.position];
    return await command.execute();
  }

  canUndo() {
    return this.position >= 0;
  }

  canRedo() {
    return this.position < this.history.length - 1;
  }
}

export { Command, UpdateIssueStatusCommand, CommandHistory };
```

---

## React-Specific Patterns

### 10. Compound Components Pattern

Creates flexible component APIs.

**Implementation:**

```javascript
// components/ui/Card/index.jsx
import React, { createContext, useContext } from 'react';

const CardContext = createContext();

const Card = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-white shadow-md',
    bordered: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg'
  };

  return (
    <CardContext.Provider value={{ variant }}>
      <div className={`rounded-lg overflow-hidden ${variants[variant]} ${className}`}>
        {children}
      </div>
    </CardContext.Provider>
  );
};

Card.Header = ({ children, className = '' }) => (
  <div className={`px-4 py-3 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`px-4 py-3 bg-gray-50 border-t border-gray-100 ${className}`}>
    {children}
  </div>
);

Card.Image = ({ src, alt, className = '' }) => (
  <img src={src} alt={alt} className={`w-full h-48 object-cover ${className}`} />
);

Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

Card.Description = ({ children, className = '' }) => (
  <p className={`text-gray-600 text-sm ${className}`}>
    {children}
  </p>
);

export default Card;

// Usage
<Card variant="elevated">
  <Card.Image src={issue.image} alt={issue.title} />
  <Card.Body>
    <Card.Title>{issue.title}</Card.Title>
    <Card.Description>{issue.description}</Card.Description>
  </Card.Body>
  <Card.Footer>
    <Button>View Details</Button>
  </Card.Footer>
</Card>
```

### 11. Custom Hook Pattern

Extracts reusable stateful logic.

**Implementation:**

```javascript
// hooks/usePagination.js
import { useState, useMemo } from 'react';

export const usePagination = ({ totalItems, itemsPerPage = 10, initialPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(() =>
    Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const startIndex = useMemo(() =>
    (currentPage - 1) * itemsPerPage,
    [currentPage, itemsPerPage]
  );

  const endIndex = useMemo(() =>
    Math.min(startIndex + itemsPerPage, totalItems),
    [startIndex, itemsPerPage, totalItems]
  );

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    canGoNext,
    canGoPrev,
    pageNumbers
  };
};
```

```javascript
// hooks/useDebounce.js
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  // This only runs after user stops typing for 300ms
  fetchIssues({ search: debouncedSearch });
}, [debouncedSearch]);
```

### 12. Render Props Pattern

Shares code between components using a prop whose value is a function.

**Implementation:**

```javascript
// components/DataFetcher.jsx
import { useQuery } from '@tanstack/react-query';

const DataFetcher = ({ queryKey, queryFn, children }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn
  });

  return children({ data, isLoading, error, refetch });
};

// Usage
<DataFetcher
  queryKey={['issues', filters]}
  queryFn={() => issueService.getAll(filters)}
>
  {({ data, isLoading, error }) => {
    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    return <IssueList issues={data.issues} />;
  }}
</DataFetcher>
```

---

## Node.js/Express Patterns

### 13. Repository Pattern

Abstracts data access logic.

**Implementation:**

```javascript
// repositories/BaseRepository.js
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(query = {}, options = {}) {
    return await this.model.find(query)
      .sort(options.sort || { createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 10);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findOne(query) {
    return await this.model.findOne(query);
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await this.model.countDocuments(query);
  }

  async exists(query) {
    return await this.model.exists(query);
  }
}

export default BaseRepository;
```

```javascript
// repositories/IssueRepository.js
import BaseRepository from './BaseRepository.js';
import Issue from '../models/Issue.js';

class IssueRepository extends BaseRepository {
  constructor() {
    super(Issue);
  }

  async findWithPagination(query, options) {
    const [issues, total] = await Promise.all([
      this.findAll(query, options),
      this.count(query)
    ]);

    return {
      issues,
      total,
      page: Math.floor(options.skip / options.limit) + 1,
      totalPages: Math.ceil(total / options.limit)
    };
  }

  async findByReporter(email, query = {}) {
    return await this.findAll({ ...query, reporterEmail: email });
  }

  async findByAssignedStaff(email, query = {}) {
    return await this.findAll({ ...query, assignedStaff: email });
  }

  async findLatestResolved(limit = 6) {
    return await this.model.find({ status: 'Resolved' })
      .sort({ updatedAt: -1 })
      .limit(limit);
  }

  async addTimelineEntry(id, entry) {
    return await this.model.findByIdAndUpdate(
      id,
      { $push: { timeline: entry } },
      { new: true }
    );
  }

  async addUpvote(id, userEmail) {
    return await this.model.findByIdAndUpdate(
      id,
      {
        $addToSet: { upvotes: userEmail },
        $inc: { upvoteCount: 1 }
      },
      { new: true }
    );
  }

  async getStatsByUser(email) {
    return await this.model.aggregate([
      { $match: { reporterEmail: email } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In-Progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } }
        }
      }
    ]);
  }
}

export default new IssueRepository();
```

### 14. Service Layer Pattern

Encapsulates business logic.

**Implementation:**

```javascript
// services/IssueService.js
import IssueRepository from '../repositories/IssueRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import { createTimelineEntry, TimelineAction } from '../utils/factories/timelineFactory.js';
import { IssueQueryBuilder } from '../utils/builders/QueryBuilder.js';

class IssueService {
  constructor(issueRepo, userRepo) {
    this.issueRepo = issueRepo;
    this.userRepo = userRepo;
  }

  async getAllIssues(filters) {
    const { query, options } = new IssueQueryBuilder()
      .withStatus(filters.status)
      .withPriority(filters.priority)
      .withCategory(filters.category)
      .withSearch(filters.search)
      .sortByPriorityFirst()
      .paginate(filters.page || 1, filters.limit || 10)
      .build();

    return await this.issueRepo.findWithPagination(query, options);
  }

  async createIssue(issueData, userEmail) {
    // Check user can create issues
    const user = await this.userRepo.findByEmail(userEmail);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isBlocked) {
      throw new Error('Your account is blocked');
    }

    if (!user.isPremium && user.issueCount >= 3) {
      throw new Error('Free users can only report 3 issues. Please upgrade to premium.');
    }

    // Create timeline entry
    const timelineEntry = createTimelineEntry(TimelineAction.CREATED, {
      updatedBy: userEmail
    });

    // Create issue
    const issue = await this.issueRepo.create({
      ...issueData,
      reporterEmail: userEmail,
      reporterName: user.name,
      timeline: [timelineEntry]
    });

    // Update user's issue count
    await this.userRepo.incrementIssueCount(userEmail);

    return issue;
  }

  async updateIssueStatus(issueId, newStatus, staffEmail) {
    const issue = await this.issueRepo.findById(issueId);

    if (!issue) {
      throw new Error('Issue not found');
    }

    // Validate status transition
    const validTransitions = {
      'Pending': ['In-Progress'],
      'In-Progress': ['Working'],
      'Working': ['Resolved'],
      'Resolved': ['Closed']
    };

    if (!validTransitions[issue.status]?.includes(newStatus)) {
      throw new Error(`Cannot change status from ${issue.status} to ${newStatus}`);
    }

    // Add timeline entry
    const timelineEntry = createTimelineEntry(TimelineAction.STATUS_CHANGED, {
      updatedBy: staffEmail,
      newStatus
    });

    await this.issueRepo.addTimelineEntry(issueId, timelineEntry);

    return await this.issueRepo.update(issueId, {
      status: newStatus,
      updatedAt: new Date()
    });
  }

  async upvoteIssue(issueId, userEmail) {
    const issue = await this.issueRepo.findById(issueId);

    if (!issue) {
      throw new Error('Issue not found');
    }

    if (issue.reporterEmail === userEmail) {
      throw new Error('Cannot upvote your own issue');
    }

    if (issue.upvotes.includes(userEmail)) {
      throw new Error('You have already upvoted this issue');
    }

    return await this.issueRepo.addUpvote(issueId, userEmail);
  }

  async boostIssue(issueId, userEmail) {
    const issue = await this.issueRepo.findById(issueId);

    if (!issue) {
      throw new Error('Issue not found');
    }

    if (issue.priority === 'High') {
      throw new Error('Issue is already boosted');
    }

    const timelineEntry = createTimelineEntry(TimelineAction.BOOSTED, {
      updatedBy: userEmail,
      currentStatus: issue.status
    });

    await this.issueRepo.addTimelineEntry(issueId, timelineEntry);

    return await this.issueRepo.update(issueId, {
      priority: 'High',
      updatedAt: new Date()
    });
  }
}

export default new IssueService(IssueRepository, UserRepository);
```

### 15. Middleware Pattern

Processes requests in a pipeline.

**Implementation:**

```javascript
// middleware/index.js

// Request Logger
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
};

// Error Handler
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Async Handler Wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation Middleware
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

// Rate Limiter
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});
```

---

## Implementation Examples

### Full Feature Implementation Using Patterns

```javascript
// Complete Issue Creation Flow

// 1. Client: Form Component with Validation
const ReportIssueForm = () => {
  const { mutate, isLoading } = useCreateIssueMutation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Issue reported successfully!');
        navigate('/dashboard/my-issues');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};

// 2. Client: Custom Hook for Mutation
const useCreateIssueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => issueService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['issues']);
      queryClient.invalidateQueries(['user-issues']);
    }
  });
};

// 3. Client: Service Layer (Facade)
// Already shown in issueService above

// 4. Server: Controller
const createIssue = asyncHandler(async (req, res) => {
  const issue = await IssueService.createIssue(req.body, req.user.email);

  res.status(201).json({
    success: true,
    message: 'Issue reported successfully',
    data: issue
  });
});

// 5. Server: Service Layer
// Already shown in IssueService above

// 6. Server: Repository Layer
// Already shown in IssueRepository above
```

---

## Pattern Selection Guide

| Scenario | Recommended Pattern |
|----------|---------------------|
| Creating different object types | Factory |
| Single instance needed | Singleton |
| Complex object construction | Builder |
| Converting data formats | Adapter |
| Adding behavior dynamically | Decorator |
| Simplifying complex APIs | Facade |
| State change notifications | Observer |
| Interchangeable algorithms | Strategy |
| Undo/redo functionality | Command |
| Flexible component APIs | Compound Components |
| Reusable stateful logic | Custom Hooks |
| Data access abstraction | Repository |
| Business logic isolation | Service Layer |
| Request processing pipeline | Middleware |

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
