# CalTrade - California Chinese Community Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Open in Devbox](https://jetpack.io/img/devbox/open-in-devbox.svg)](https://devbox.new/yourusername/caltrade)
[![CI/CD Pipeline](https://github.com/yourusername/caltrade/actions/workflows/main.yml/badge.svg)](https://github.com/yourusername/caltrade/actions)

**A localized marketplace platform for Chinese communities in California**  
🌍 Live Demo: https://cal-trade.vercel.app | 📚 API Docs: https://api.cal-trade.dev/docs

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)
- [Authentication System Implementation](#authentication-system-implementation)
- [Admin Dashboard Implementation](#admin-dashboard-implementation)
- [Development Log](#development-log)

## Features
### Core Functionality
- **Location-Based Discovery**
  - Radius filtering (5km/10km/20km)
  - Map visualization with clustering
- **User System**
  - WeChat OAuth + SMS verification
  - Reputation scoring system
- **Item Management**
  - Multi-image/video upload (WebP optimization)
  - Automatic NSFW content detection
- **Real-Time Communication**
  - WebSocket-based chat
  - Push notifications
- **Search**
  - Chinese/English bilingual search
  - Pinyin fuzzy matching

### Admin Features
- Content moderation dashboard
- Analytics dashboard (Sales trends, user activity)
- Bulk operations API

## Tech Stack
### Frontend
| Component          | Technology             | Version |
|--------------------|------------------------|---------|
| Framework          | Next.js 14 (App Router)| 14.2.3  |
| State Management   | Zustand + React Query  | 4.0.0   |
| Mapping            | MapLibre GL + Turf.js  | 3.1.0   |
| UI Library         | Shadcn/ui              | 0.6.0   |
| Internationalization| next-intl              | 3.6.0   |

### Backend
| Component          | Technology             | Version |
|--------------------|------------------------|---------|
| Framework          | NestJS                 | 10.0.0  |
| ORM                | Prisma                 | 5.7.1   |
| Real-Time          | Socket.IO              | 4.7.2   |
| Search Engine      | Typesense              | 0.25.0  |
| Task Queue         | BullMQ                 | 5.2.0   |

### Infrastructure
| Service            | Provider               | Usage           |
|--------------------|------------------------|-----------------|
| Database           | PostgreSQL (Supabase)  | 15+ with PostGIS|
| Cache              | Redis (Upstash)        | 7+              |
| Object Storage     | Supabase Storage       | S3-compatible   |
| Monitoring         | Grafana Cloud          | Free Tier       |
| CI/CD              | GitHub Actions         | -               |

## Architecture
```mermaid
graph TD
    A[Client] --> B[Next.js Edge]
    B -->|API Calls| C[NestJS Gateway]
    C --> D[Auth Service]
    C --> E[Item Service]
    C --> F[Chat Service]
    D --> G[(PostgreSQL)]
    E --> H[(Redis)]
    F --> I[(Redis Pub/Sub)]
    C --> J[Typesense Cluster]
    K[Admin Panel] --> C
    L[Monitoring] -->|Metrics| M[Prometheus]
    M --> N[Grafana]
```

## Authentication System Implementation

### Core Components

1. **User Authentication Methods**:
   - WeChat OAuth2 integration using a custom provider
   - SMS verification with Twilio for phone-based authentication
   - JWT token management for secure sessions

2. **Database Schema**:
   - User model with support for multiple authentication methods
   - Account model for OAuth providers
   - Session model for managing user sessions
   - VerificationToken model for email/phone verification

3. **Authentication Flow**:
   - Sign-in page with WeChat and phone authentication options
   - SMS verification code generation and validation
   - Error handling and user feedback

4. **Security Features**:
   - JWT-based sessions with Redis for storage
   - Rate limiting for SMS verification
   - Secure token handling and validation
   - Type-safe authentication with Zod validation

5. **User Experience**:
   - Clean sign-in interface
   - Profile display on successful authentication
   - Route protection with middleware
   - Proper error handling and user feedback

### Technical Implementation

1. **NextAuth.js Configuration**:
   - Custom WeChat OAuth provider
   - Phone-based credentials provider
   - JWT session strategy
   - Custom callbacks for token and session handling

2. **Prisma Database Integration**:
   - Schema definition for users and authentication
   - Adapter integration with NextAuth.js
   - Type-safe database queries

3. **Redis Integration**:
   - Session storage
   - Verification code storage with expiration
   - Rate limiting implementation

4. **TypeScript Type Safety**:
   - Custom type declarations for NextAuth.js
   - Zod validation for user inputs
   - Type-safe API routes and components

### Next Steps

To complete the implementation, you would need to:

1. Set up a PostgreSQL database and update the connection string in `.env`
2. Set up a Redis instance and update the connection string in `.env`
3. Register for WeChat developer account and obtain OAuth credentials
4. Register for Twilio account and obtain SMS API credentials
5. Run database migrations with `npx prisma migrate dev`

## Admin Dashboard Implementation

### Core Components

1. **Admin Dashboard Layout**:
   - Responsive layout with a sidebar navigation
   - Top navigation bar with user information
   - Navigation links to all admin pages

2. **Content Moderation Page (Priority 1)**:
   - Tabbed interface for different listing statuses (Pending, Flagged, Approved, Rejected)
   - Data table with listing details and quick approve/reject actions
   - Bulk operations functionality for approving or rejecting multiple listings at once
   - Visual indicators for flagged content and report counts
   - Mock data for testing the content moderation features

3. **User Management Page (Priority 2)**:
   - Searchable user table with filtering by role
   - Role assignment dropdown for changing user roles
   - User status indicators (active, suspended, inactive)
   - User action buttons for suspending or reactivating accounts
   - Verification level indicators
   - Mock user data for testing

4. **Analytics Overview Page (Priority 3)**:
   - Key metrics cards showing important platform statistics
   - Various chart types (area charts, bar charts, donut charts)
   - Date range selector for filtering analytics data
   - Tabbed sections for different analytics categories (Overview, User Activity, Content, Transactions)
   - Performance metrics with visual indicators

### Technical Implementation

1. **Component Architecture**:
   - Client-side React components with state management
   - Reusable table components for different data types
   - Responsive design for all screen sizes
   - Tab-based navigation for content organization

2. **Data Management**:
   - Mock data services for listings, users, and analytics
   - State management for user interactions
   - Filter and search functionality
   - Bulk operations handling

3. **UI Framework Integration**:
   - Tremor.io components for charts and metrics
   - Custom styled tables and forms
   - Interactive elements with immediate visual feedback
   - Consistent design language across all admin pages

4. **TypeScript Type Safety**:
   - Strong typing for all data models
   - Type-safe component props
   - Utility types for filtering and transformations
   - Consistent error handling

### Next Steps

To enhance the admin dashboard, consider:

1. Connecting to real API endpoints instead of mock data
2. Implementing server-side pagination for large datasets
3. Adding more advanced filtering and sorting options
4. Implementing real-time updates for content moderation
5. Adding user activity logs and audit trails

## Development Log

### 2023-05-20: Admin Dashboard UI Enhancement

#### Changes Made
- **Modern UI Framework Implementation**
  - Added Tailwind CSS with custom color schemes and dark mode support
  - Created a comprehensive design system with consistent styling
  - Implemented responsive design for all screen sizes

- **Component Library Development**
  - Created reusable UI components:
    - Button: Multiple variants with consistent styling
    - Card: Flexible layout with header, content, and footer
    - Badge: Status indicators with semantic colors
    - Tabs: Organized content navigation

- **Layout Improvements**
  - Redesigned sidebar with icon support and active state indicators
  - Added responsive mobile navigation with backdrop
  - Implemented user profile section with quick actions
  - Created a sticky header with search and notification features

- **Dashboard Visualization**
  - Enhanced metric cards with trend indicators and icons
  - Added preview sections for pending content and actions
  - Implemented activity feed with priority indicators
  - Created consistent card layouts for all dashboard sections

- **Accessibility and UX**
  - Added proper ARIA labels for screen readers
  - Ensured keyboard navigation works throughout the interface
  - Implemented proper focus states and interactive elements
  - Added fallback images and error handling

#### Technical Details
- Implemented utility functions for class name merging (`cn`)
- Used CSS variables for theming and dark mode support
- Created TypeScript interfaces for component props
- Added Lucide React for consistent iconography
- Implemented compound component patterns for complex UI elements

#### Next Steps
- Enhance the content moderation and user management pages with the new UI
- Add animations and transitions for a more polished experience
- Implement theme persistence using local storage
- Create additional UI components for forms and data visualization

## License

This project is licensed under the MIT License.

# CalTrade Admin Dashboard

This is the admin dashboard for the CalTrade application.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Run the development server
pnpm run dev
```

### Production

```bash
# Build the application
pnpm run build

# Start the production server
pnpm run start
```

## Auto-Compile Scripts

This project includes scripts to automatically rebuild the application when changes are detected.

### Watch and Build

This script watches for file changes and triggers a build when changes are detected:

```bash
pnpm run watch
```

### Watch and Serve

This script watches for file changes, triggers a build, and restarts the server when changes are detected:

```bash
pnpm run watch:serve
```

### How It Works

The auto-compile scripts use `chokidar` to watch for file changes in the following directories:

- `src/**/*` - All files in the src directory
- `public/**/*` - All files in the public directory
- `*.js`, `*.json`, `*.ts`, `*.tsx` - All JavaScript, JSON, TypeScript, and TSX files in the root directory

When changes are detected, the scripts will:

1. Debounce the changes (wait for 1 second of inactivity)
2. Kill any existing build process
3. Run `pnpm run build`
4. (For watch:serve) Kill any existing server process and start a new one

## Features

- User authentication
- Content moderation
- User management
- Analytics dashboard

## License

This project is licensed under the MIT License.