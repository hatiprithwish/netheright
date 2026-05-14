# Guidelines for authoring Zod schemas and TypeScript types in the schemas/ directory

# Schema Authoring Rules

## 1. Directory Structure

All shared types and schemas live under `schemas/`. Organize by domain, with a barrel `index.ts` per domain and a root `schemas/index.ts` that re-exports all domains.

```
schemas/
├── index.ts                  # Re-exports all domains
├── common/                   # Cross-domain primitives
│   ├── index.ts
│   ├── Api.ts                # Base ApiResponse, pagination helpers
│   ├── Enum.ts               # App-wide enums (SortDirection, BadgeColor, etc.)
│   ├── Env.ts                # ZEnvSchema for runtime env validation
│   └── ReactFlow.ts          # ReactFlow-specific sanitized graph types
└── [domain]/                 # e.g. interview/, user/, problems/, metadata/
    ├── index.ts
    ├── [Domain]Enum.ts       # TypeScript enums + Zod wrappers + lookup maps
    ├── [Domain]Common.ts     # Shared interfaces/types used within the domain
    ├── [Domain]ApiRequest.ts # Zod schemas for HTTP request bodies/params
    ├── [Domain]ApiResponse.ts# TypeScript interfaces extending ApiResponse
    └── [Domain]SqlRequest.ts # TypeScript interfaces for DAL method parameters
```

## 2. File Responsibilities

| File | What goes here |
|---|---|
| `[Domain]Enum.ts` | TypeScript `enum`s, their Zod wrappers (`z.enum()`), and bidirectional lookup `Record` maps |
| `[Domain]Common.ts` | Interfaces and Zod objects shared across API/SQL layers of the same domain |
| `[Domain]ApiRequest.ts` | Zod objects for validating HTTP request bodies; also `RepoRequest` types that extend them with server-side fields (e.g. `userId`) |
| `[Domain]ApiResponse.ts` | Plain TypeScript `interface`s extending the base `ApiResponse` interface |
| `[Domain]SqlRequest.ts` | Plain TypeScript `interface`s used as DAL method parameters; use integer enum values, not label enums |

## 3. Naming Conventions

- **Zod schemas**: Prefix with `Z` — `ZCreateInterviewRequest`, `ZInterviewPhaseIntEnum`
- **Inferred types**: Drop the `Z` prefix — `CreateInterviewRequest`, `InterviewPhaseIntEnum`
- **Enum pairs**: Pair an `IntEnum` (DB integer) with a `LabelEnum` (human-readable string) when both representations are needed
  - `InterviewPhaseIntEnum` / `InterviewPhaseLabelEnum`
  - `InterviewStatusIntEnum` / `InterviewStatusLabelEnum`
- **Lookup maps**: Use `camelCase` noun: `interviewPhaseIntToLabel`, `interviewPhaseLabelToInt`
- **Repo request types**: Append `RepoRequest` suffix for types that add server-side context to an API type
  - `CreateInterviewRepoRequest = CreateInterviewRequest & { userId: string }`

## 4. Enum Patterns

### Integer ↔ Label pairs
Always define both when an enum is stored as an integer in the DB but displayed as a string in the UI. Provide both `IntToLabel` and `LabelToInt` lookup maps.

```typescript
// Good example
export enum InterviewStatusIntEnum {
  Active = 1,
  Completed = 2,
}
export const ZInterviewStatusIntEnum = z.enum(InterviewStatusIntEnum);

export enum InterviewStatusLabelEnum {
  Active = "Active",
  Completed = "Completed",
}
export const ZInterviewStatusLabelEnum = z.enum(InterviewStatusLabelEnum);

export const interviewStatusIntToLabel: Record<InterviewStatusIntEnum, InterviewStatusLabelEnum> = {
  [InterviewStatusIntEnum.Active]: InterviewStatusLabelEnum.Active,
  [InterviewStatusIntEnum.Completed]: InterviewStatusLabelEnum.Completed,
};

export const interviewStatusLabelToInt: Record<InterviewStatusLabelEnum, InterviewStatusIntEnum> = {
  [InterviewStatusLabelEnum.Active]: InterviewStatusIntEnum.Active,
  [InterviewStatusLabelEnum.Completed]: InterviewStatusIntEnum.Completed,
};

// Bad example — missing label enum, missing lookup maps, raw strings
export enum InterviewStatus {
  Active = "active",
  Completed = "completed",
}
```

### Zod wrapper for TypeScript enums
Use `z.enum(MyEnum)` directly (Zod 4 supports native TS enum inference). Do **not** duplicate enum values into a `z.enum([...])` array unless a subset validation is explicitly needed.

