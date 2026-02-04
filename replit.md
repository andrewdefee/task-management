# Executive Task Command - replit.md

## Overview

Executive Task Command is a high-performance task management and reporting dashboard built for executives and team leads. The application provides comprehensive task tracking, delegation management, project health monitoring, and executive reporting capabilities. Users can create tasks, assign them to team members, track progress across projects, and visualize completion metrics through various charts and reports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Charts**: Recharts for data visualization (area charts, bar charts, pie charts)
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js 5 running on Node.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with JSON request/response format
- **Development**: Vite dev server with HMR integration for the client

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all database table definitions
- **Migrations**: Managed via `drizzle-kit push` command

### Database Schema
The application uses the following core entities:
- **Team Members**: id, name, role, createdAt
- **Projects**: id, name, createdAt
- **Statuses**: id, name, order, createdAt (e.g., Todo, In Progress, In Review, Blocked, Completed)
- **Priorities**: id, name, order, createdAt (e.g., Low, Medium, High, Critical)
- **Tasks**: id, title, description, projectId, statusId, priorityId, assigneeId, dueDate, completedAt, createdAt, updatedAt

### Project Structure
```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/   # UI components (layout, dashboard, reports)
│   │   ├── pages/        # Route pages
│   │   ├── lib/          # Utilities, API client, queries
│   │   └── hooks/        # Custom React hooks
├── server/           # Backend Express application
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   └── seed.ts       # Database seeding script
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema and Zod types
```

### API Structure
All API endpoints are prefixed with `/api/`:
- `/api/team-members` - CRUD for team members
- `/api/projects` - CRUD for projects
- `/api/statuses` - CRUD for task statuses
- `/api/priorities` - CRUD for priority levels
- `/api/tasks` - CRUD for tasks with filtering capabilities

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **pg**: Node.js PostgreSQL client
- **connect-pg-simple**: PostgreSQL session store (available but not currently active)

### Frontend Libraries
- **@tanstack/react-query**: Server state management
- **Radix UI**: Accessible UI primitives (dialog, dropdown, select, tabs, etc.)
- **Recharts**: Charting library for dashboards
- **date-fns**: Date manipulation utilities
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Build tool with React plugin
- **Drizzle Kit**: Database migration tooling
- **esbuild**: Server bundling for production
- **TypeScript**: Type checking across the stack

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator