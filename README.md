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