# Netheright

> **Note:** This is a functional prototype built to explore how LLMs can provide real-time feedback on system architecture. It prioritizes the core feedback loop over a polished production UI.

## 🔗 Live URL

Experience the application live: [https://netheright.vercel.app](https://netheright.vercel.app)

## What it Does

Most system design prep is passive. **Netheright** is built to be a "Flight Simulator" where engineers can practice the **active** part of an interview—drawing and defending a design—without the pressure of a real interviewer.

Instead of a single open-ended prompt, it splits the interview session into three logical stages: **Requirements Gathering**, **Back-of-the-Envelope Calculations**, and **High-Level Design**.

- **Phase-Based Logic**: The AI strictly moves the user forward via tool calling (`transitionToPhase`). This prevents early hallucination and enforces active requirement gathering.
- **Diagram-to-Text Interpretation**: It seamlessly bridges a visual React Flow design into a parsed textual context, allowing the LLM to "see" and evaluate your architecture.
- **Automated Scorecards**: Evaluates trade-offs and scalability using strict structured outputs, persisting 1-5 rating assessments dynamically generated from the chat history.

## 🏗️ Architecture & Tech Stack

Netheright employs a highly modular **Three-Layer Architecture** (API Routes → Repositories → Data Access Layer) handling robust and predictable separation of concerns (SoC).

### 💻 Frontend (Client)

- **Framework:** Next.js (App Router) + React
- **Flow/Canvas:** React Flow (XYFlow) powers the dynamic, interactive drawing board.
- **State Management:** Zustand (for complex real-time canvas updates) & SWR (for data caching and fetching).
- **Styling/UI:** Tailwind CSS with Radix UI components, `class-variance-authority`, and `lucide-react` for customized, accessible components.

### ⚙️ Backend (Server)

- **Language:** TypeScript
- **AI/LLM:** Vercel AI SDK integrated directly with **Google Gemini (2.5 Flash)** for ultra-low-latency streaming interactions and phase-based tool calling.
- **Data Validation:** Zod specifically managing strict LLM structured outputs and request validation schemas.
- **Auth:** NextAuth.js (Auth.js)

### 🗄️ Database

- **ORM:** Drizzle ORM managing schema and migrations safely.
- **Database:** PostgreSQL via Neon Serverless Postgres. Table definitions strictly adhere to Drizzle modeling configurations (using native postgres configurations over manual parsing).
- **Caching / Rate Limiting:** Redis integration manages query responses and robust endpoint protections.

## 🚀 Local Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Configure your environment:**
   Create a `.env.local` containing keys such as:
   - `DATABASE_URL`
   - `AUTH_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `REDIS_HOST`, `REDIS_PASSWORD`
3. **Run the development server:**
   ```bash
   pnpm dev
   ```

## 📈 What's Next

- **RAG-Powered Hints**: Integrate LangChain with a vector database to index system design patterns and best practices. This will enable the AI to surface relevant, evidence-backed hints when candidates get stuck—grounded in real architectural literature rather than generic LLM knowledge.
