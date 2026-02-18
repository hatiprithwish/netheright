---
trigger: always_on
description: Project structure and file organization guidelines
---

# Folder Structure Rule

A scalable, production-ready Next.js application with clear **Separation of Concerns (SoC)** and layered backend architecture.

## 🏗️ Architecture Overview

This project implements a **three-layer backend architecture** to ensure maintainability and scalability:

### Backend Layers:

1. **API Routes** (`app/api/[feature]/[endpoint]/route.ts`) - HTTP request handlers, validation, and response formatting
2. **Repositories** (`backend/repositories/*Repo.ts`) - Business logic, orchestration, and AI integration
3. **Data Access Layer** (`backend/data-access-layer/*DAL.ts`) - Raw CRUD operations using Drizzle ORM

### Frontend Organization:

1. **UI Components** (`frontend/ui/[feature]/`) - React components organized by feature
2. **API Client** (`frontend/api/`) - SWR hooks, API client, and data fetching utilities

## 📂 Folder Structure

```text
netheright/
├── app/                           # Next.js App Router
│   ├── api/                       # API Routes
│   │   └── [feature]/             # Feature-based API endpoints
│   │       └── [endpoint]/
│   │           └── route.ts       # HTTP handlers (GET, POST, etc.)
│   ├── [feature]/                 # App pages
│   │   └── [route]/
│   │       └── page.tsx           # Page component
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
│
├── backend/                       # Backend Logic
│   ├── db/                        # Database Layer
│   │   ├── index.ts               # Database client (Drizzle + Neon)
│   │   ├── models/                # Table Definitions
│   │   │   └── index.ts           # All Drizzle table schemas (single file)
│   │   └── tables/                # SQL Table Definitions
│   │       └── [table_name].sql   # Raw SQL for each table
│   ├── drizzle/                   # Generated migrations (auto-generated)
│   ├── repositories/              # Business Logic Layer
│   │   └── [Feature]Repo.ts       # Business logic, AI integration, orchestration
│   ├── data-access-layer/         # Data Access Layer
│   │   └── [Feature]DAL.ts        # Raw CRUD operations with Drizzle
│   └── middlewares/               # Middleware Functions
│       └── ApiRequestValidator.ts # Request validation middleware
│
├── frontend/                      # Frontend Code
│   ├── ui/                        # UI Components
│   │   ├── [feature]/             # Feature-specific components
│   │   │   ├── components/        # React components
│   │   │   ├── utils/             # Feature utilities
│   │   │   ├── zustand.ts         # Feature state management
│   │   │   ├── [feature].schema.ts # Zod schemas for UI validation
│   │   │   └── index.tsx          # Main feature component
│   │   ├── common/                # Shared UI components
│   │   └── providers/             # React context providers
│   └── api/                       # API Client Layer
│       ├── apiClient.ts           # Base API client (fetch wrapper)
│       ├── cachedQueries.ts       # SWR cached queries
│       ├── mutations.ts           # SWR mutations
│       └── oneTimeQueries.ts      # One-time fetch queries
│
├── schemas/                       # Zod Schemas (Shared)
│   ├── index.ts                   # Central export
│   └── [domain]/                  # Domain-specific schemas
│       ├── [Domain]ApiRequest.ts  # API request schemas
│       ├── [Domain]ApiResponse.ts # API response schemas
│       ├── [Domain]SqlRequest.ts  # Database operation schemas
│       ├── [Domain]Common.ts      # Shared types/schemas
│       ├── [Domain]Enum.ts        # Enums and constants
│       └── index.ts               # Domain exports
│
├── lib/                           # Shared Utilities
│   ├── envConfig.ts               # Environment variable validation
│   ├── utils.ts                   # Utility functions
│   ├── [service]/                 # Third-party service configs
│   │   └── index.ts               # Service configuration
│   └── serializeGraph.ts          # Domain-specific utilities
│
├── public/                        # Static Assets
│   └── [assets]                   # Images, fonts, etc.
│
├── .agent/                        # Agent Configuration
│   ├── rules/                     # Agent rules
│   └── workflows/                 # Agent workflows
│
├── middleware.ts                  # Next.js middleware
├── drizzle.config.ts              # Drizzle configuration
└── next.config.ts                 # Next.js configuration
```

## 📝 File Naming Conventions

### Backend

- **Repositories**: `[Feature]Repo.ts` (e.g., `InterviewRepo.ts`)
  - Contains business logic, AI integration, and orchestration
  - Methods: `createSession()`, `getChatStream()`, `generateScorecard()`
- **Data Access Layer**: `[Feature]DAL.ts` (e.g., `InterviewDAL.ts`)
  - Contains raw CRUD operations using Drizzle
  - Methods: `createSession()`, `getSession()`, `updateSessionPhase()`

- **API Routes**: `app/api/[feature]/[endpoint]/route.ts`
  - Exports HTTP method handlers: `GET`, `POST`, `PUT`, `DELETE`
  - Uses middleware for validation

- **Middlewares**: `[Purpose]Middleware.ts` or descriptive names
  - Example: `ApiRequestValidator.ts`

### Frontend

- **Feature Components**: `frontend/ui/[feature]/components/[Component].tsx`
  - PascalCase for component files
- **Feature State**: `frontend/ui/[feature]/zustand.ts`
  - Zustand store for feature-specific state

