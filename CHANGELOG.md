# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned (Phase 2)
- Dark/Light mode toggle
- Demo credential auto-fill button
- Additional home page sections (10+ total)
- About page
- Contact page
- Help/Support page
- Sorting on All Issues page
- Multiple images on issue details
- Skeleton loaders
- Unit tests
- E2E tests

---

## [1.0.0] - 2025-12-24

### Added

#### Authentication & User Management
- Firebase Email/Password authentication
- Firebase Google Sign-in integration
- User registration with photo upload (ImgBB)
- User creation in MongoDB on registration
- PrivateRoute for auth-protected pages
- RoleRoute for role-based access control (admin/citizen/staff)
- User model with roles, premium status, blocked status
- Firebase Admin SDK for server-side token verification
- Role-based middleware (verifyToken, verifyAdmin, verifyStaff)
- Axios interceptors for automatic token attachment

#### Home Page
- Navbar with logo, menu, profile dropdown
- Dynamic role-based dashboard redirect
- Banner section with Swiper slider
- Latest Resolved Issues section (6 cards)
- Features Section (6 feature cards)
- How It Works section (4-step timeline)
- Stats Section with animated counters
- CTA Section (Report Issue & Go Premium)
- Footer component with links and social media
- 404 Not Found page with navigation buttons

#### All Issues Page (/all-issues)
- Issue cards with image, title, category, status badge
- Priority badge (High/Normal)
- Location display with map pin icon
- Upvote button with total count
- View Details navigation
- Server-side search by title, category, location
- Filter by status, priority, category
- Server-side pagination (10 per page)
- Loading states

#### Issue Details Page
- Full issue information display
- Edit button (owner only, pending status)
- Delete button with confirmation
- Boost priority button with payment flow
- Assigned staff information display
- Timeline/Tracking section (vertical timeline)
- Status badges with colors

#### Citizen Dashboard
- Dashboard Home with stats cards
- Pie chart for issue distribution
- Report Issue form with category dropdown
- Image upload to ImgBB
- Free user limit check (max 3 issues)
- Premium user unlimited reporting
- My Issues page with table view
- Filter by status and category
- Edit issue modal (pending only)
- Delete issue with confirmation
- Profile page with edit functionality
- Premium subscription button (1000tk)
- Payment history table
- Invoice download (PDF)
- Blocked user warning display

#### Staff Dashboard
- Dashboard Home with stats cards
- Assigned issues count, resolved count
- Active tasks display
- Status distribution pie chart
- Category distribution bar chart
- Assigned Issues table (boosted first)
- Change Status dropdown with workflow
- Status: Pending → In-Progress → Working → Resolved → Closed
- Timeline entry on status change
- Filter by status, priority, category
- Staff Profile page (view/update)

#### Admin Dashboard
- Dashboard Home with comprehensive stats
- Total issues, resolved, pending, rejected counts
- Total payment received
- Latest issues, users display
- Pie chart (status distribution)
- Bar chart (category distribution)
- All Issues table (boosted first)
- Assign Staff modal with dropdown
- Reject Issue button with confirmation
- Manage Users page (citizens table)
- View subscription info
- Block/Unblock buttons with confirmation
- Manage Staff page with CRUD operations
- Add Staff (Firebase Auth + MongoDB)
- Update staff modal
- Delete staff with confirmation
- Payments page with table view
- Filter by payment type
- PDF Invoice download
- Admin Profile page

#### Server API
- RESTful API design
- User routes (/users)
- Issue routes (/issues)
- Admin routes (/admin) - protected
- Staff routes (/staff) - protected
- Payment routes (/payments) - protected
- Pagination support
- Search and filter support
- Timeline entry generation

#### Database
- User schema (roles, premium, blocked, issueCount)
- Issue schema with embedded Timeline
- Payment schema for transactions

### Technical
- React 19 with Vite 7
- React Router v7
- TanStack Query for data fetching
- Tailwind CSS v4 + DaisyUI
- Recharts for charts
- @react-pdf/renderer for invoices
- Express 5 with Mongoose
- Firebase Admin SDK
- MongoDB Atlas hosting
- Firebase Hosting (client)
- Vercel (server)

---

## [0.2.0] - 2025-12-18

### Added
- Staff dashboard implementation
- Admin dashboard implementation
- Role-based routing
- Payment integration

### Changed
- Improved issue workflow
- Enhanced dashboard layouts

---

## [0.1.0] - 2025-12-12

### Added
- Initial project setup
- Firebase authentication
- Basic routing structure
- Home page layout
- Issue reporting form
- MongoDB connection

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 1.0.0 | Dec 24, 2025 | Production release, all Phase 1 features |
| 0.2.0 | Dec 18, 2025 | Dashboards, payments |
| 0.1.0 | Dec 12, 2025 | Initial setup |

---

## Migration Notes

### Upgrading to 1.0.0
No migration required - initial production release.

### Future Migrations
Will be documented as needed for Phase 2 releases.

---

## Contributors

- **Kohinur Fatema** - Lead Developer

---

## Links

- [Project Documentation](./docs/README.md)
- [API Documentation](./docs/api/README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Live Site](https://public-reporting-system-351f1.web.app)

---

*This changelog is automatically updated with each release.*
