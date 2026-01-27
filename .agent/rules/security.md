---
trigger: model_decision
description: Security guidelines for API route development
---

# Security Guidelines

## Critical Security Rules

**🚨 NEVER commit code that bypasses these security requirements.**

### 1. Authentication & Authorization Middleware

**ALL API routes that handle user data MUST use appropriate middleware:**

```typescript
// ✅ CORRECT: Use withEmailAccount for email-scoped operations
export const GET = withEmailAccount(async (request, { params }) => {
  const { emailAccountId } = request.auth;
  // ...
});

// ✅ CORRECT: Use withAuth for user-scoped operations
export const GET = withAuth(async (request) => {
  const { userId } = request.auth;
  // ...
});

// ❌ WRONG: Direct access without authentication
export const GET = async (request) => {
  // This exposes data to unauthenticated users!
  const data = await prisma.user.findMany();
  return NextResponse.json(data);
};
```

### 2. Data Access Control

**ALL database queries MUST be scoped to the authenticated user/account:**

```typescript
// ✅ CORRECT: Always include user/account filtering
const schedule = await prisma.schedule.findUnique({
  where: { 
    id: scheduleId, 
    emailAccountId  // 🔒 Critical: Ensures user owns this resource
  },
});

// ✅ CORRECT: Filter by user ownership
const rules = await prisma.rule.findMany({
  where: { 
    emailAccountId,  // 🔒 Only user's rules
    enabled: true 
  },
});

// ❌ WRONG: Missing user/account filtering
const schedule = await prisma.schedule.findUnique({
  where: { id: scheduleId }, // 🚨 Any user can access any schedule!
});
```

### 3. Resource Ownership Validation

**Always validate that resources belong to the authenticated user:**

```typescript
// ✅ CORRECT: Validate ownership before operations
async function updateRule({ ruleId, emailAccountId, data }) {
  const rule = await prisma.rule.findUnique({
    where: { 
      id: ruleId, 
      emailAccount: { id: emailAccountId } // 🔒 Ownership check
    },
  });
  
  if (!rule) throw new SafeError("Rule not found"); // Returns 404, doesn't leak existence
  
  return prisma.rule.update({
    where: { id: ruleId },
    data,
  });
}

// ❌ WRONG: Direct updates without ownership validation
async function updateRule({ ruleId, data }) {
  return prisma.rule.update({
    where: { id: ruleId }, // 🚨 User can modify any rule!
    data,
  });
}
```

---

## Middleware Usage Guidelines

### When to use `withEmailAccount`

Use for operations that are scoped to a specific email account:
- Reading/writing emails, rules, schedules, etc.
- Any operation that uses `emailAccountId`

```typescript
export const GET = withEmailAccount(async (request) => {
  const { emailAccountId, userId, email } = request.auth;
  // All three fields available
});
```

### When to use `withAuth`

Use for user-level operations:
- User settings, API keys, referrals
- Operations that use only `userId`

```typescript
export const GET = withAuth(async (request) => {
  const { userId } = request.auth;
  // Only userId available
});
```

### When to use `withError` only

Use for public endpoints or custom authentication:
- Public webhooks (with separate validation)
- Endpoints with custom auth logic
- **Cron endpoints (MUST use `hasCronSecret`)**

```typescript
// ✅ CORRECT: Public endpoint with custom auth
export const GET = withError(async (request) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
});

// ✅ CORRECT: Cron endpoint with secret validation
export const POST = withError(async (request) => {
  if (!hasCronSecret(request)) {
    captureException(new Error("Unauthorized cron request"));
    return new Response("Unauthorized", { status: 401 });
  }
  // ... cron logic
});

// ❌ WRONG: Cron endpoint without validation
export const POST = withError(async (request) => {
  // 🚨 Anyone can trigger this cron job!
  await sendDigestEmails();
});
```

---

## Cron Endpoint Security

