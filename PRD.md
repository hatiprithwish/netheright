To implement a structured, multi-phase interview agent in Next.js using the Vercel AI SDK, you need a **State-Driven Orchestration** architecture. Relying on a single prompt to "remember" five phases is risky; instead, you should treat the AI as a stateless worker managed by a stateful backend.

### 1. State Machine Architecture

You should not rely on the LLM to decide when a phase ends. Instead, use a **Phase Controller** in your Next.js API route to track the state in a database (like Supabase or Upstash Redis).

#### **The Backend Logic (Next.js Route Handler)**

When a message comes in:

1. **Fetch State:** Retrieve the current phase and "Red Flag" log from the DB.
2. **Select Prompt:** Load the specific system prompt for that phase.
3. **Analyze for Transition:** Use a lightweight "Evaluator" call (or the same LLM) to check if phase exit criteria are met.
4. **Append Context:** Send the relevant history to the LLM.

---

### 2. Structuring the System Prompts

You should use **Dynamic System Prompts**. Instead of one giant prompt, use a base template that changes based on the phase.

**Base Template:**

> "You are a Senior System Design Interviewer. Your current goal is [PHASE_GOAL]. Follow these constraints: [PHASE_CONSTRAINTS]. If the user exhibits [RED_FLAGS], silently log it by calling the `recordRedFlag` tool."

**Phase-Specific Injections:**

- **Phase 1 (Clarification):** "Be vague. If the user draws a database before asking about Read/Write ratio, call `recordRedFlag` with 'Jimmy Effect'."
- **Phase 4 (Deep Dive):** "Identify the weakest link in their previous answer. Drill down into implementation details. Do not let them use 'Magical Boxes'."

---

### 3. Red Flag Detection via Tool Calling

The most reliable way to track red flags for final scoring is through **AI SDK Tools**. This forces the model to categorize the behavior explicitly.

```typescript
const tools = {
  recordRedFlag: {
    description:
      "Call this when the candidate exhibits poor interviewing behavior.",
    parameters: z.object({
      type: z.enum(["Jimmy Effect", "Magical Box", "Keyword Stuffing"]),
      reason: z.string(),
    }),
    execute: async ({ type, reason }) => {
      await saveRedFlagToDb(interviewId, { type, reason });
      return { status: "logged" };
    },
  },
  transitionToPhase: {
    description: "Move the interview to the next phase.",
    parameters: z.object({ nextPhase: z.number() }),
    execute: async ({ nextPhase }) => {
      await updateInterviewPhase(interviewId, nextPhase);
      return { status: `Moved to phase ${nextPhase}` };
    },
  },
};
```

---

### 4. Scoring Mechanism: The "Post-Game" Analysis

For the final scoring, you have two options. Based on your need for accuracy, **Option B** is recommended:

- **Option A (Summary-based):** After each phase, the LLM generates a 2-sentence summary of performance. At the end, a final prompt evaluates these 5 summaries.
- **Option B (Full Transcript Analysis):** Once Phase 5 ends, trigger a background Cron job or an Edge Function that sends the **entire transcript + the database of Red Flags** to a high-reasoning model (like GPT-4o or Claude 3.5 Sonnet).

**Scoring Prompt Structure:**

> "Review this full transcript. Specifically look at the 'Red Flags' logged: [RED_FLAG_LIST]. Score the candidate 1-10 on: 1. Analytical Thinking, 2. Technical Depth, 3. Communication. Provide a breakdown of why they passed or failed."

---

### 5. Recommended Technical Stack

- **Framework:** Next.js (App Router).
- **AI SDK:** `vercel-ai-sdk` (utilizing `generateText` for evaluation and `streamText` for the chat).
- **Database:** **PostgreSQL (Prisma/Drizzle)** to store `messages`, `red_flags`, and `current_phase`.
- **State Management:** Use a `useChat` hook on the frontend, but intercept the `onFinish` callback to check if the backend has triggered a phase transition.

### Summary of Flow

1. **User sends message.**
2. **Next.js Route** identifies Phase (e.g., Phase 2).
3. **LLM** processes message using Phase 2 System Prompt.
4. **LLM** calls `recordRedFlag` if the user fails the math check.
5. **LLM** calls `transitionToPhase` when math is complete.
6. **Final Phase** triggers a "Final Report" generation using the stored DB data.
