---
trigger: manual
---

## ROLE
You are an Elite Full-Stack Engineer and System Architect. Your goal is to build the "System Design Tutor," an AI-powered "Senior Architect" that conducts rigorous, interactive mock interviews.

## OBJECTIVE
Implement the `/sdi/[problemId]` single-page application (SPA) experience. You will guide users through 4 locked phases: Scope, High-Level Design, Deep Dives, and Scorecard.

## TECH STACK & ARCHITECTURE
- **Framework**: Next.js 14+ (App Router).
- **AI Engine**: Google Gemini 1.5 Flash via Vercel AI SDK.
- **Diagramming**: React Flow for canvas-based architecture.
- **Database**: PostgreSQL with Drizzle ORM.
- **Auth**: NextAuth v5 (Stateless JWT Sessions).

## NORMALIZED DATABASE SCHEMA (Drizzle)
Implement a relational structure to ensure data integrity and facilitate future analytics:
1.  **sdi_sessions Table**: Tracks session metadata (userId, problemId, status, currentPhase).
2.  **messages Table**: Stores chat transcripts with phase tagging (role, content, phase).
3.  **diagrams Table**: Stores architecture snapshots. Includes `topology` (clean JSON for AI) and `raw_react_flow` (UI state).
4.  **scorecards Table**: Stores final performance metrics linked to the session (overallGrade, category scores, feedback).

## THE 4-PHASE INTERVIEW FLOW

### Phase 1: Scope & Capacity Planning
- **Interface**: Chat Only.
- **AI Persona**: "The Pragmatic PM."
- **Goal**: User defines Functional & Non-Functional requirements.
- **SDK Tool**: `streamText`.
- **Gate**: AI must explicitly validate that requirements are sufficient before unlocking Phase 2.

### Phase 2: High-Level Design (The Defense)
- **Interface**: Split Screen (Chat Left | Canvas Right).
- **Interaction**: User builds a graph; clicks "Analyze Design."
- **Logic**: Implement `serializeGraph()` to strip UI metadata (x, y coords). Send only clean topology (Node types + connections) to Gemini.
- **AI Persona**: "The Skeptical Architect."
- **SDK Tool**: `generateObject` for structured critique. AI identifies one critical flaw and enters "Defense Mode."

### Phase 3: Deep Dives
- **Interface**: Chat + Canvas Highlight.
- **AI Persona**: "The Staff Engineer."
- **Interaction**: AI picks 2 specific scenarios (e.g., Geo-Spatial Indexing).
- **SDK Tool**: `streamText` + `tools`. Implement `updateCanvas` tool to suggest/highlight components.

### Phase 4: The Scorecard
- **Interface**: Dashboard View.
- **Action**: User ends session. Trigger background analysis of the full transcript and diagram history.
- **Persistence**: Save all session data to the normalized tables via a Server Action.
- **SDK Tool**: `generateObject` to produce the final report.

## REQUIRED ZOD SCHEMAS

### 1. Critique Schema (Phase 2)
```typescript
const CritiqueSchema = z.object({
  criticalFlaw: z.string(),
  affectedNodes: z.array(z.string()),
  severity: z.enum(['low', 'medium', 'high']),
  defenseQuestion: z.string()
});

### 2. Scorecard Schema (Phase 4)
```typescript
const ScorecardSchema = z.object({
  categories: z.object({
    requirementsGathering: z.number().min(0).max(100),
    dataModeling: z.number().min(0).max(100),
    tradeOffAnalysis: z.number().min(0).max(100),
    scalability: z.number().min(0).max(100)
  }),
  strengths: z.array(z.string()),
  growthAreas: z.array(z.string()),
  actionableFeedback: z.string(),
  overallGrade: z.enum(['S', 'A', 'B', 'C', 'F'])
});
```
## CRITICAL RULES

1. Mobile Support: None. Show a "Please use Desktop" banner for screen widths < 1024px.

2. Persistence Strategy: Do NOT read/write chat history from the DB during the chat. Use the Vercel AI SDK useChat history. Write to DB ONLY at the end of the session.

3. Middleware: Create a reusable function to check for session permissions and perform Zod validation for protected routes.

4. Scope Creep: Do not implement "User Settings," "Dark Mode," or "Social Sharing." Focus entirely on the functional interview loop.

## INSTRUCTIONS FOR AGENT
1. Phase Analysis: Start by creating a detailed Implementation Plan that sequences the React Flow canvas engine first.

2. Utility Development: Define the serializeGraph utility before building the API routes to ensure the AI receives clean data.

2. Registry Pattern: Implement a Registry Pattern to handle different System Prompts and Zod schemas as the user moves between phases.

4. Confirmation: Present the plan for approval before executing code.