---
trigger: model_decision
description: Fetching data from the API using SWR
---

# Data Fetching

All client-side data fetching uses SWR, defined in `frontend/api/cachedQueries.ts`. Each hook wraps `useSWR` and returns a clean, consistent interface.

## Rules

1. **Always define hooks in `cachedQueries.ts`** — never call `useSWR` directly in components.
2. **Use `fetcher` for GET requests** and **`apiClient.post` for POST-based queries** (e.g. filtered/paginated endpoints).
3. **Calculate `isDisabled`** based on the required parameters (e.g., `!sessionId`, `!currentUser`, or `false` if always enabled).
4. **Define `cachedKey`** conditionally: `!isDisabled ? '/api/path' : null`. For POST queries with a body, use an array: `!isDisabled ? ['/api/path', body] : null`.
5. **Alias `mutate` to a descriptive name** like `handleRefresh` when returning from the hook.
6. **Derive `isLoading`** manually for ALL hooks (both GET and POST) using `!isDisabled && !error && !data`.

## Pattern 1: Simple GET (e.g. by ID)

```typescript
// ✅ GOOD: Conditionally disable the hook and manually derive isLoading
export const useInterviewSession = (sessionId: string | null) => {
  const isDisabled = !sessionId;
  const cachedKey = !isDisabled ? `/api/interview/${sessionId}` : null;

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.GetInterviewResponse>(cachedKey, fetcher);

  return {
    data,
    error,
    isLoading: !isDisabled && !error && !data,
    handleRefresh,
  };
};
```

## Pattern 2: POST-based query (auth-gated, with body)

Use this pattern when the endpoint requires a request body (e.g. filters, pagination, sorting).

```typescript
// ✅ GOOD: POST query with body in cachedKey and specific fetcher function
export const useGetInterviewsByUser = (
  body: Schemas.GetInterviewsByUserRequest,
) => {
  const { currentUser } = useAuth();
  const isDisabled = !currentUser;
  const cachedKey = !isDisabled
    ? [`/api/query/${currentUser?.id}/interviews`, body]
    : null;

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.GetInterviewHistoryResponse>(
    cachedKey,
    ([url, reqBody]: [string, Schemas.GetInterviewsByUserRequest]) =>
      apiClient.post<Schemas.GetInterviewHistoryResponse>(url, reqBody),
  );

  return {
    data,
    error,
    isLoading: !isDisabled && !error && !data,
    handleRefresh,
  };
};
```

```typescript
// ❌ BAD: calling useSWR directly in a component
export default function Dashboard() {
  const { data } = useSWR("/api/query/123/interviews", fetcher);
}
```

## Return Value Conventions

| Field           | Convention                                            |
| --------------- | ----------------------------------------------------- |
| `data`          | Return the raw data object or strongly typed response |
| `error`         | Return raw SWR error                                  |
| `isLoading`     | Derive manually: `!isDisabled && !error && !data`     |
| `handleRefresh` | Alias of `mutate`                                     |