**🚨 CRITICAL: Cron endpoints without proper authentication can be triggered by anyone!**

### Cron Authentication Patterns

```typescript
// ✅ CORRECT: GET cron endpoint
export const GET = withError(async (request) => {
  if (!hasCronSecret(request)) {
    captureException(new Error("Unauthorized cron request"));
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Safe to execute cron logic
  await processScheduledTasks();
  return NextResponse.json({ success: true });
});

// ✅ CORRECT: POST cron endpoint
export const POST = withError(async (request) => {
  if (!(await hasPostCronSecret(request))) {
    captureException(new Error("Unauthorized cron request"));
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Safe to execute cron logic
  await processBulkOperations();
  return NextResponse.json({ success: true });
});
```

### Cron Security Checklist

For any endpoint that performs automated tasks:

- [ ] Uses `withError` middleware (not `withAuth` or `withEmailAccount`)
- [ ] Validates cron secret using `hasCronSecret(request)` or `hasPostCronSecret(request)`
- [ ] Captures unauthorized attempts with `captureException`
- [ ] Returns `401` status for unauthorized requests
- [ ] Contains bulk operations, scheduled tasks, or system maintenance

### Common Cron Endpoint Patterns

```typescript
// Digest/summary emails
export const POST = withError(async (request) => {
  if (!hasCronSecret(request)) {
    captureException(new Error("Unauthorized cron request: digest"));
    return new Response("Unauthorized", { status: 401 });
  }
  await sendDigestEmails();
});

// Cleanup operations
export const POST = withError(async (request) => {
  if (!(await hasPostCronSecret(request))) {
    captureException(new Error("Unauthorized cron request: cleanup"));
    return new Response("Unauthorized", { status: 401 });
  }
  await cleanupExpiredData();
});

// System monitoring
export const GET = withError(async (request) => {
  if (!hasCronSecret(request)) {
    captureException(new Error("Unauthorized cron request: monitor"));
    return new Response("Unauthorized", { status: 401 });
  }
  await monitorSystemHealth();
});
```

### Environment Setup

Ensure `CRON_SECRET` is properly configured:

```bash
# .env.local
CRON_SECRET=your-secure-random-secret-here
```

**⚠️ Never use predictable cron secrets like:**
- `"secret"`
- `"password"`
- `"cron"`
- Short or simple strings

---

## Database Security Patterns

### ✅ Secure Query Patterns

```typescript
// User-scoped queries
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true } // Only return needed fields
});

// Email account-scoped queries
const emailAccount = await prisma.emailAccount.findUnique({
  where: { id: emailAccountId, userId }, // Double validation
});

// Related resource queries with ownership
const rule = await prisma.rule.findUnique({
  where: { 
    id: ruleId, 
    emailAccount: { id: emailAccountId } 
  },
  include: { actions: true }
});

// Filtered list queries
const schedules = await prisma.schedule.findMany({
  where: { emailAccountId },
  orderBy: { createdAt: 'desc' }
});
```

### ❌ Insecure Query Patterns

```typescript
// Missing user scoping
const schedules = await prisma.schedule.findMany(); // 🚨 Returns ALL schedules

// Missing ownership validation
const rule = await prisma.rule.findUnique({
  where: { id: ruleId } // 🚨 Can access any user's rule
});

// Exposed sensitive fields
const user = await prisma.user.findUnique({
  where: { id: userId }
  // 🚨 Returns ALL fields including sensitive data
});

// Direct parameter usage
const userId = request.nextUrl.searchParams.get('userId');
const user = await prisma.user.findUnique({
  where: { id: userId } // 🚨 User can access any user by changing URL
});
```

---

## Input Validation & Sanitization

### Parameter Validation

