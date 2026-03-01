---
trigger: model_decision
description: Rules and guidelines for SQL Table Schema
---

# SQL Table Schema Guidelines

When adding new tables to the project, you must follow these rules to maintain a consistent database schema structure and migration process.

1. **Do not run Drizzle migration. This should be only done by user.**

2. **Add the tables into both required locations:**
   - Add the Drizzle ORM model definition inside `backend/db/models/index.ts`.
   - Add the raw SQL definition for the table under the `backend/db/tables/` directory as a `.sql` file (e.g., `backend/db/tables/[table_name].sql`).

### Example

When creating a new table called `user_preferences`:

**1. Add Drizzle schema in `backend/db/models/index.ts`:**

```typescript
export const userPreferences = pgTable("user_preferences", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  theme: text("theme").default("light"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});
```

**2. Add raw SQL in `backend/db/tables/user_preferences.sql`:**

```sql
CREATE TABLE user_preferences (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**3. Make sure the new table schema matches existing pattern**

**4. Don't use cascading and referencing directly in any table. If a column refers to another table, only leave a comment in .sql file**
