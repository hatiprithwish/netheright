The application is a **single-page application (SPA) experience** that guides the user through 4 locked phases.

### **Phase 1: Scope & Capacity Planning**

- **Interface:** Chat Only.
- **Goal:** User defines Functional & Non-Functional Requirements.
- **Interaction:**
    - User types requirements (e.g., "Users can order food").
    - AI (acting as PM) pushes back on missing edge cases (e.g., "What about driver tracking?").
    - **Gate:** AI explicitly validates requirements are sufficient before unlocking Phase 2.

### **Phase 2: High-Level Design (The "Architect's Defense")**

- **Interface:** Split Screen (Chat Left | Canvas Right).
- **Goal:** Draw the core architecture and defend trade-offs.
- **Interaction:**
    - **The Canvas:** User drags nodes (Service, SQL DB, NoSQL DB, Queue, LB) to build the graph.
    - **The Trigger:** User clicks "Analyze Design."
    - **The Critique:** AI analyzes the **Graph JSON** (not image). It identifies **1 critical flaw** (e.g., "Why SQL for high-velocity logs?") and enters "Defense Mode."
    - **Success:** User justifies the choice or corrects the diagram.

### **Phase 3: Deep Dives**

- **Interface:** Chat + Canvas Highlight.
- **Goal:** Solve specific SDE II complexity problems.
- **Interaction:**
    - AI picks 2 specific scenarios based on the "Food Delivery" config (e.g., *Geo-Spatial Indexing* or *Order State Machine*).
    - User explains the algorithm or updates the diagram to show specific components (e.g., adding a QuadTree Service).

### **Phase 4: The Scorecard**

- **Interface:** Dashboard View.
- **Goal:** Feedback and Growth Tracking.
- **Interaction:**
    - Session ends.
    - System saves the **Transcript**, **Final Diagram**, and **Scores** to the Database.
    - User sees a graded report (Requirements, Data Modeling, Trade-offs) with actionable feedback.

# Vercel AI SDK
To build your multi-phase system design tutor application in Next.js, you can combine several powerful tools from the Vercel AI SDK. Here is a recommended combination of tools for each phase of your use case:

### 1. Phase-Based State Management (`useChat`)

The **`useChat`** hook is the ideal foundation for your single-page application (SPA) experience. It manages the conversational state, streams responses, and handles message history automatically.

* **Locked Phases**: You can control the progression by maintaining a "phase" state in your Next.js component. The UI can conditionally render different interfaces (Chat Only vs. Split Screen) based on this state.


* 
**Gatekeeping**: Use the `onFinish` callback in `useChat` to have the AI evaluate if the requirements are sufficient before updating the phase state to unlock Phase 2.



### 2. Validating Requirements & Graph Analysis (`generateObject`)

For both the gatekeeping in Phase 1 and the "Architect's Defense" in Phase 2, you need structured analysis rather than just plain text.

* 
**`generateObject`**: This tool allows you to constrain the AI's output to a specific **Zod schema**.


* 
**Phase 1 Gate**: Use it to check a "ready" boolean and list missing requirements.


* 
**Phase 2 Critique**: Pass the Canvas Graph JSON to `generateObject` with a schema that requires the AI to identify exactly one critical flaw.





### 3. "Defense Mode" & Deep Dives (`stopWhen` & `tool`)

To create an interactive agent that can pick scenarios or push back on trade-offs, use **Tool Calling**.

* 
**`tool`**: Define tools like `analyzeDesign` or `pickDeepDiveScenario` that the model can call to interact with your application's logic or database.


* 
**`stopWhen` with `stepCountIs**`: This feature enables **multi-step agentic flows**. It allows the model to call a tool, receive the results (like your "Defense Mode" critique), and immediately generate a follow-up response without user intervention.



### 4. Interactive UI & Canvas Integration (`useChat` parts)

* 
**Canvas Synchronization**: Use the **`parts`** array within `useChat` to detect tool calls in real-time. When the model calls a tool to "Highlight" a canvas component in Phase 3, your frontend can react to that specific message part to trigger animations or visual changes on the right side of the split screen.



### 5. Final Scorecard (`generateObject`)

At the end of the session (Phase 4), use `generateObject` one last time to process the entire `messages` transcript and the final `graphJSON`. You can define a detailed schema for the "graded report" including numeric scores and an array of actionable feedback strings.

### Summary of Tool Combinations

| Requirement | Vercel AI SDK Tool |
| --- | --- |
| Core Chat & Streaming | <br>`useChat` 

 |
| Structured Logic (Grades, Validation) | <br>`generateObject` 

 |
| Agentic Behavior (Picking scenarios) | <br>`tool` + `stopWhen` 

 |
| Multi-Modal/UI Interaction | <br>`parts` array in `useChat` 

 |