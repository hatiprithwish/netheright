---
trigger: model_decision
description: Project structure and file organization guidelines
---

A scalable, production-ready Next.js application designed with **Separation of Concerns (SoC)** and **Feature-Based Module** organization.

## 🏗️ Architecture Overview

This project implements a modified MVC pattern (Route-Interactor-Repository) within feature modules to ensure the codebase remains maintainable as it grows.

### The Layers:
1.  **Routes (Server Actions/API):** `*.actions.ts` - Handles the incoming request, session extraction, and response formatting.
2.  **Services (Business Logic):** `*.interactor.ts` - The "brain" of the application. Handles validations, permissions, and complex workflows.
3.  **Repositories (DB Interactor):** `*.repository.ts` - The data access layer. Responsible for raw CRUD operations using Drizzle.

## 📂 Folder Structure

```text
├── app/                  # Next.js App Router (Pages & Layouts)
├── components/           # Global Shared UI (shadcn/ui primitives)
├── features/             # Domain Modules
│   └── [feature-name]/   # e.g., 'projects', 'billing', 'auth'
│       ├── zustand.ts    # Zustand store for this feature
│       ├── components/   # Feature-specific UI
│       ├── server/       # Backend Logic
│       │   ├── *.action.ts      # Layer 1: Server Actions
│       │   ├── *.service.ts     # Layer 2: Business Logic
│       │   └── *.repository.ts  # Layer 3: DB Access (Drizzle)
│       ├── *.schema.ts   # Zod validation schemas
│       └── index.ts      # Public API for the feature (if any)
├── lib/                  # Shared library configs
├── zustand/              # Global UI state: sidebar, theme
└── types/                # Global TypeScript definitions
|── db/                   # data layer
│   ├── index.ts               # Database client initialization (Neon/Postgres)
│   ├── schema/                # All table definitions live here
│       ├── index.ts           # Central export for Drizzle config
│       ├── [table_name].ts    # One file will contain only one table schema. Use snake case
├── drizzle/                # Generated migrations (automatically handled by drizzle-kit)

```