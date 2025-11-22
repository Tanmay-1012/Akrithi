# Samsung S25 Ultra Murder Mystery Phone - Interactive Experience

## Overview

This is an interactive single-page web application that simulates a Samsung S25 Ultra phone interface as part of a murder mystery experience. The application recreates Samsung's One UI 7 design language with authentic phone interactions including lock screen, home screen, and various apps (Messages, Gallery, Notes, Phone, Recorder). Users unlock the phone and explore different apps to uncover evidence and clues related to the mystery narrative.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using functional components and hooks for state management.

**Routing**: Wouter for client-side routing. The application uses a minimal routing setup with the main phone interface at "/" and a 404 handler.

**UI Framework**: Shadcn/ui component library built on Radix UI primitives. This provides accessible, customizable components following the "New York" style variant. The project includes a comprehensive set of pre-built UI components (buttons, dialogs, forms, cards, etc.) stored in `client/src/components/ui/`.

**Styling**: Tailwind CSS with custom Samsung-specific design tokens:
- Custom colors for Samsung UI (samsung-blue, samsung-green, samsung-surface, samsung-bg)
- Extended border radius values matching Samsung's design language
- CSS variables system for theming support
- Dark mode configuration (default theme)

**State Management**: React's built-in useState hooks for local component state. The main phone component manages screen transitions, password validation, and app navigation states.

**Key Design Patterns**:
- Screen transition system with fade effects between phone screens
- Password-protected unlock mechanism (hardcoded password: "0712")
- Component-based architecture separating lock screen, home screen, and individual app interfaces
- Responsive design with mobile-first approach, centered phone mockup on desktop

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript support.

**Development vs Production**:
- Development mode uses Vite dev server with HMR (Hot Module Replacement)
- Production mode serves pre-built static assets from `dist/public`
- Separate entry points: `server/index-dev.ts` and `server/index-prod.ts`

**Build System**: 
- Vite for frontend bundling with React plugin
- ESBuild for backend transpilation
- Development tooling includes runtime error overlay and Replit-specific plugins

**API Structure**: Placeholder routes setup in `server/routes.ts` with HTTP server creation. Currently minimal backend functionality as the application is primarily client-side driven.

**Storage Layer**: In-memory storage implementation (`MemStorage` class) with interface definition for potential database integration. Currently includes user CRUD operations using Map-based storage.

### Data Storage Solutions

**Current Implementation**: In-memory storage using JavaScript Map objects for user data. This is a temporary solution suitable for development.

**Database Schema**: PostgreSQL schema defined via Drizzle ORM in `shared/schema.ts`:
- Users table with UUID primary key, username (unique), and password fields
- Drizzle-Zod integration for type-safe validation

**Database Configuration**: 
- Drizzle Kit configured for PostgreSQL dialect
- Connection via `DATABASE_URL` environment variable
- Migrations output to `./migrations` directory
- Schema-first approach with TypeScript types inferred from Drizzle schema

**Design Decision**: The application uses Drizzle ORM with PostgreSQL configuration, though the current storage implementation is in-memory. This allows for easy migration to a real database when needed without changing the storage interface.

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives (@radix-ui/*) - 20+ component primitives for accessible UI
- Shadcn/ui configuration with "new-york" style variant
- Lucide React for icons
- Class Variance Authority (CVA) for component variant styling
- CLSX and Tailwind Merge for className utilities

**Database & ORM**:
- Drizzle ORM (drizzle-orm) for database operations
- Drizzle Zod for schema validation
- Neon Database serverless driver (@neondatabase/serverless)
- PostgreSQL via pg-simple session store (connect-pg-simple)

**State Management & Data Fetching**:
- TanStack React Query (@tanstack/react-query) for server state management
- React Hook Form (@hookform/resolvers) for form handling

**Build Tools**:
- Vite as build tool and dev server
- PostCSS with Tailwind CSS and Autoprefixer
- TypeScript for type safety
- TSX for running TypeScript in development

**Utilities**:
- date-fns for date manipulation
- embla-carousel-react for carousel functionality
- cmdk for command palette interfaces
- Wouter for client-side routing

**Design System**: Google Fonts (Roboto) loaded via CDN for Samsung-like typography, with system fallbacks.