- **API Client**: `frontend/api/[purpose].ts`
  - `apiClient.ts` - Base fetch wrapper
  - `cachedQueries.ts` - SWR hooks for cached data
  - `mutations.ts` - SWR mutation hooks

### Schemas

- **Schema Files**: `schemas/[domain]/[Domain][Type].ts`
  - PascalCase for domain name
  - Types: `ApiRequest`, `ApiResponse`, `SqlRequest`, `Common`, `Enum`
  - Example: `InterviewApiRequest.ts`, `InterviewEnum.ts`

### Database

- **Table Definitions**: All tables in `backend/db/models/index.ts`
  - Export individual tables: `export const users = pgTable(...)`
  - Use snake_case for table names: `sdi_sessions`, `ai_chats`

- **SQL Files**: `backend/db/tables/[table_name].sql`
  - One SQL file per table
  - Use snake_case: `sdi_sessions.sql`, `ai_chats.sql`

## 🔄 Data Flow

### Request Flow (API → Database)

```
1. API Route (route.ts)
   ↓ validates request with middleware
2. Repository (*Repo.ts)
   ↓ business logic, orchestration
3. Data Access Layer (*DAL.ts)
   ↓ raw database operations
4. Database (Drizzle ORM)
```

### Frontend Data Flow

```
1. UI Component
   ↓ uses SWR hook
2. API Client (cachedQueries.ts)
   ↓ fetches from
3. API Route (route.ts)
   ↓ returns data
4. SWR Cache
   ↓ updates
5. UI Component (re-renders)
```

## 📋 Examples

### Backend Example: Interview Feature

**API Route**: `app/api/interview/chat/route.ts`

```typescript
import { validateRequest } from "@/backend/middlewares/ApiRequestValidator";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";

const handler = async (req: Request) => {
  const { messages, phaseLabel, sessionId } = await req.json();
  return await InterviewRepo.getChatStream({ messages, phaseLabel, sessionId });
};

export const POST = validateRequest(
  { body: Schemas.ZGetChatStreamRequest, requiresAuth: true },
  handler,
);
```

**Repository**: `backend/repositories/InterviewRepo.ts`

```typescript
class InterviewRepo {
  static async createSession(userId: string, problemId: string) {
    return await InterviewDAL.createSession({ userId, problemId });
  }

  static async getChatStream(params: Schemas.GetChatStreamRequest) {
    // Business logic: persist message, stream AI response
    await InterviewDAL.createMessageInAiChats({ ... });
    return streamText({ ... });
  }
}
```

**Data Access Layer**: `backend/data-access-layer/InterviewDAL.ts`

```typescript
class InterviewDAL {
  static async createSession({
    userId,
    problemId,
  }: Schemas.CreateSessionParams) {
    const [session] = await db
      .insert(sdiSessions)
      .values({ userId, problemId, status: 1, currentPhase: 1 })
      .returning();
    return session;
  }

  static async getSession(sessionId: string) {
    return await db.query.sdiSessions.findFirst({
      where: eq(sdiSessions.id, sessionId),
    });
  }
}
```

### Frontend Example: Interview UI

**Component**: `frontend/ui/interview/components/phases/requirements/index.tsx`

```typescript
import { useInterviewStore } from "../../zustand";

export default function RequirementsPhase() {
  const { sessionId, messages } = useInterviewStore();
  // Component logic
}
```

**State Management**: `frontend/ui/interview/zustand.ts`

```typescript
import { create } from "zustand";

export const useInterviewStore = create<InterviewStore>((set) => ({
  sessionId: null,
  currentPhase: "requirements",
  messages: [],
  // ... actions
}));
```

**API Client**: `frontend/api/cachedQueries.ts`

```typescript
import useSWR from "swr";
import { fetcher } from "./apiClient";

export function useSession(sessionId: string) {
  return useSWR(`/api/interview/session/${sessionId}`, fetcher);
}
```

### Schema Example

**Schema File**: `schemas/interview/InterviewApiRequest.ts`

```typescript
import { z } from "zod";

export const ZGetChatStreamRequest = z.object({
  sessionId: z.string(),
  phaseLabel: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

export type GetChatStreamRequest = z.infer<typeof ZGetChatStreamRequest>;
```

## 🎯 Best Practices

### Backend

1. **Keep layers separate**: Never call DAL directly from API routes - always go through Repository
2. **Single responsibility**: DAL = database operations, Repository = business logic
3. **Use middleware**: Validate requests with `ApiRequestValidator` middleware
4. **Export classes**: Use static methods for Repository and DAL classes

### Frontend

5. **Feature organization**: Group related components in `frontend/ui/[feature]/`
6. **Use SWR**: Leverage `cachedQueries.ts` for data fetching with automatic caching
7. **State management**: Use Zustand for feature-specific state
8. **API client**: Always use `apiClient` from `frontend/api/apiClient.ts`

### Schemas

9. **Centralize schemas**: Keep all Zod schemas in `schemas/` directory
10. **Domain organization**: Group schemas by domain (e.g., `interview/`, `auth/`)
11. **Export types**: Always export both Zod schema and inferred TypeScript type
12. **Naming convention**: Prefix Zod schemas with `Z` (e.g., `ZGetChatStreamRequest`)

### Database

13. **Single models file**: Keep all table definitions in `backend/db/models/index.ts`
14. **SQL backups**: Maintain SQL files in `backend/db/tables/` for reference
15. **Use Drizzle**: Always use Drizzle ORM for type-safe database operations
16. **Snake case**: Use snake_case for table and column names