```typescript
// Good
export const ZInterviewPhaseIntEnum = z.enum(InterviewPhaseIntEnum);

// Only acceptable when validating a subset of values
export const ZInterviewGradeLabelEnum = z.enum([
  InterviewGradeLabelEnum.F,
  InterviewGradeLabelEnum.C,
  InterviewGradeLabelEnum.B,
  InterviewGradeLabelEnum.A,
  InterviewGradeLabelEnum.S,
]);
```

### UI mapping records
Place display-layer mappings (e.g., enum → badge color) in `[Domain]Enum.ts`, importing shared display types from `common/`.

```typescript
// Good — in InterviewEnum.ts
import { BadgeColor } from "../common";

export const InterviewStatusLabelToBadgeColor: Record<InterviewStatusLabelEnum, BadgeColor> = {
  [InterviewStatusLabelEnum.Completed]: BadgeColor.Green,
  [InterviewStatusLabelEnum.Active]: BadgeColor.Yellow,
};
```

## 5. ApiRequest Schemas

- Use Zod objects for all HTTP request schemas.
- Compose schemas via `.extend()` rather than duplicating fields.
- Import Zod enum wrappers (`ZInterviewPhaseIntEnum`) from the same domain's `Enum.ts`.
- Add server-only fields (e.g. `userId`) in a separate `RepoRequest` type — never expose them in the API schema.

```typescript
// Good example
export const ZGetInterviewsByUserRequest = ZGetInterviewsByUserCountRequest.extend({
  pageNo: z.number().int().min(1).nullable().optional(),
  sortDirection: ZSortDirection.nullable().optional(),
});
export type GetInterviewsByUserRequest = z.infer<typeof ZGetInterviewsByUserRequest>;

export type GetInterviewsByUserRepoRequest = GetInterviewsByUserRequest & { userId: string };

// Bad example — server field exposed in API schema, no RepoRequest split
export const ZGetInterviewsByUserRequest = z.object({
  userId: z.string(),      // ❌ server-side field
  pageNo: z.number(),
});
```

## 6. ApiResponse Interfaces

- Use plain TypeScript `interface`s (not Zod objects) that `extend ApiResponse`.
- Import the base `ApiResponse` from `../common`.
- Nullable payloads should be typed `T | null`.

```typescript
// Good example
import { ApiResponse } from "../common";
import { Interview } from "./InterviewCommon";

export interface GetInterviewResponse extends ApiResponse {
  interview: Interview | null;
}

// Bad example — raw object, no base type
export type GetInterviewResponse = {
  isSuccess: boolean;
  interview: Interview;
};
```

## 7. SqlRequest Interfaces

- Use plain TypeScript `interface`s (not Zod objects).
- Use integer enum types (`InterviewPhaseIntEnum`), not label enums — the DAL talks to the database.
- Extend other SQL request interfaces when a query is a superset (e.g., pagination extends count).

```typescript
// Good example
export interface GetInterviewsCountSqlRequest {
  userId: string;
  status: number | null;
}

export interface GetInterviewsSqlRequest extends GetInterviewsCountSqlRequest {
  pageNo: number;
  pageSize: number;
  sortColumn: InterviewSortColumn;
  sortDirection: SortDirection;
}

// Bad example — label enum in a DAL interface
export interface CreateInterviewChatSqlRequest {
  phase: InterviewPhaseLabelEnum; // ❌ use integer enum
}
```

## 8. Common Domain

The `common/` domain contains cross-cutting primitives that other domains import. Rules:

- `Api.ts` — Base `ApiResponse`, `TotalRecordsResponse`, and `HasMoreData` Zod schemas and types.
- `Enum.ts` — App-wide enums not tied to a single domain (`SortDirection`, `BadgeColor`, `UserRole`, `FeatureEnum`, `AppStaticRoute`).
- `Env.ts` — A single `ZEnvSchema` Zod object for validating `process.env`.
- `ReactFlow.ts` — Sanitized graph shapes used when passing diagram data to the backend.

Never put domain-specific types (e.g., `Interview`, `InterviewPhaseIntEnum`) inside `common/`.

## 9. Barrel Exports

Every domain `index.ts` must re-export all files in the domain. The root `schemas/index.ts` re-exports all domains.

```typescript
// schemas/interview/index.ts — Good
export * from "./InterviewApiRequest";
export * from "./InterviewApiResponse";
export * from "./InterviewCommon";
export * from "./InterviewEnum";
export * from "./InterviewSqlRequest";

// schemas/index.ts — Good
export * from "./interview";
export * from "./common";
export * from "./user";
export * from "./problems";
export * from "./metadata";
```

## 10. Consumption

Always import schemas through the root barrel (`@/schemas`), never from internal domain paths directly.

```typescript
// Good
import * as Schemas from "@/schemas";
const result = Schemas.ZCreateInterviewRequest.parse(body);

// Bad
import { ZCreateInterviewRequest } from "@/schemas/interview/InterviewApiRequest";
```