```typescript
// ✅ CORRECT: Validate all inputs
export const GET = withEmailAccount(async (request, { params }) => {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json(
      { error: "Missing schedule ID" }, 
      { status: 400 }
    );
  }
  
  // Additional validation
  if (typeof id !== 'string' || id.length < 10) {
    return NextResponse.json(
      { error: "Invalid schedule ID format" }, 
      { status: 400 }
    );
  }
});

// ❌ WRONG: Using parameters without validation
export const GET = withEmailAccount(async (request, { params }) => {
  const { id } = await params;
  // 🚨 Direct usage without validation
  const schedule = await prisma.schedule.findUnique({ where: { id } });
});
```

### Body Validation with Zod

```typescript
// ✅ CORRECT: Always validate request bodies
const updateRuleSchema = z.object({
  name: z.string().min(1).max(100),
  enabled: z.boolean(),
  conditions: z.array(z.object({
    type: z.enum(['FROM', 'SUBJECT', 'BODY']),
    value: z.string().min(1)
  }))
});

export const PUT = withEmailAccount(async (request) => {
  const body = await request.json();
  const validatedData = updateRuleSchema.parse(body); // Throws on invalid data
  
  // Use validatedData, not body
});
```

---

## Error Handling Security

### Information Disclosure Prevention

```typescript
// ✅ CORRECT: Safe error responses
if (!rule) {
  throw new SafeError("Rule not found"); // Generic 404
}

if (!hasPermission) {
  throw new SafeError("Access denied"); // Generic 403
}

// ❌ WRONG: Information disclosure
if (!rule) {
  throw new Error(`Rule ${ruleId} does not exist for user ${userId}`); 
  // 🚨 Reveals internal IDs and logic
}

if (!rule.emailAccountId === emailAccountId) {
  throw new Error("This rule belongs to a different account");
  // 🚨 Confirms existence of rule and reveals ownership info
}
```

### Consistent Error Responses

```typescript
// ✅ CORRECT: Consistent error format
export const GET = withEmailAccount(async (request) => {
  try {
    // ... operation
  } catch (error) {
    if (error instanceof SafeError) {
      return NextResponse.json(
        { error: error.message, isKnownError: true },
        { status: error.statusCode || 400 }
      );
    }
    // Let middleware handle unexpected errors
    throw error;
  }
});
```

---

## Common Security Vulnerabilities

### 1. Insecure Direct Object References (IDOR)

```typescript
// ❌ VULNERABLE: User can access any rule by changing ID
export const GET = async (request, { params }) => {
  const { ruleId } = await params;
  const rule = await prisma.rule.findUnique({ where: { id: ruleId } });
  return NextResponse.json(rule);
};

// ✅ SECURE: Always validate ownership
export const GET = withEmailAccount(async (request, { params }) => {
  const { emailAccountId } = request.auth;
  const { ruleId } = await params;
  
  const rule = await prisma.rule.findUnique({
    where: { 
      id: ruleId, 
      emailAccount: { id: emailAccountId } // 🔒 Ownership validation
    }
  });
  
  if (!rule) throw new SafeError("Rule not found");
  return NextResponse.json(rule);
});
```

### 2. Mass Assignment

```typescript
// ❌ VULNERABLE: User can modify any field
export const PUT = withEmailAccount(async (request) => {
  const body = await request.json();
  const rule = await prisma.rule.update({
    where: { id: body.id },
    data: body // 🚨 User controls all fields, including ownership!
  });
});

// ✅ SECURE: Explicitly allow only safe fields
const updateSchema = z.object({
  name: z.string(),
  enabled: z.boolean(),
  // Only allow specific fields
});

export const PUT = withEmailAccount(async (request) => {
  const body = await request.json();
  const validatedData = updateSchema.parse(body);
  
  const rule = await prisma.rule.update({
    where: { 
      id: ruleId,
      emailAccount: { id: emailAccountId } // Maintain ownership
    },
    data: validatedData // Only validated fields
  });
});
```

### 3. Privilege Escalation

```typescript
// ❌ VULNERABLE: User can modify admin-only fields
const rule = await prisma.rule.update({
  