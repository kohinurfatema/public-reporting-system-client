# Contributing Guidelines

## Public Infrastructure Issue Reporting System

Thank you for your interest in contributing to this project! This document provides guidelines and standards for contributing.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Code Review](#code-review)

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

---

## Getting Started

### Prerequisites

1. Read the [Getting Started Guide](./docs/guides/GETTING_STARTED.md)
2. Set up your development environment
3. Familiarize yourself with the [Architecture](./docs/ARCHITECTURE.md)

### Finding Issues to Work On

1. Check the GitHub Issues tab
2. Look for labels:
   - `good first issue` - Great for newcomers
   - `help wanted` - Looking for contributors
   - `bug` - Bug fixes
   - `enhancement` - New features

---

## Development Workflow

### Branch Strategy

We use Git Flow with the following branches:

```
main        → Production code
develop     → Integration branch
feature/*   → New features
fix/*       → Bug fixes
refactor/*  → Code improvements
docs/*      → Documentation
test/*      → Testing
```

### Workflow Steps

1. **Create a Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following our standards
   - Add tests for new functionality
   - Update documentation if needed

3. **Commit Often**
   ```bash
   git add .
   git commit -m "feat(scope): add feature description"
   ```

4. **Push to Remote**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Create PR from your branch to `develop`
   - Fill out the PR template
   - Request review

6. **Address Feedback**
   - Respond to CodeRabbit suggestions
   - Make requested changes
   - Push updates

7. **Merge**
   - After approval, merge to `develop`
   - Delete feature branch

---

## Coding Standards

### General Principles

- **SOLID Principles**: Single responsibility, Open/closed, etc.
- **DRY**: Don't Repeat Yourself
- **KISS**: Keep It Simple, Stupid
- **Clean Code**: Readable, maintainable code

### JavaScript/React Standards

**File Naming:**
```
components/     → PascalCase.jsx (Button.jsx)
hooks/          → camelCase.jsx (useAuth.jsx)
utils/          → camelCase.js (formatDate.js)
constants/      → UPPER_SNAKE.js (API_ENDPOINTS.js)
```

**Component Structure:**
```jsx
// 1. Imports (grouped: external, internal, styles)
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/Button';
import './styles.css';

// 2. Component definition
const MyComponent = ({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState(null);
  const { data, isLoading } = useQuery({ ... });

  // 4. Effects
  useEffect(() => {
    // ...
  }, []);

  // 5. Handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  if (isLoading) return <Spinner />;

  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. Export
export default MyComponent;
```

**Hooks Rules:**
```jsx
// Good: Descriptive names
const useUserAuthentication = () => { ... };

// Good: Return object for multiple values
const { user, loading, error, login, logout } = useAuth();

// Bad: Generic names
const useData = () => { ... };
```

### Node.js/Express Standards

**Route Handler Structure:**
```javascript
// routes/issueRoutes.js

// GET /issues
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const issues = await Issue.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: issues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issues',
      error: error.message
    });
  }
});
```

**Middleware Pattern:**
```javascript
// middleware/auth.js
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
```

### CSS/Tailwind Standards

**Class Order:**
```html
<!-- Layout → Box Model → Typography → Visual → Interactive -->
<div class="flex items-center p-4 text-lg text-gray-700 bg-white rounded-lg hover:bg-gray-50">
```

**Component Classes:**
```jsx
// Use consistent patterns
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-outline">Outline</button>
```

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting (no code change) |
| `refactor` | Code restructuring |
| `test` | Adding tests |
| `chore` | Maintenance |

### Scopes

| Scope | Description |
|-------|-------------|
| `auth` | Authentication |
| `issues` | Issue management |
| `dashboard` | Dashboard features |
| `admin` | Admin features |
| `staff` | Staff features |
| `api` | API endpoints |
| `ui` | UI components |
| `db` | Database |

### Examples

```bash
# Feature
feat(auth): add Google sign-in button

# Bug fix
fix(issues): resolve pagination offset error

# Refactoring
refactor(api): extract issue service layer

# Documentation
docs(readme): update installation instructions

# Testing
test(hooks): add useAuth unit tests
```

### Commit Message Rules

1. Use imperative mood ("add" not "added")
2. Don't capitalize first letter
3. No period at the end
4. Keep under 72 characters
5. Reference issues when applicable: `fix(auth): resolve login bug (#123)`

---

## Pull Request Process

### PR Title Format

Same as commit format:
```
feat(scope): description of changes
```

### PR Template

```markdown
## Summary
Brief description of changes (2-3 sentences)

## Changes
- [ ] Change 1
- [ ] Change 2
- [ ] Change 3

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All existing tests pass

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### PR Size Guidelines

| Size | Files | Lines | Review Time |
|------|-------|-------|-------------|
| Small | 1-5 | <100 | <30 min |
| Medium | 5-10 | 100-300 | 30-60 min |
| Large | 10+ | 300+ | 1+ hour |

**Best Practice:** Keep PRs small and focused!

---

## Code Review

### CodeRabbit Integration

We use CodeRabbit for automated code review:

1. Create PR → CodeRabbit automatically reviews
2. Address suggestions and feedback
3. Mark conversations as resolved
4. Request re-review if needed

### Review Checklist

**Reviewer should check:**

- [ ] Code follows project standards
- [ ] Logic is correct and efficient
- [ ] Error handling is appropriate
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] No hardcoded values
- [ ] No console.logs left behind

### Feedback Guidelines

**Giving Feedback:**
- Be specific and constructive
- Explain the "why" behind suggestions
- Use questions when uncertain
- Acknowledge good solutions

**Receiving Feedback:**
- Be open to suggestions
- Ask for clarification if needed
- Don't take it personally
- Learn from the feedback

---

## Testing Guidelines

### Client Testing

```javascript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Server Testing

```javascript
// API test example
import request from 'supertest';
import app from '../src/index';

describe('GET /issues', () => {
  it('returns paginated issues', async () => {
    const res = await request(app)
      .get('/issues?page=1&limit=10')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination).toBeDefined();
  });
});
```

---

## Questions?

- Check existing documentation
- Search GitHub Issues
- Create a new issue with the `question` label

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
