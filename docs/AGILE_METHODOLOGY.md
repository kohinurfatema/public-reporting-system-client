# Agile Methodology Guide

## Public Infrastructure Issue Reporting System

**Version:** 1.0.0
**Last Updated:** January 2, 2026
**Methodology:** Scrum with Kanban elements

---

## Table of Contents

1. [Agile Overview](#agile-overview)
2. [Scrum Framework](#scrum-framework)
3. [Sprint Planning](#sprint-planning)
4. [Product Backlog](#product-backlog)
5. [User Stories](#user-stories)
6. [Sprint Ceremonies](#sprint-ceremonies)
7. [Definition of Done](#definition-of-done)
8. [Project Board](#project-board)
9. [Estimation](#estimation)
10. [Metrics & Reporting](#metrics--reporting)

---

## Agile Overview

### Why Agile?

- **Iterative Development**: Deliver working software in short cycles
- **Flexibility**: Adapt to changing requirements
- **Continuous Improvement**: Learn and improve each sprint
- **Transparency**: Clear visibility of progress
- **Quality Focus**: Built-in testing and review

### Agile Principles We Follow

1. Working software over comprehensive documentation
2. Responding to change over following a plan
3. Customer collaboration over contract negotiation
4. Individuals and interactions over processes and tools

### Our Agile Workflow

```
Product Backlog → Sprint Planning → Sprint (1-2 weeks) → Review → Retrospective
       ↑                                                              │
       └──────────────────────────────────────────────────────────────┘
```

---

## Scrum Framework

### Roles

| Role | Responsibility | Person |
|------|----------------|--------|
| **Product Owner** | Prioritizes backlog, defines requirements | You (Developer) |
| **Scrum Master** | Facilitates process, removes blockers | You (Developer) |
| **Development Team** | Builds the product | You + Claude Code |

### Artifacts

| Artifact | Description |
|----------|-------------|
| **Product Backlog** | Prioritized list of all features/tasks |
| **Sprint Backlog** | Tasks committed for current sprint |
| **Increment** | Working software delivered each sprint |

### Events

| Event | Duration | Purpose |
|-------|----------|---------|
| Sprint | 1-2 weeks | Development cycle |
| Sprint Planning | 1-2 hours | Plan sprint work |
| Daily Standup | 15 mins | Sync & blockers |
| Sprint Review | 1 hour | Demo & feedback |
| Retrospective | 30 mins | Process improvement |

---

## Sprint Planning

### Sprint Duration

- **Sprint Length**: 1 week (for rapid iteration)
- **Sprint Goal**: One major feature or theme per sprint

### Sprint Planning Process

```
1. Review Product Backlog
       ↓
2. Select User Stories for Sprint
       ↓
3. Break into Tasks
       ↓
4. Estimate Tasks (Story Points)
       ↓
5. Commit to Sprint Backlog
       ↓
6. Define Sprint Goal
```

### Current Sprint Plan

#### Sprint 1: Foundation & Architecture (Week 1)
**Sprint Goal**: Establish professional development workflow

| ID | Task | Story Points | Priority |
|----|------|--------------|----------|
| S1-1 | Set up Git branching (develop branch) | 1 | High |
| S1-2 | Configure CodeRabbit for PR review | 1 | High |
| S1-3 | Create constants file | 2 | High |
| S1-4 | Implement service layer pattern | 3 | High |
| S1-5 | Add input validation (Joi) | 3 | High |
| S1-6 | Set up error handling | 2 | Medium |
| S1-7 | Add skeleton loader components | 2 | Medium |

**Total Points**: 14

---

#### Sprint 2: UI/UX Improvements (Week 2)
**Sprint Goal**: Implement dark mode and improve UI consistency

| ID | Task | Story Points | Priority |
|----|------|--------------|----------|
| S2-1 | Implement ThemeContext (Dark/Light) | 3 | High |
| S2-2 | Create theme toggle component | 2 | High |
| S2-3 | Update all components for theme | 5 | High |
| S2-4 | Define color palette (3 colors) | 1 | High |
| S2-5 | Standardize card components | 2 | Medium |
| S2-6 | Standardize button styles | 1 | Medium |

**Total Points**: 14

---

#### Sprint 3: Home Page Sections (Week 3)
**Sprint Goal**: Add 3+ sections to reach 10 total

| ID | Task | Story Points | Priority |
|----|------|--------------|----------|
| S3-1 | Create Testimonials section | 3 | High |
| S3-2 | Create FAQ section | 3 | High |
| S3-3 | Create Newsletter section | 2 | High |
| S3-4 | Improve Hero banner (60-70% height) | 2 | Medium |
| S3-5 | Add Partners/Sponsors section | 2 | Low |
| S3-6 | Update Stats section with animation | 2 | Low |

**Total Points**: 14

---

#### Sprint 4: New Pages & Features (Week 4)
**Sprint Goal**: Add required pages and features

| ID | Task | Story Points | Priority |
|----|------|--------------|----------|
| S4-1 | Create About page | 3 | High |
| S4-2 | Create Contact page | 3 | High |
| S4-3 | Create Help/Support page | 3 | High |
| S4-4 | Add demo credential button | 2 | High |
| S4-5 | Add sorting to All Issues page | 2 | Medium |
| S4-6 | Multiple images on issue details | 3 | Medium |

**Total Points**: 16

---

#### Sprint 5: Testing & Polish (Week 5)
**Sprint Goal**: Add testing and final polish

| ID | Task | Story Points | Priority |
|----|------|--------------|----------|
| S5-1 | Set up Vitest testing framework | 2 | High |
| S5-2 | Write hook unit tests | 3 | High |
| S5-3 | Write service unit tests | 3 | High |
| S5-4 | Write component tests | 3 | Medium |
| S5-5 | Final UI polish and fixes | 2 | Medium |
| S5-6 | Update README with features | 1 | Low |

**Total Points**: 14

---

## Product Backlog

### Backlog Structure

```
Epic
  └── Feature
        └── User Story
              └── Task
```

### Current Product Backlog

#### Epic 1: Production-Ready UI/UX
| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E1-US1 | As a user, I want dark mode so I can use the app comfortably at night | High | To Do |
| E1-US2 | As a user, I want consistent UI so the app feels professional | High | To Do |
| E1-US3 | As a user, I want loading skeletons so I know content is loading | Medium | To Do |
| E1-US4 | As a user, I want smooth animations for better experience | Low | To Do |

#### Epic 2: Home Page Enhancement
| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E2-US1 | As a visitor, I want to see testimonials to trust the platform | High | To Do |
| E2-US2 | As a visitor, I want FAQ section to find answers quickly | High | To Do |
| E2-US3 | As a visitor, I want newsletter signup to stay updated | Medium | To Do |
| E2-US4 | As a visitor, I want engaging hero section to understand the app | Medium | To Do |

#### Epic 3: Additional Pages
| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E3-US1 | As a visitor, I want About page to learn about the organization | High | To Do |
| E3-US2 | As a visitor, I want Contact page to reach out for help | High | To Do |
| E3-US3 | As a user, I want Help page to understand how to use the app | High | To Do |

#### Epic 4: Enhanced Features
| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E4-US1 | As a user, I want demo login to try the app without registration | High | To Do |
| E4-US2 | As a user, I want to sort issues by different criteria | Medium | To Do |
| E4-US3 | As a citizen, I want to upload multiple images for my issue | Medium | To Do |

#### Epic 5: Code Quality
| ID | User Story | Priority | Status |
|----|------------|----------|--------|
| E5-US1 | As a developer, I want automated tests for confidence in changes | High | To Do |
| E5-US2 | As a developer, I want code review for better quality | High | To Do |
| E5-US3 | As a developer, I want proper error handling for reliability | High | To Do |

---

## User Stories

### User Story Template

```markdown
## User Story: [Title]

**As a** [type of user]
**I want** [goal/desire]
**So that** [benefit/value]

### Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

### Technical Notes
- Implementation details
- Dependencies

### Story Points: X
### Priority: High/Medium/Low
```

### Example User Stories

#### US-001: Dark Mode Implementation

**As a** user
**I want** to switch between dark and light themes
**So that** I can use the app comfortably in different lighting conditions

**Acceptance Criteria:**
- [ ] Toggle button visible in navbar
- [ ] Theme persists after page refresh (localStorage)
- [ ] All components properly styled for both themes
- [ ] Proper text-background contrast in dark mode
- [ ] Smooth transition between themes

**Technical Notes:**
- Use React Context for theme state
- Create CSS variables for colors
- Test all pages in both modes

**Story Points:** 5
**Priority:** High

---

#### US-002: Demo Credential Button

**As a** visitor
**I want** to quickly try the app with demo credentials
**So that** I can explore features without creating an account

**Acceptance Criteria:**
- [ ] "Try Demo" buttons on login page (Admin, Staff, Citizen)
- [ ] Clicking auto-fills email and password
- [ ] Clear indication these are demo accounts
- [ ] Demo accounts pre-configured in database

**Technical Notes:**
- Create demo accounts for each role
- Store demo credentials in constants (not secrets)
- Auto-fill form fields on click

**Story Points:** 2
**Priority:** High

---

#### US-003: FAQ Section

**As a** visitor
**I want** to find answers to common questions
**So that** I can understand the platform without contacting support

**Acceptance Criteria:**
- [ ] Accordion-style FAQ component
- [ ] At least 8 relevant questions
- [ ] Smooth expand/collapse animation
- [ ] Search or filter functionality (optional)
- [ ] Responsive design

**Technical Notes:**
- Create reusable Accordion component
- FAQ content in separate data file
- Consider using DaisyUI collapse

**Story Points:** 3
**Priority:** High

---

## Sprint Ceremonies

### Daily Standup (Self-Check)

**When:** Start of each work session
**Duration:** 5-10 minutes

**Questions to Answer:**
1. What did I accomplish in the last session?
2. What will I work on now?
3. Are there any blockers?

**Template:**
```markdown
## Daily Standup - [Date]

### Completed
- [x] Task 1
- [x] Task 2

### In Progress
- [ ] Task 3 (70% done)

### Planned
- [ ] Task 4
- [ ] Task 5

### Blockers
- None / [Description of blocker]
```

---

### Sprint Planning

**When:** Start of each sprint
**Duration:** 30-60 minutes

**Agenda:**
1. Review sprint goal
2. Select stories from backlog
3. Break stories into tasks
4. Estimate effort
5. Commit to sprint backlog

**Output:** Sprint backlog with committed tasks

---

### Sprint Review

**When:** End of each sprint
**Duration:** 30 minutes

**Agenda:**
1. Demo completed features
2. Review what was done vs. planned
3. Gather feedback
4. Update product backlog

**Template:**
```markdown
## Sprint Review - Sprint X

### Sprint Goal
[Goal description]

### Completed
- [x] Feature 1 - Demo link
- [x] Feature 2 - Demo link

### Not Completed
- [ ] Feature 3 - Reason: [explanation]

### Demo Notes
- [Key points from demo]

### Feedback
- [Feedback received]

### Backlog Updates
- [New items or priority changes]
```

---

### Sprint Retrospective

**When:** After sprint review
**Duration:** 15-30 minutes

**Format:** Start, Stop, Continue

**Template:**
```markdown
## Sprint Retrospective - Sprint X

### What Went Well (Continue)
- Good practice 1
- Good practice 2

### What Didn't Go Well (Stop)
- Problem 1
- Problem 2

### What to Try (Start)
- New approach 1
- New approach 2

### Action Items
- [ ] Action 1 - Owner
- [ ] Action 2 - Owner
```

---

## Definition of Done

### User Story DoD

A user story is considered **DONE** when:

- [ ] All acceptance criteria met
- [ ] Code reviewed (CodeRabbit + self-review)
- [ ] Unit tests written and passing
- [ ] No console errors or warnings
- [ ] Works on mobile, tablet, desktop
- [ ] Works in both light and dark mode
- [ ] Documentation updated (if needed)
- [ ] Merged to develop branch
- [ ] Deployed to staging (if applicable)

### Task DoD

A task is considered **DONE** when:

- [ ] Code complete and working
- [ ] Self-tested manually
- [ ] No linting errors
- [ ] Committed with proper message
- [ ] PR created (if applicable)

### Sprint DoD

A sprint is considered **DONE** when:

- [ ] All committed stories meet DoD
- [ ] Sprint review completed
- [ ] Retrospective completed
- [ ] Documentation updated
- [ ] Deployed to production (if release sprint)

---

## Project Board

### Board Structure (Kanban)

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   BACKLOG   │    TODO     │ IN PROGRESS │   REVIEW    │    DONE     │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│             │             │             │             │             │
│  Prioritized│   Sprint    │  Currently  │   Waiting   │  Completed  │
│   stories   │   backlog   │   working   │  for review │   & merged  │
│             │             │             │             │             │
│             │   (max 5)   │   (max 2)   │   (max 3)   │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### WIP Limits

| Column | WIP Limit | Reason |
|--------|-----------|--------|
| TODO | 5 | Focus on current sprint |
| In Progress | 2 | Minimize context switching |
| Review | 3 | Don't block on reviews |

### Card Template

```markdown
### [Task Title]

**Type:** Feature / Bug / Refactor / Docs
**Priority:** High / Medium / Low
**Story Points:** X
**Sprint:** Sprint X

**Description:**
Brief description of the task

**Acceptance Criteria:**
- [ ] Criteria 1
- [ ] Criteria 2

**Labels:** frontend, backend, ui, testing
```

### GitHub Project Board Setup

```bash
# Create labels
gh label create "priority: high" --color "d73a4a"
gh label create "priority: medium" --color "fbca04"
gh label create "priority: low" --color "0e8a16"
gh label create "type: feature" --color "1d76db"
gh label create "type: bug" --color "d73a4a"
gh label create "type: refactor" --color "5319e7"
gh label create "type: docs" --color "0075ca"
gh label create "sprint: 1" --color "bfdadc"
gh label create "sprint: 2" --color "bfdadc"
```

---

## Estimation

### Story Points Scale (Fibonacci)

| Points | Complexity | Example |
|--------|------------|---------|
| 1 | Trivial | Fix typo, update text |
| 2 | Simple | Add constant file, simple component |
| 3 | Medium | New page, new hook |
| 5 | Complex | New feature with multiple components |
| 8 | Very Complex | Major refactoring, new system |
| 13 | Epic | Should be broken down |

### Estimation Guidelines

1. **Compare to reference stories** - Use completed stories as baseline
2. **Include everything** - Design, code, test, review
3. **Uncertainty increases points** - Unknown = higher points
4. **Team consensus** - Discuss if estimates differ

### Velocity Tracking

| Sprint | Committed | Completed | Velocity |
|--------|-----------|-----------|----------|
| Sprint 1 | 14 | - | - |
| Sprint 2 | 14 | - | - |
| Sprint 3 | 14 | - | - |
| Sprint 4 | 16 | - | - |
| Sprint 5 | 14 | - | - |

**Average Velocity:** TBD (after 3 sprints)

---

## Metrics & Reporting

### Sprint Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Velocity | Story points completed | Stable |
| Burndown | Points remaining over time | Linear decline |
| Scope Change | Stories added/removed mid-sprint | < 10% |
| Bug Count | Bugs found in sprint | Decreasing |

### Sprint Burndown Chart

```
Story Points
     │
  14 │●
  12 │  ●
  10 │    ●
   8 │      ●
   6 │        ●
   4 │          ●
   2 │            ●
   0 │──────────────●───
     └─────────────────→ Days
       1  2  3  4  5  6  7
```

### Quality Metrics

| Metric | Target |
|--------|--------|
| Code Review Coverage | 100% |
| Test Coverage | > 70% |
| Bug Escape Rate | < 2 per sprint |
| Technical Debt | Decreasing |

---

## Agile Tools

### Recommended Tools

| Tool | Purpose | Free Tier |
|------|---------|-----------|
| **GitHub Projects** | Project board, issues | Yes |
| **GitHub Issues** | User stories, tasks | Yes |
| **GitHub Milestones** | Sprint tracking | Yes |
| **Notion** | Documentation, wiki | Yes |
| **Trello** | Kanban board (alternative) | Yes |
| **Linear** | Modern issue tracking | Yes |

### GitHub Integration

```bash
# Create milestone for sprint
gh api repos/:owner/:repo/milestones -f title="Sprint 1" -f due_on="2026-01-09T00:00:00Z"

# Create issue from user story
gh issue create --title "Implement dark mode" --body "..." --label "type: feature,priority: high" --milestone "Sprint 1"

# Move issue to project board
gh project item-add 1 --owner @me --url <issue-url>
```

---

## Quick Reference

### Daily Workflow

```
1. Check project board
2. Update task status
3. Pick next task from TODO
4. Move to IN PROGRESS
5. Work on task
6. Create PR when done
7. Move to REVIEW
8. Address feedback
9. Move to DONE when merged
```

### Git + Agile Workflow

```bash
# Start new task
git checkout develop
git pull origin develop
git checkout -b feature/S1-1-git-branching

# Work and commit
git add .
git commit -m "feat(git): set up develop branch

Implements S1-1
- Created develop branch
- Updated branch protection rules"

# Create PR
git push origin feature/S1-1-git-branching
gh pr create --title "feat(git): set up develop branch" --body "Closes #1"

# After review approval
git checkout develop
git merge feature/S1-1-git-branching
git push origin develop
```

---

## Getting Started with Agile

### Step 1: Set Up Project Board (5 mins)
```bash
# GitHub CLI
gh repo view --web  # Go to repo
# Click: Projects → New Project → Board
# Create columns: Backlog, TODO, In Progress, Review, Done
```

### Step 2: Create Sprint Milestone (2 mins)
```bash
gh api repos/:owner/:repo/milestones -f title="Sprint 1" -f description="Foundation & Architecture" -f due_on="2026-01-09"
```

### Step 3: Add User Stories as Issues (10 mins)
```bash
gh issue create --title "Implement dark mode" --label "type: feature,priority: high" --milestone "Sprint 1"
```

### Step 4: Start Working!
Follow the daily workflow above.

---

*Document Version: 1.0.0*
*Last Updated: January 2, 2026*
