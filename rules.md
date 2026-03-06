Good example of Qnique constraint creation:
Make sure to use proper naming convention UK_table_name_first_column_name

```
export const features = pgTable(
  "features",
  {
    id: varchar("id", { length: 20 }).primaryKey(),
    description: varchar("description", { length: 255 }).notNull(),
    permBit: integer("perm_bit").notNull(),
    permBitIndex: integer("perm_bit_index").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("UK_features_perm_bit").on(table.permBit, table.permBitIndex),
  ],
);
```

Bad example of Qnique constraint creation:

```
(table) => ({
    uniquePerm: unique().on(table.permBit, table.permBitIndex),
  })
```

---

Always add enums along with the actual column type wherever applicable
Good example:

```
type: text("type").$type<AdapterAccountType>().notNull(),
```

Bad example:

```
type: text("type").notNull(),
```

---

Always use bigint for primary keys instead of bigserial
Good example:

```
id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
```

Bad example:

```
id: bigserial("id", { mode: "bigint" }).primaryKey(),
```

---

Never use `{ mode: "date" }` with timestamp columns
Good example:

```
createdAt: timestamp("created_at").notNull().defaultNow(),
updatedAt: timestamp("updated_at"),
```

Bad example:

```
createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
updatedAt: timestamp("updated_at", { mode: "date" })
```
