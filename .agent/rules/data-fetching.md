---
trigger: model_decision
description: Fetching data from the API using SWR
---

# Data Fetching

All client-side data fetching uses SWR, defined in `frontend/api/cachedQueries.ts`. Each hook wraps `useSWR` and returns a clean, consistent interface.

## Rules

1. **Always define hooks in `cachedQueries.ts`** — never call `useSWR` directly in components.
2. **Use `fetcher` for GET requests** and **`apiClient.post` for POST-based queries** (e.g. filtered/paginated endpoints).
3. **Disable the hook when required data is missing** by passing `null` as the SWR key (e.g. when `userId` is not yet available, or the user is not authenticated).
4. **Alias `mutate` to a descriptive name** like `handleRefresh` in the return value.
5. **Derive `isLoading`** manually when using `apiClient.post`, since SWR's built-in `isLoading` does not account for disabled state.

## Pattern 1: Simple GET (authenticated resource optional)

```typescript
// ✅ GOOD: null key disables the hook when sessionId is absent
export const useInterviewSession = (sessionId: string | null) => {
  const { data, error, isLoading, mutate } =
    useSWR<Schemas.GetInterviewResponse>(
      sessionId ? `/api/interview/${sessionId}` : null,
      fetcher,
    );

  return {
    session: data?.interview ?? null,
    isLoading,
    isError: error,
    mutate,
  };
};
```

## Pattern 2: POST-based query (auth-gated, with body)

Use this pattern when the endpoint requires a request body (e.g. filters, pagination, sorting). Auth-gate by checking `currentUser` and computing `isLoading` manually.

```typescript
// ✅ GOOD: POST query with auth-gating and manual isLoading
export const useGetInterviewsByUser = (
  body: Schemas.GetInterviewsByUserRequest,
) => {
  const { currentUser } = useAuth();
  const isDisabled = !currentUser;
  const cachedKey = `/api/query/${currentUser?.id}/interviews`;

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.GetInterviewHistoryResponse>(
    isDisabled ? null : cachedKey,
    ([url]: [string]) =>
      apiClient.post<Schemas.GetInterviewHistoryResponse>(url, body),
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

| Field       | Convention                                                          |
| ----------- | ------------------------------------------------------------------- |
| `isLoading` | Use SWR's built-in for GET, derive manually for POST                |
| `error`     | Return raw SWR error, or `error?.message ?? null` for scalar        |
| `mutate`    | Alias to `handleRefresh` when exposed for external refresh          |
| Nested data | Flatten with `data?.field ?? defaultValue` (e.g. `[]`, `0`, `null`) |
