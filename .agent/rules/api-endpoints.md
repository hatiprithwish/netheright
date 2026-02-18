---
trigger: manual
---

description: RESTful API endpoint naming conventions and patterns

# API Endpoint Patterns

This rule defines the standard RESTful API endpoint patterns to be used throughout the application.

## Naming Convention

**ALWAYS** follow these RESTful patterns for API endpoints:

### Collection vs Single Resource

- **Plural for collections**: Use plural nouns when dealing with multiple resources
- **Singular for single resource operations**: Use singular nouns for operations on a single resource

### Standard Patterns

```
GET    /interviews        - List all interviews (collection)
GET    /interview         - Get a single interview (requires query params or session context)
POST   /interview         - Create a new interview
DELETE /interview/:id     - Delete a specific interview
PUT    /interview/:id     - Update (replace) a specific interview
PATCH  /interview/:id     - Partially update a specific interview
```

## Implementation Guidelines

### 1. Route File Structure

```typescript
// ✅ GOOD: app/api/interviews/route.ts
export async function GET(req: Request) {
  // List all interviews
}

// ✅ GOOD: app/api/interview/route.ts
export async function GET(req: Request) {
  // Get single interview
}

export async function POST(req: Request) {
  // Create interview
}

// ✅ GOOD: app/api/interview/[id]/route.ts
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  // Get interview by ID
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  // Delete interview by ID
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  // Replace interview by ID
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  // Partially update interview by ID
}

// ❌ BAD: Mixing patterns
// app/api/interview/list/route.ts - Don't use action verbs in URLs
// app/api/interview/delete/[id]/route.ts - Don't use action verbs
```

### 2. HTTP Method Usage

**GET** - Retrieve resource(s)

```typescript
// ✅ GOOD: Idempotent, no side effects
export async function GET(req: Request) {
  const interviews = await InterviewRepo.listInterviews();
  return Response.json(interviews);
}

// ❌ BAD: Using GET for mutations
export async function GET(req: Request) {
  await InterviewRepo.deleteInterview(id); // Don't mutate on GET
  return Response.json({ success: true });
}
```

**POST** - Create new resource

```typescript
// ✅ GOOD: Create without ID in URL
export async function POST(req: Request) {
  const data = await req.json();
  const interview = await InterviewRepo.createInterview(data);
  return Response.json(interview, { status: 201 });
}

// ❌ BAD: Using POST for updates
export async function POST(req: Request) {
  const { id, ...data } = await req.json();
  await InterviewRepo.updateInterview(id, data); // Use PUT/PATCH instead
}
```

**PUT** - Replace entire resource

```typescript
// ✅ GOOD: Full replacement with ID in URL
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const data = await req.json();
  const interview = await InterviewRepo.replaceInterview(params.id, data);
  return Response.json(interview);
}
```

**PATCH** - Partial update

```typescript
// ✅ GOOD: Partial update with ID in URL
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const updates = await req.json();
  const interview = await InterviewRepo.updateInterview(params.id, updates);
  return Response.json(interview);
}
```

**DELETE** - Remove resource

```typescript
// ✅ GOOD: Delete with ID in URL
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  await InterviewRepo.deleteInterview(params.id);
  return Response.json({ success: true }, { status: 204 });
}
```

### 3. Nested Resources

For nested resources, follow the same pattern:

```
GET    /interview/:id/scorecards        - List scorecards for an interview
GET    /interview/:id/scorecard         - Get single scorecard for an interview
POST   /interview/:id/scorecard         - Create scorecard for an interview
DELETE /interview/:id/scorecard/:sid    - Delete specific scorecard
PATCH  /interview/:id/scorecard/:sid    - Update specific scorecard
```

### 4. Query Parameters

Use query parameters for filtering, sorting, and pagination on collection endpoints:

```typescript
// ✅ GOOD: app/api/interviews/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  const interviews = await InterviewRepo.listInterviews({
    status,
    limit: limit ? parseInt(limit) : 10,
    offset: offset ? parseInt(offset) : 0,
  });

  return Response.json(interviews);
}

// Usage: GET /interviews?status=completed&limit=20&offset=0
```

### 5. Response Status Codes

**ALWAYS** use appropriate HTTP status codes:

```typescript
// ✅ GOOD: Proper status codes
export async function POST(req: Request) {
  const data = await req.json();
  const interview = await InterviewRepo.createInterview(data);
  return Response.json(interview, { status: 201 }); // Created
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  await InterviewRepo.deleteInterview(params.id);
  return new Response(null, { status: 204 }); // No Content
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const interview = await InterviewRepo.getInterview(params.id);
  if (!interview) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(interview); // 200 OK (default)
}

// ❌ BAD: Always returning 200
export async function POST(req: Request) {
  const data = await req.json();
  const interview = await InterviewRepo.createInterview(data);
  return Response.json(interview); // Should be 201
}
```

## Common Status Codes

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource conflict (e.g., duplicate)
- `500 Internal Server Error` - Server error

## Anti-Patterns to Avoid

```typescript
// ❌ BAD: Action verbs in URLs
GET /interview/getById/:id
POST /interview/create
DELETE /interview/remove/:id

// ✅ GOOD: Use HTTP methods
GET /interview/:id
POST /interview
DELETE /interview/:id

// ❌ BAD: Inconsistent naming
GET /interviews
POST /interview
GET /interview-list

// ✅ GOOD: Consistent naming
GET /interviews        // Collection
GET /interview         // Single (with context)
POST /interview        // Create
GET /interview/:id     // Single by ID

// ❌ BAD: Using POST for everything
POST /interview/get
POST /interview/delete
POST /interview/update

// ✅ GOOD: Use appropriate HTTP methods
GET /interview/:id
DELETE /interview/:id
PATCH /interview/:id
```

## Summary

1. **Use plural for collections**: `/interviews`
2. **Use singular for single resources**: `/interview` or `/interview/:id`
3. **Use HTTP methods correctly**: GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove)
4. **No action verbs in URLs**: Use HTTP methods instead
5. **Use appropriate status codes**: 200, 201, 204, 404, etc.
6. **Use query parameters for filtering**: `/interviews?status=active`
7. **Keep URLs clean and predictable**: Follow RESTful conventions
