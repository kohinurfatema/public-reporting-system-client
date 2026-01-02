# ADR-003: Frontend Framework Selection

## Status
**Accepted**

## Date
December 10, 2025

## Context

The application requires a modern frontend framework for building:
- Responsive single-page application
- Role-based dashboards with charts
- Complex forms with validation
- PDF generation capabilities
- Real-time UI updates

Selection criteria:
- Developer productivity
- Ecosystem and community
- Performance
- Learning resources

## Decision

We chose **React 19** with **Vite** as the build tool.

### Technology Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| Vite 7 | Build tool |
| React Router 7 | Client-side routing |
| Tailwind CSS 4 | Styling |
| DaisyUI 4 | Component library |

### Implementation Details

**Project Setup:**
```bash
npm create vite@latest client -- --template react
```

**Key Features Used:**
- Functional components with hooks
- Context API for global state
- React Router for navigation
- Lazy loading for code splitting

## Consequences

### Positive
- **Vite Performance**: Fast HMR, quick builds
- **React Ecosystem**: Large library selection
- **Component Model**: Reusable UI components
- **Job Market**: React skills are in demand
- **Community**: Extensive documentation and tutorials

### Negative
- **React 19 New Features**: Some features still experimental
- **No Built-in Solutions**: Need to choose state management, routing separately
- **JSX Learning Curve**: Different from HTML

### Neutral
- Frequent React updates require maintenance
- Multiple ways to solve problems (flexibility vs. decision fatigue)

## Alternatives Considered

### 1. Vue.js 3
**Pros:** Easier learning curve, built-in state management
**Cons:** Smaller ecosystem, fewer job opportunities
**Rejected:** React has broader industry adoption

### 2. Angular
**Pros:** Full framework, TypeScript by default
**Cons:** Steeper learning curve, more opinionated
**Rejected:** Overkill for project scope

### 3. Next.js
**Pros:** SSR, file-based routing, API routes
**Cons:** More complex, server requirement
**Rejected:** SPA sufficient, separate API server preferred

### 4. Create React App
**Pros:** Official React tool, zero config
**Cons:** Slow, unmaintained, deprecated
**Rejected:** Vite is faster and actively maintained

## Build Tool Decision (Vite vs CRA)

| Feature | Vite | Create React App |
|---------|------|-----------------|
| Cold Start | ~300ms | ~10s |
| HMR | Instant | 1-3s |
| Build Time | ~15s | ~60s |
| Bundle Size | Smaller | Larger |
| Maintenance | Active | Deprecated |

**Decision:** Vite for superior developer experience

## Related Decisions
- ADR-004: State Management
- ADR-006: Deployment Strategy

---

*Author: Development Team*
*Reviewed: January 2, 2026*
