# ADR-004: State Management Strategy

## Status
**Accepted**

## Date
December 12, 2025

## Context

The application needs to manage two types of state:

1. **Server State**: Data fetched from API (issues, users, payments)
2. **Client State**: UI state, authentication status, theme

Requirements:
- Efficient data fetching and caching
- Automatic background refetching
- Loading and error states
- Optimistic updates for better UX
- Minimal boilerplate

## Decision

We chose a hybrid approach:
- **TanStack Query (React Query)** for server state
- **React Context** for client state (auth)

### Implementation Details

**TanStack Query Setup:**
```javascript
// QueryProvider
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

**Usage Pattern:**
```javascript
// Fetching issues
const { data, isLoading, error } = useQuery({
  queryKey: ['issues', filters],
  queryFn: () => fetchIssues(filters),
});

// Mutations
const mutation = useMutation({
  mutationFn: createIssue,
  onSuccess: () => {
    queryClient.invalidateQueries(['issues']);
  },
});
```

**Auth Context:**
```javascript
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firebase auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Consequences

### Positive
- **Automatic Caching**: No manual cache management
- **Background Refetching**: Data stays fresh
- **Optimistic Updates**: Instant UI feedback
- **DevTools**: Excellent debugging tools
- **Minimal Code**: Less boilerplate than Redux
- **Request Deduplication**: Same queries are merged

### Negative
- **Learning Curve**: New concepts (stale time, cache time)
- **Over-fetching Risk**: Must configure properly
- **Bundle Size**: Additional library (~12KB gzipped)

### Neutral
- Different mental model from traditional state management
- Query keys require careful design

## Alternatives Considered

### 1. Redux Toolkit + RTK Query
**Pros:** Industry standard, powerful DevTools, RTK Query for data fetching
**Cons:** More boilerplate, steeper learning curve
**Rejected:** Overkill for project scope, TanStack Query simpler

### 2. Zustand
**Pros:** Simple API, small bundle, no boilerplate
**Cons:** No built-in data fetching, manual caching
**Rejected:** Would need additional fetching solution

### 3. React Context Only
**Pros:** Built-in, no dependencies
**Cons:** No caching, manual refetching, performance issues
**Rejected:** Not suitable for server state

### 4. SWR
**Pros:** Simple, lightweight, Vercel-backed
**Cons:** Less features than TanStack Query
**Rejected:** TanStack Query more feature-rich

## Query Key Structure

```javascript
// Hierarchical query keys for efficient invalidation
['issues']                           // All issues
['issues', 'list', { page, status }] // Filtered list
['issues', 'detail', id]             // Single issue
['issues', 'user', email]            // User's issues
['issues', 'stats', email]           // User statistics

['users']                            // All users
['users', email]                     // Single user
['users', 'role', email]             // User role

['payments']                         // All payments
['payments', 'user', email]          // User payments
```

## Related Decisions
- ADR-003: Frontend Framework
- ADR-005: API Design

---

*Author: Development Team*
*Reviewed: January 2, 2026*
