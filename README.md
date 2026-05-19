# Schedio - Enterprise Task & Team Management Platform

Schedio is a full-stack, multi-tenant scheduling and organization management platform. Built with a modern Next.js 16 frontend and a robust NestJS backend, it features role-based access control, background job processing for timed task execution, and a fully dynamic global system configuration engine.

![Next.js](https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React%2019-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20v4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/bullmq-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-green?style=for-the-badge&logo=swagger)
![Auth](https://img.shields.io/badge/Auth-JWT%20%7C%20OAuth-blue?style=for-the-badge)



## 🏗 System Architecture

Schedio is structured as a monorepo, cleanly separating the client application from the API services.

```text
schedio-workspace/
├── Client/                 # Next.js 16 App Router Frontend
│   ├── src/app/            # Server Components, Dynamic SEO & Layouts
│   ├── src/components/     # Shadcn UI & custom UI components
│   ├── src/features/       # Client components & React Query hooks
│   ├── src/lib/            # Axios instance & Schemas & utils
│   ├── src/constants/      # Constants
│   ├── src/proxy/          # Middleware and redirections
│   └── .env                # Environment variables
└── Server/                 # NestJS API Backend
    ├── src/features/       # Feature modules (auth, users, orgs, tasks, background-jobs, etc)
    ├── src/common/         # Decorators, filters, pipes, etc.
    ├── src/config/         # App, DB, Redis, JWT, Mail, Cloudinary config & Joi validation
    ├── src/integrations/   # External integrations (Mail & Media storage)
    ├── src/test/           # Setup and helpers for integration testing
    └── .env                # Environment variables (.env for dev & .env.production for prod)
```

## 🚀 Tech Stack

### Frontend (`/Client`)
- **Framework:** Next.js 16 (App Router, Server Components, Request Deduplication)
- **Library:** React 19 (with Babel React Compiler)
- **Styling:** Tailwind CSS v4, Shadcn UI, CSS3
- **State Management:** TanStack React Query v5 (Server State), Zustand v5 (Client State)
- **Forms & Validation:** React Hook Form + Zod

### Backend (`/Server`)
- **Framework:** NestJS
- **Database:** PostgreSQL with TypeORM
- **Caching & Queues:** Redis & BullMQ
- **Schema validation:** Joi
- **Authentication:** JWT with httpOnly secure cookie refresh token rotation
- **Media Storage:** Cloudinary integration for storing media and Image optimization
- **Documentation:** Swagger UI

## 👑 Role-Based Access & Dashboards

Schedio features a rigorous 4-tier access system, each with isolated views and permissions:

- **Guest (Public):** Access to dynamic public pages (Landing, Blog, Privacy Policy, Contact, etc).
- **Employee:** 
  - View assigned tasks, track and complete them and mark them as done.
  - Read-only access to view their organization's profile, projects and team members.
- **Manager:**
  - Create Organization.
  - View & Edit Organization profile
  - Complete organization control.
  - Invite/create employees (triggers secure email verification).
  - Create projects and assign tasks to employees.
  - Suspend/unsuspend employees.
  - Archive/restore projects.
  - Delete and update tasks
- **Administrator (Superuser):**
  - **Global Activity Feed:** Monitor real-time system events (registrations, creation, deletions, restoration,... ).
  - **System Health:** Track critical errors and server logs.
  - **User Management:** Ban, archive, or permanently delete users across all organizations.
  - **Organization Management:** Archive or restore entire organizations (with associated data).
  - **Analytics:** High-level metrics on role distribution, user growth, and task volume.
  - **System Settings:** Dynamically control the app's global branding (App Name, Logos, Banners, SEO metadata) This data is hyper-optimized through a dual-layer caching system: cached in Redis on the NestJS backend and seamlessly propagated to the Next.js frontend cache for zero-latency loading.

## ⚙️ Core Features

- **Timed Task Execution:** Tasks are not just static database rows; they are scheduled via BullMQ. The system automatically tracks execution times and marks tasks as overdue if missed.
- **Smart Data Retention (Soft Deletes):** Data is never immediately destroyed.Archiving an organization archives all associated users & projects& tasks, Archiving a project archives all associated tasks. Archiving an employee suspends them and archives their tasks. A background job permanently purges soft-deleted data after 30 days.
- Only admin can immediatly hard delete a user without cascading.
- **Dynamic SEO & Caching:** Next.js seamlessly fetches global configurations (logos, title, ads, contact info, etc) from redis cache, converting them into statically optimized metadata while eliminating redundant database queries.

## 🛠 Getting Started

### Prerequisites
- Node.js (v22+ recommended)
- Docker (For localized Postgres DB and Redis)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Ahmed-Ossamaa/Task-Scheduler.git
cd Task-Scheduler
# navigate to /Client
cd Client
npm install
# navigate to /Server
cd Server
npm install
```

## Enviroment variables:
 - There are `.env.example` in each directory (Server & Client)
 - For Client : just rename it to .env and use your own data
 - For Server : you can rename it to `.env` , or split it into `.env` for development & `.env.production` for production..

Start up your database and queue infrastructure:

```bash
docker-compose up -d
```

### Running the Application

**Backend API:**
```bash
cd Server
npm run start:dev
```
*API Swagger Documentation available at:* 
- http://localhost:5000/api   (locally)
- https://task-scheduler-ppdm.onrender.com/api (later: your deployed backend url/api)

**Frontend Client:**
```bash
cd Client
npm run dev
```

## 🧪 Testing

```bash
npm run test              # Run unit tests
npm run test:integration  # Run integration tests using test database
```

## 🗺 Roadmap

Schedio is actively maintained and continuously evolving. Here is a look at our current progress and what is coming next:

- [x] Core task scheduling and organization management
- [x] Full-stack Role-Based Access Control (RBAC) implementation
- [x] BullMQ background job processing for timed execution
- [x] Dynamic global system settings cache (Redis + Next.js)
- [x] Advanced Analytics for Admin Dashboard
- [x] Complete frontend integration for OAuth2  (Google)
- [ ] Role-specific Analytics for Manager and Employee Dashboards
- [ ] Payment Gateway Integration (Stripe/PayPal)
- [ ] Real-time notifications via WebSockets
- [ ] CI/CD pipeline automation

## 🤝 Contributing & Feedback

This project is open-source and I am always looking for ways to improve the architecture and user experience! 

If you have suggestions, found a bug, or want to discuss the codebase:
1. Open an [Issue](https://github.com/Ahmed-Ossamaa/Task-Scheduler/issues) to discuss proposed changes.
2. Feel free to fork the repository and submit a Pull Request.
3. Reach out directly if you have feedback on the system design!