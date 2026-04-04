---
trigger: always_on
---

# Guidelines for defining database tables and models using Drizzle ORM

These guidelines define the conventions and patterns for creating and managing database models with Drizzle ORM in PostgreSQL.

## 1. Unified Naming Convention

Always use `snake_case` for both the exported table variables and the explicit column keys in TypeScript. These should perfectly mirror the underlying Postgres table and column names.

```typescript
// Good example
export const role_features = pgTable("role_features", {
  role_id: text("role_id").notNull(),
  is_active: boolean("is_active").notNull().default(true),
});

// Bad example
export const roleFeatures = pgTable("role_features", {
  roleId: text("role_id").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});
```

_(Exception: `providerAccountId` in the `accounts` table is kept in camelCase strictly for NextAuth adapter compatibility)._

## 2. Primary Key Strategies

Choose the appropriate primary key strategy based on the entity type:

- **UUIDs:** Use natively generated UUIDs for standalone entities.
- **Sequential IDs:** Always use `bigint` with `generatedAlwaysAsIdentity()` instead of `bigserial`.

```typescript
// Good example - UUID
id: text("id").primaryKey().default(sql`gen_random_uuid()`),

// Good example - Sequential
id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),

// Bad example
id: bigserial("id", { mode: "bigint" }).primaryKey(),
```

## 3. Strong Typing with Enums

Always use Drizzle's `$type<T>()` casting to strongly type standard columns against centralized Zod enums or TypeScript types from `@/schemas` wherever applicable.

```typescript
// Good example
phase: integer("phase").$type<Schemas.InterviewPhaseIntEnum>().notNull(),
type: text("type").$type<AdapterAccountType>().notNull(),

// Bad example
phase: integer("phase").notNull(),
type: text("type").notNull(),
```

## 4. Preferred PostgreSQL Data Types

- **Strings:** Prefer `text` over `varchar` for all strings. There is no underlying performance difference in PostgreSQL.
- **JSON:** Exclusively use `jsonb` instead of standard `json` for structured data.
- **Arrays:** Leverage Postgres's native array support via `.array()` for simple lists rather than creating separate relationship tables.

```typescript
// Good example
description: text("description").notNull(),
content: jsonb("content").notNull(),
tags: text("tags").array(),

// Bad example
description: varchar("description", { length: 255 }).notNull(),
content: json("content").notNull(),
```

## 5. Timestamps and Audit Tracking

Almost every table should track creation.
Never use `{ mode: "date" }` with standard `created_at` or `updated_at` timestamp columns.

```typescript
// Good example
created_at: timestamp("created_at").notNull().defaultNow(),
updated_at: timestamp("updated_at"),

// Bad example
createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
updatedAt: timestamp("updated_at", { mode: "date" })
```

## 6. Table-Level Unique Constraints

Define composite unique constraints in the third parameter of `pgTable`, using the proper naming convention: `UK_tableName_firstColumnName`

```typescript
// Good example
export const features = pgTable(
  "features",
  {
    // ... columns
    perm_bit: integer("perm_bit").notNull(),
    perm_bit_index: integer("perm_bit_index").notNull(),
  },
  (table) => [
    unique("UK_features_perm_bit").on(table.perm_bit, table.perm_bit_index),
  ],
);

// Bad example
(table) => ({
  uniquePerm: unique().on(table.perm_bit, table.perm_bit_index),
});
```
