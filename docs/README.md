# Documentation Index

## Public Infrastructure Issue Reporting System

**Version:** 1.0.0
**Last Updated:** January 2, 2026
**Status:** Production Ready (Phase 1 Complete)

---

## Quick Links

| Document | Description |
|----------|-------------|
| [Project Status](./PROJECT_STATUS.md) | Current progress, milestones, and roadmap |
| [Architecture](./ARCHITECTURE.md) | System architecture and design decisions |
| [Tech Stack](./TECH_STACK.md) | Technology choices and rationale |
| [Database Schema](./DATABASE_SCHEMA.md) | MongoDB collections and relationships |
| [API Reference](./api/README.md) | Complete API documentation |
| [ADR Index](./adr/README.md) | Architecture Decision Records |
| [Design Patterns](./DESIGN_PATTERNS.md) | Design patterns used in the project |
| [Clean Code](./CLEAN_CODE.md) | Clean code principles & SOLID |
| [Recommendations](./RECOMMENDATIONS.md) | Best practices & improvements |
| [Agile Methodology](./AGILE_METHODOLOGY.md) | Scrum framework & sprint planning |
| [Sprint Tracking](./SPRINT_TRACKING.md) | Current sprint progress & history |

---

## Guides

| Guide | Description |
|-------|-------------|
| [Getting Started](./guides/GETTING_STARTED.md) | Local development setup |
| [Deployment](./guides/DEPLOYMENT.md) | Production deployment guide |
| [Contributing](../CONTRIBUTING.md) | Contribution guidelines |

---

## Project Overview

The **Public Infrastructure Issue Reporting System** is a full-stack web application that enables citizens to report public infrastructure issues (potholes, broken streetlights, water leakage, etc.) and allows government staff and administrators to manage, verify, assign, and resolve these issues efficiently.

### Key Features

- **Multi-role System**: Admin, Staff, and Citizen roles with role-based access control
- **Issue Lifecycle Management**: Complete workflow from reporting to resolution
- **Real-time Tracking**: Timeline-based issue tracking with audit history
- **Premium Subscription**: Tiered access with payment integration
- **Priority Boosting**: Citizens can boost issue priority through payments

### Live URLs

| Environment | URL |
|-------------|-----|
| Production (Client) | https://public-reporting-system-351f1.web.app |
| Production (Server) | https://public-reporting-system-server-kappa.vercel.app |

---

## Repository Structure

```
assignment-11/
├── public-reporting-system-client/    # React frontend (Vite)
├── public-reporting-system-server/    # Node.js/Express backend
├── docs/                              # Documentation
│   ├── adr/                           # Architecture Decision Records
│   ├── api/                           # API documentation
│   └── guides/                        # Setup and deployment guides
├── CLAUDE.md                          # AI assistant instructions
├── CONTRIBUTING.md                    # Contribution guidelines
├── CHANGELOG.md                       # Version history
└── DEVELOPMENT_PLAN.md                # Future development roadmap
```

---

## Team & Contacts

| Role | Name | Contact |
|------|------|---------|
| Developer | Kohinur Fatema | @kohinurfatema |

---

## License

This project is developed as part of an academic assignment. All rights reserved.
