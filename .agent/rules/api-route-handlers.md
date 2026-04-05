---
trigger: model_decision
description: Guidelines for standardizing API Route Handlers
---

# API Route Handlers

This rule defines the standard patterns for creating API route handlers using `routeWrapper`, `checkAuth`, and `validateRequestSchema`. Handlers should be thin, strictly typed, and should rely on centralized Zod schemas for request validation.

There are three common patterns to follow depending on the input requirements: `params` only, `body` only, and `params` + `body`.

## 1. Public API Routes (No Authentication)

For unauthenticated, public-facing endpoints (e.g., fetching a list of static problems, public webhooks), bypass the `checkAuth` middleware but **still use `routeWrapper`** to ensure consistent error handling and logging. You can still use `validateRequestSchema` if the route accepts parameters or a body.

```typescript
// Good example - Public GET (No params/body validation)
import { NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import ProblemsRepo from "@/backend/repositories/ProblemsRepo";

const getHandler = async () => {
  const response = await ProblemsRepo.getProblems();
  return NextResponse.json(response, {
    status: response.isSuccess ? 200 : 500,
  });
};

export const GET = routeWrapper(getHandler);
```

```typescript
// Good example - Public POST (With body validation)
import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/pino";

const postHandler = async (
  _req: NextRequest,
  validatedBody: Schemas.PublicSubmissionRequest,
  _logger: Logger,
) => {
  const response = await SubmissionRepo.processPublicSubmission(validatedBody);
  return NextResponse.json(response, {
    status: response.isSuccess ? 201 : 400,
  });
};

export const POST = routeWrapper(
  validateRequestSchema(
    { body: Schemas.ZPublicSubmissionRequest },
    postHandler,
  ),
);
```

## 2. Parameters Only (e.g., GET or DELETE by ID)

For routes that only require URL parameters and no request body.

**Guidelines:**

- The second argument (`body`) of the handler must be explicitly typed as `undefined` or ignored with `_: any`.
- Define a `RouteContext` type to type and extract `params`.
- Pass only the `params` array to `validateRequestSchema`.

```typescript
// Good example
import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import type { Logger } from "@/lib/pino";

type RouteContext = { params: Promise<{ id: string }> };

const getHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
  context: RouteContext,
) => {
  const { id } = await context.params;
  const response = await InterviewRepo.getInterview({ id });
  return NextResponse.json(response, {
    status: response.isSuccess ? 200 : 404,
  });
};

export const GET = routeWrapper(
  checkAuth({}, validateRequestSchema({ params: ["id"] }, getHandler)),
);
```

## 3. Body Only (e.g., standard POST routes)

For routes that receive a JSON payload but do not require dynamic URL parameters.

**Guidelines:**

- The second argument (`validatedBody`) must be strictly typed using an inferred TypeScript type generated from your Zod schemas.
- The `context` argument can be optionally omitted if unused.
- Pass only the `body` schema to `validateRequestSchema`.

```typescript
// Good example
import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/pino";

const postHandler = async (
  _req: NextRequest,
  validatedBody: Schemas.CreateProblemRequest, // Strictly typed
  _logger: Logger,
) => {
  const response = await ProblemsRepo.createProblem(validatedBody);
  return NextResponse.json(response, {
    status: response.isSuccess ? 201 : 400,
  });
};

export const POST = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema({ body: Schemas.ZCreateProblemRequest }, postHandler),
  ),
);
```

## 4. Parameters + Body (e.g., PUT or PATCH)

For routes that need both a resource identifier from the URL and a JSON payload.

**Guidelines:**

- The handler should utilize both the typed `validatedBody` (second argument) and the `context` (fourth argument) array.
- Pass both the `params` array and the Zod `body` schema to `validateRequestSchema`.

```typescript
// Good example
import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/pino";

type RouteContext = { params: Promise<{ id: string }> };

const patchHandler = async (
  _req: NextRequest,
  validatedBody: Pick<Schemas.UpdateInterviewStatusApiRequest, "status">,
  _logger: Logger,
  context: RouteContext,
) => {
  const { id } = await context.params;
  const { status } = validatedBody;
  const response = await InterviewRepo.updateInterviewStatus({
    id,
    status,
  });
  return NextResponse.json(response, {
    status: response.isSuccess ? 200 : 400,
  });
};

export const PATCH = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema(
      {
        params: ["id"],
        body: Schemas.ZUpdateInterviewStatusApiRequest.pick({ status: true }),
      },
      patchHandler,
    ),
  ),
);
```

## 5. Standardized Response Handling & Status Codes

API routes should act as **thin controllers**. They should pass the request data directly to the Repository layer, and return the repository's response **directly** to the frontend without any transformation.

Always check the `isSuccess` flag of the repository response to dynamically assign the correct HTTP status code.

### Status Code Guide (The "Real World" Rule)

| Category         | Code    | Name                 | When to use it                                                                              |
| :--------------- | :------ | :------------------- | :------------------------------------------------------------------------------------------ |
| **Success**      | **200** | OK                   | Standard "it worked" for GET, PUT, or DELETE.                                               |
|                  | **201** | Created              | Use after a **POST** that successfully creates a new record.                                |
|                  | **202** | Accepted             | The request is valid, but the task is happening in the background (asynchronous).           |
|                  | **204** | No Content           | Success, but there's no data to return (common for DELETE).                                 |
| **Redirect**     | **304** | Not Modified         | The client's cached version is still valid. Saves bandwidth.                                |
| **Client Error** | **400** | Bad Request          | Structural error: Malformed JSON, missing headers, or syntax errors.                        |
|                  | **401** | Unauthorized         | **"I don't know who you are."** The user isn't logged in or the token is expired.           |
|                  | **403** | Forbidden            | **"I know who you are, but you aren't allowed here."** (e.g., User lacks the "Admin" role). |
|                  | **404** | Not Found            | The resource ID doesn't exist in the database.                                              |
|                  | **409** | Conflict             | Duplicate entry (e.g., trying to register an email that already exists).                    |
|                  | **422** | Unprocessable Entity | The JSON is valid, but the data is wrong.                                                   |
|                  | **429** | Too Many Requests    | The user hit their rate limit.                                                              |
| **Server Error** | **500** | Internal Error       | A generic "Oops" code. Your code crashed or an unhandled exception occurred.                |
|                  | **502** | Bad Gateway          | One of your microservices or your proxy (Nginx) is down.                                    |
|                  | **503** | Service Unavailable  | Server is overloaded or down for maintenance.                                               |
|                  | **504** | Gateway Timeout      | The backend took too long to respond to the proxy.                                          |

## Anti-Patterns

```typescript
// Bad example
const postHandler = async (req: NextRequest) => {
  // BAD: Parsing JSON directly without validateRequestSchema
  const body = await req.json();
  const { id } = req.nextUrl.searchParams;
  // ...
};

// Bad example
const patchHandler = async (
  _req: NextRequest,
  validatedBody: any, // BAD: Typing body as 'any'. Always type parameters.
  _logger: Logger,
  context: RouteContext,
) => {
  const { id } = await context.params;
};
```
