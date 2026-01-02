# Clean Code Principles & Best Practices

## Public Infrastructure Issue Reporting System

**Version:** 1.0.0
**Last Updated:** January 2, 2026

---

## Table of Contents

1. [SOLID Principles](#solid-principles)
2. [Clean Code Rules](#clean-code-rules)
3. [Naming Conventions](#naming-conventions)
4. [Function Guidelines](#function-guidelines)
5. [Error Handling](#error-handling)
6. [Code Organization](#code-organization)
7. [React Best Practices](#react-best-practices)
8. [Node.js Best Practices](#nodejs-best-practices)
9. [Performance Optimization](#performance-optimization)
10. [Security Best Practices](#security-best-practices)

---

## SOLID Principles

### S - Single Responsibility Principle (SRP)

> A class/module should have only one reason to change.

**Bad Example:**
```javascript
// Does too many things: data fetching, validation, formatting, rendering
const IssueCard = ({ issueId }) => {
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    fetch(`/api/issues/${issueId}`)
      .then(res => res.json())
      .then(data => {
        // Validation
        if (!data.title || data.title.length < 3) {
          throw new Error('Invalid title');
        }
        // Formatting
        data.createdAt = new Date(data.createdAt).toLocaleDateString();
        data.title = data.title.toUpperCase();
        setIssue(data);
      });
  }, [issueId]);

  return <div>{/* render logic */}</div>;
};
```

**Good Example:**
```javascript
// Separate concerns into different modules

// 1. Data fetching (hook)
const useIssue = (issueId) => {
  return useQuery({
    queryKey: ['issue', issueId],
    queryFn: () => issueService.getById(issueId)
  });
};

// 2. Validation (utility)
const validateIssue = (issue) => {
  if (!issue.title || issue.title.length < 3) {
    throw new ValidationError('Invalid title');
  }
  return issue;
};

// 3. Formatting (utility)
const formatIssueDate = (date) => new Date(date).toLocaleDateString();

// 4. Presentation (component)
const IssueCard = ({ issue }) => (
  <Card>
    <Card.Title>{issue.title}</Card.Title>
    <Card.Description>
      Created: {formatIssueDate(issue.createdAt)}
    </Card.Description>
  </Card>
);

// 5. Container (component)
const IssueCardContainer = ({ issueId }) => {
  const { data: issue, isLoading } = useIssue(issueId);

  if (isLoading) return <Skeleton />;
  return <IssueCard issue={issue} />;
};
```

### O - Open/Closed Principle (OCP)

> Software entities should be open for extension but closed for modification.

**Bad Example:**
```javascript
// Must modify function to add new status
const getStatusColor = (status) => {
  if (status === 'Pending') return 'yellow';
  if (status === 'In-Progress') return 'blue';
  if (status === 'Resolved') return 'green';
  // Need to add new if for each status
};
```

**Good Example:**
```javascript
// Extend through configuration, not modification
const STATUS_CONFIG = {
  Pending: { color: 'yellow', icon: 'clock', label: 'Pending' },
  'In-Progress': { color: 'blue', icon: 'loader', label: 'In Progress' },
  Working: { color: 'purple', icon: 'tool', label: 'Working' },
  Resolved: { color: 'green', icon: 'check', label: 'Resolved' },
  Closed: { color: 'gray', icon: 'archive', label: 'Closed' },
  Rejected: { color: 'red', icon: 'x', label: 'Rejected' }
};

// Add new status? Just add to config, don't modify function
const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.Pending;

// Usage
const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  return (
    <Badge color={config.color}>
      <Icon name={config.icon} />
      {config.label}
    </Badge>
  );
};
```

### L - Liskov Substitution Principle (LSP)

> Derived classes should be substitutable for their base classes.

**Bad Example:**
```javascript
// Breaking LSP - Bird has fly(), but Penguin can't fly
class Bird {
  fly() {
    console.log('Flying...');
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguins can't fly!"); // Breaks LSP
  }
}
```

**Good Example:**
```javascript
// Proper abstraction
class Bird {
  move() {
    throw new Error('move() must be implemented');
  }
}

class FlyingBird extends Bird {
  move() {
    return this.fly();
  }

  fly() {
    console.log('Flying...');
  }
}

class SwimmingBird extends Bird {
  move() {
    return this.swim();
  }

  swim() {
    console.log('Swimming...');
  }
}

// In React context - consistent props interface
const BaseButton = ({ children, onClick, disabled, className }) => (
  <button onClick={onClick} disabled={disabled} className={className}>
    {children}
  </button>
);

const PrimaryButton = (props) => (
  <BaseButton {...props} className={`btn-primary ${props.className}`} />
);

const SecondaryButton = (props) => (
  <BaseButton {...props} className={`btn-secondary ${props.className}`} />
);

// Both can be used interchangeably
const buttons = [PrimaryButton, SecondaryButton];
buttons.forEach(Button => <Button onClick={handleClick}>Click</Button>);
```

### I - Interface Segregation Principle (ISP)

> Clients should not be forced to depend on interfaces they don't use.

**Bad Example:**
```javascript
// Component receives props it doesn't need
const IssueCard = ({
  issue,
  onEdit,
  onDelete,
  onAssign,
  onReject,
  onChangeStatus,
  currentUser,
  staffList,
  isAdmin,
  isStaff,
  showActions,
  showTimeline,
  // ... many more props
}) => {
  // Component only uses issue, onEdit, showActions
};
```

**Good Example:**
```javascript
// Split into focused interfaces
const IssueCard = ({ issue, showActions, actions }) => (
  <Card>
    <IssueContent issue={issue} />
    {showActions && <IssueActions actions={actions} />}
  </Card>
);

// Citizen view - only needs edit/delete
const CitizenIssueCard = ({ issue }) => (
  <IssueCard
    issue={issue}
    showActions={issue.status === 'Pending'}
    actions={[
      { label: 'Edit', onClick: () => handleEdit(issue) },
      { label: 'Delete', onClick: () => handleDelete(issue) }
    ]}
  />
);

// Admin view - needs assign/reject
const AdminIssueCard = ({ issue, staffList }) => (
  <IssueCard
    issue={issue}
    showActions={true}
    actions={[
      { label: 'Assign', onClick: () => handleAssign(issue, staffList) },
      { label: 'Reject', onClick: () => handleReject(issue) }
    ]}
  />
);
```

### D - Dependency Inversion Principle (DIP)

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Bad Example:**
```javascript
// Component directly depends on implementation
const IssueList = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    // Direct dependency on fetch API
    fetch('/api/issues')
      .then(res => res.json())
      .then(setIssues);
  }, []);

  return <div>{/* render */}</div>;
};
```

**Good Example:**
```javascript
// 1. Define abstraction (interface/service)
// services/issueService.js
const issueService = {
  getAll: (filters) => axiosSecure.get('/issues', { params: filters }),
  getById: (id) => axiosSecure.get(`/issues/${id}`),
  create: (data) => axiosSecure.post('/issues', data),
  // ...
};

// 2. Create hook that depends on abstraction
// hooks/useIssues.js
const useIssues = (filters, service = issueService) => {
  return useQuery({
    queryKey: ['issues', filters],
    queryFn: () => service.getAll(filters)
  });
};

// 3. Component depends on abstraction (hook)
const IssueList = ({ filters }) => {
  const { data, isLoading } = useIssues(filters);

  if (isLoading) return <Spinner />;
  return <div>{/* render */}</div>;
};

// 4. Easy to test with mock service
const mockService = {
  getAll: () => Promise.resolve({ data: mockIssues })
};

// In tests
const { result } = renderHook(() => useIssues({}, mockService));
```

---

## Clean Code Rules

### 1. Meaningful Names

```javascript
// Bad - unclear what these do
const d = new Date();
const a = issues.filter(i => i.s === 'P');
const fn = (x) => x * 2;

// Good - descriptive names
const currentDate = new Date();
const pendingIssues = issues.filter(issue => issue.status === 'Pending');
const doubleValue = (value) => value * 2;
```

### 2. Functions Should Do One Thing

```javascript
// Bad - does multiple things
const processIssue = async (issueData, userEmail) => {
  // Validate
  if (!issueData.title) throw new Error('Title required');
  if (!issueData.category) throw new Error('Category required');

  // Check user
  const user = await User.findOne({ email: userEmail });
  if (!user) throw new Error('User not found');
  if (user.isBlocked) throw new Error('User blocked');
  if (!user.isPremium && user.issueCount >= 3) throw new Error('Limit reached');

  // Create timeline
  const timeline = [{
    status: 'Pending',
    message: 'Issue created',
    timestamp: new Date()
  }];

  // Save issue
  const issue = await Issue.create({ ...issueData, timeline });

  // Update user
  await User.updateOne({ email: userEmail }, { $inc: { issueCount: 1 } });

  // Send notification
  await sendEmail(userEmail, 'Issue Created', `Your issue "${issue.title}" was created`);

  return issue;
};

// Good - each function does one thing
const validateIssueData = (issueData) => {
  const errors = [];
  if (!issueData.title) errors.push('Title is required');
  if (!issueData.category) errors.push('Category is required');
  if (errors.length) throw new ValidationError(errors);
};

const checkUserCanCreateIssue = async (userEmail) => {
  const user = await userRepository.findByEmail(userEmail);

  if (!user) throw new NotFoundError('User not found');
  if (user.isBlocked) throw new ForbiddenError('Your account is blocked');
  if (!user.isPremium && user.issueCount >= 3) {
    throw new ForbiddenError('Free user limit reached');
  }

  return user;
};

const createTimelineEntry = (action, data) => ({
  status: data.status || 'Pending',
  message: action,
  updatedBy: data.updatedBy,
  timestamp: new Date()
});

const createIssue = async (issueData, userEmail) => {
  validateIssueData(issueData);
  const user = await checkUserCanCreateIssue(userEmail);

  const timeline = [createTimelineEntry('Issue reported by citizen', {
    updatedBy: userEmail
  })];

  const issue = await issueRepository.create({
    ...issueData,
    reporterEmail: userEmail,
    reporterName: user.name,
    timeline
  });

  await userRepository.incrementIssueCount(userEmail);
  await notificationService.sendIssueCreated(user, issue);

  return issue;
};
```

### 3. Avoid Magic Numbers and Strings

```javascript
// Bad
if (user.issueCount >= 3) { /* ... */ }
if (status === 'P') { /* ... */ }
setTimeout(fn, 300000);

// Good
const FREE_USER_ISSUE_LIMIT = 3;
const IssueStatus = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In-Progress',
  WORKING: 'Working',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected'
};
const FIVE_MINUTES_MS = 5 * 60 * 1000;

if (user.issueCount >= FREE_USER_ISSUE_LIMIT) { /* ... */ }
if (status === IssueStatus.PENDING) { /* ... */ }
setTimeout(fn, FIVE_MINUTES_MS);
```

### 4. DRY - Don't Repeat Yourself

```javascript
// Bad - repeated logic
const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/issues')
      .then(res => res.json())
      .then(data => setIssues(data))
      .finally(() => setLoading(false));
  }, []);

  // ...
};

const StaffDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/staff/issues')
      .then(res => res.json())
      .then(data => setIssues(data))
      .finally(() => setLoading(false));
  }, []);

  // ...
};

// Good - extract reusable hook
const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};

// Or better, use TanStack Query
const useIssues = (endpoint) => {
  return useQuery({
    queryKey: ['issues', endpoint],
    queryFn: () => axiosSecure.get(endpoint).then(res => res.data)
  });
};

const AdminDashboard = () => {
  const { data: issues, isLoading } = useIssues('/admin/issues');
  // ...
};

const StaffDashboard = () => {
  const { data: issues, isLoading } = useIssues('/staff/issues');
  // ...
};
```

### 5. Keep Functions Small

```javascript
// Bad - too long, hard to understand
const renderDashboard = () => {
  // 200 lines of JSX and logic
};

// Good - break into smaller components
const Dashboard = () => (
  <DashboardLayout>
    <DashboardHeader />
    <DashboardStats />
    <DashboardCharts />
    <DashboardRecentActivity />
  </DashboardLayout>
);

const DashboardStats = () => (
  <div className="grid grid-cols-4 gap-4">
    <StatCard title="Total Issues" value={stats.total} icon="file" />
    <StatCard title="Pending" value={stats.pending} icon="clock" />
    <StatCard title="Resolved" value={stats.resolved} icon="check" />
    <StatCard title="Revenue" value={stats.revenue} icon="dollar" />
  </div>
);
```

---

## Naming Conventions

### Files and Folders

```
# Components - PascalCase
components/
├── Button.jsx
├── IssueCard.jsx
├── DashboardLayout.jsx

# Hooks - camelCase with "use" prefix
hooks/
├── useAuth.jsx
├── useIssues.jsx
├── usePagination.jsx

# Services - camelCase
services/
├── issueService.js
├── authService.js
├── paymentService.js

# Utils - camelCase
utils/
├── formatDate.js
├── validateEmail.js
├── constants.js

# Constants - UPPER_SNAKE_CASE
export const API_BASE_URL = '...';
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
```

### Variables and Functions

```javascript
// Boolean - use is/has/can/should prefix
const isLoading = true;
const hasPermission = user.role === 'admin';
const canEdit = issue.status === 'Pending';
const shouldShowButton = isLoggedIn && !isBlocked;

// Arrays - use plural nouns
const issues = [];
const users = [];
const selectedIds = [];

// Functions - use verbs
const fetchIssues = () => {};
const validateForm = () => {};
const handleSubmit = () => {};
const calculateTotal = () => {};

// Event handlers - use handle prefix
const handleClick = () => {};
const handleSubmit = () => {};
const handleChange = () => {};

// Callbacks - use on prefix (in props)
<Button onClick={handleClick} onHover={handleHover} />
```

---

## Error Handling

### Custom Error Classes

```javascript
// errors/AppError.js
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}
```

### Error Handling Pattern

```javascript
// Server - centralized error handler
const errorHandler = (err, req, res, next) => {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Operational errors (expected)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      errors: err.errors
    });
  }

  // Programming errors (unexpected) - don't leak details
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    code: 'INTERNAL_ERROR'
  });
};

// Client - error boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error tracking service
    errorService.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// API error handling
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { message, code } = error.response.data;

    switch (code) {
      case 'UNAUTHORIZED':
        // Redirect to login
        authService.logout();
        navigate('/login');
        break;
      case 'FORBIDDEN':
        toast.error('You do not have permission to perform this action');
        break;
      case 'VALIDATION_ERROR':
        // Show validation errors
        error.response.data.errors?.forEach(err => toast.error(err));
        break;
      default:
        toast.error(message || 'Something went wrong');
    }
  } else if (error.request) {
    // No response received
    toast.error('Network error. Please check your connection.');
  } else {
    // Request setup error
    toast.error('An unexpected error occurred');
  }
};
```

---

## Code Organization

### Feature-Based Structure

```
src/
├── app/                      # Application setup
│   ├── App.jsx
│   ├── providers/
│   │   ├── AuthProvider.jsx
│   │   ├── ThemeProvider.jsx
│   │   └── QueryProvider.jsx
│   └── router/
│       └── router.jsx
│
├── features/                 # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── SocialLogin.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.jsx
│   │   │   └── useLogin.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   └── index.js          # Public exports
│   │
│   ├── issues/
│   │   ├── components/
│   │   │   ├── IssueCard.jsx
│   │   │   ├── IssueList.jsx
│   │   │   ├── IssueForm.jsx
│   │   │   └── IssueTimeline.jsx
│   │   ├── hooks/
│   │   │   ├── useIssues.jsx
│   │   │   └── useIssueDetails.jsx
│   │   ├── services/
│   │   │   └── issueService.js
│   │   └── index.js
│   │
│   └── dashboard/
│       ├── admin/
│       ├── staff/
│       └── citizen/
│
├── shared/                   # Shared across features
│   ├── components/
│   │   ├── ui/               # Base UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Input.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       └── Footer.jsx
│   ├── hooks/
│   │   ├── useDebounce.jsx
│   │   └── usePagination.jsx
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   └── constants/
│       └── index.js
│
└── pages/                    # Route entry points
    ├── Home.jsx
    ├── AllIssues.jsx
    └── Dashboard/
```

---

## React Best Practices

### 1. Component Composition

```jsx
// Use composition over configuration
// Bad - prop drilling
<Layout
  headerTitle="Dashboard"
  headerShowSearch={true}
  headerSearchPlaceholder="Search..."
  sidebarItems={menuItems}
  sidebarCollapsed={false}
  footerLinks={links}
>
  {children}
</Layout>

// Good - composition
<Layout>
  <Layout.Header>
    <Logo />
    <SearchBar placeholder="Search..." />
    <UserMenu />
  </Layout.Header>

  <Layout.Sidebar>
    <SidebarMenu items={menuItems} />
  </Layout.Sidebar>

  <Layout.Content>
    {children}
  </Layout.Content>

  <Layout.Footer>
    <FooterLinks links={links} />
  </Layout.Footer>
</Layout>
```

### 2. State Management

```jsx
// Lift state up when needed, colocate when possible
// Bad - state too high
const App = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Used only in IssueList

  return (
    <div>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <IssueList searchQuery={searchQuery} />
    </div>
  );
};

// Good - colocated state
const IssueList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <Issues query={searchQuery} />
    </div>
  );
};
```

### 3. Performance Optimization

```jsx
// Use React.memo for expensive components
const IssueCard = React.memo(({ issue, onUpvote }) => (
  <Card>
    {/* ... */}
  </Card>
));

// Use useMemo for expensive calculations
const sortedIssues = useMemo(() =>
  [...issues].sort((a, b) => b.upvoteCount - a.upvoteCount),
  [issues]
);

// Use useCallback for stable function references
const handleUpvote = useCallback((issueId) => {
  upvoteMutation.mutate(issueId);
}, [upvoteMutation]);
```

---

## Node.js Best Practices

### 1. Async/Await Error Handling

```javascript
// Use async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
router.get('/issues', asyncHandler(async (req, res) => {
  const issues = await issueService.getAll(req.query);
  res.json({ success: true, data: issues });
}));
```

### 2. Input Validation

```javascript
// Use Joi or Zod for validation
import Joi from 'joi';

const issueSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(2000).required(),
  category: Joi.string().valid(...CATEGORIES).required(),
  location: Joi.string().required(),
  image: Joi.string().uri().required()
});

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map(d => d.message)
    });
  }

  req.validatedBody = value;
  next();
};

// Usage
router.post('/issues', validate(issueSchema), asyncHandler(createIssue));
```

---

## Security Best Practices

### 1. Input Sanitization

```javascript
// Sanitize user input
import sanitizeHtml from 'sanitize-html';

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {}
    });
  }
  return input;
};

// Use in middleware
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitizeInput(req.body[key]);
    });
  }
  next();
};
```

### 2. Environment Variables

```javascript
// Never hardcode secrets
// Bad
const dbUri = 'mongodb+srv://user:password@cluster.mongodb.net';

// Good
const dbUri = process.env.MONGODB_URI;

// Validate required env vars at startup
const requiredEnvVars = ['MONGODB_URI', 'FIREBASE_PROJECT_ID'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

### 3. Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests' }
});

// Stricter limit for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many login attempts' }
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
```

---

## Code Review Checklist

- [ ] Does the code follow SOLID principles?
- [ ] Are functions small and focused?
- [ ] Are names descriptive and consistent?
- [ ] Is there any code duplication?
- [ ] Are errors handled properly?
- [ ] Is input validated and sanitized?
- [ ] Are there any security vulnerabilities?
- [ ] Is the code testable?
- [ ] Is the performance acceptable?
- [ ] Is the code readable without comments?

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
