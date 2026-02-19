# Netheright (Prototype)

> **Note:** This is a functional prototype built to explore how LLMs can provide real-time feedback on system architecture. It prioritizes the core feedback loop over a polished production UI.

## 🧠 The Goal

Most system design prep is passive. I built this to be a "Flight Simulator" where engineers can practice the **active** part of an interview—drawing and defending a design—without the pressure of a real interviewer.

## 🏗️ How it Works

### 1. Phase-Based Interview Logic

Instead of a single open-ended prompt, I split the session into three stages: **Requirements Gathering**, **Back-of-the-Envelop Calculations**, and **High-Level Design**.

* The AI uses a custom tool (`transitionToPhase`) to move the user forward.
* **Why?** This prevents the AI from "hallucinating" a solution too early and forces the user to actually gather requirements first.

### 2. Diagram-to-Text Bridge

Since LLMs can't natively "see" a React Flow canvas, I wrote a serialization helper.

* It takes the canvas state (nodes and edges) and converts it into a structured string (e.g., `User -> [Load Balancer] -> [API Server]`).
* This string is injected into the prompt context, allowing the AI to "critique" what the user is actually drawing.

### 3. Automated Feedback (The Scorecard)

When the session ends, the app triggers a final LLM pass using a strict **Zod schema**.

* It analyzes the chat history to generate a structured JSON object.
* This produces a scorecard with 1–5 ratings on trade-offs and scalability, which is then saved to Postgres (NeonDB).

## 🛠️ Tech Stack & Trade-offs

* **Gemini 2.5 Flash:** Chosen for speed. In a "gamified" prep tool, low-latency feedback is more important than the deep reasoning of a larger model.
* **React Flow + Zustand:** Handles the drawing logic. I used Zustand for state management to keep the canvas responsive during complex updates.
* **Vercel AI SDK:** Streamlines the streaming chat and tool-calling implementation.

## 🧪 Current Limitations (Prototype Reality)

* **Stateless Canvas:** If the page refreshes, the diagram resets, though the AI retains the history in the database.
* **Simple Components:** Currently uses generic nodes; I’m planning to add specific cloud icons (S3, Kafka, etc.) in a future iteration.

## 📈 What's Next 
* **RAG-Powered Hints**: Integrate LangChain with a vector database to index system design patterns and best practices, enabling the AI to surface relevant, evidence-backed hints when a candidate gets stuck — grounded in real architectural literature rather than generic LLM knowledge.

## 🚀 Setup

1. `pnpm install`
2. Create `.env.local` with `DATABASE_URL`, `AUTH_SECRET`, and `GOOGLE_GENERATIVE_AI_API_KEY`.
3. `pnpm dev`
