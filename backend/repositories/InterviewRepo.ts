import { google } from "@ai-sdk/google";
import { generateText, streamText, generateObject } from "ai";
import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import * as Schemas from "../../schemas";

class InterviewRepo {
  // Session Lifecycle
  static async createSession(userId: string, problemId: string) {
    // Check if there's an active session first? Maybe allow multiple.
    // implementing simple creation for now.
    return await InterviewDAL.createSession({ userId, problemId });
  }

  static async getSession(sessionId: bigint) {
    const session = await InterviewDAL.getSession(sessionId);
    if (!session) throw new Error("Session not found");
    return session;
  }

  static async advancePhase(sessionId: bigint, currentPhase: string) {
    // Logic to determine next phase
    const phases = [
      "requirements",
      "high_level_design",
      "deep_dive",
      "scorecard",
    ];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex === -1 || currentIndex === phases.length - 1) return null;

    const nextPhase = phases[currentIndex + 1] as any;
    return await InterviewDAL.updateSessionPhase(sessionId, nextPhase);
  }

  static async endSession(sessionId: bigint) {
    return await InterviewDAL.endSession(sessionId);
  }

  // AI Interactions
  static async chatStream(sessionId: bigint, messages: any[], phase: string) {
    // Persist user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      await InterviewDAL.addMessage({
        sessionId,
        role: Schemas.ChatRoleLabelEnum,
        content: lastMessage.content,
        phase: phase as any,
      });
    }

    // Determine system prompt based on phase
    const systemPrompt = this.getSystemPrompt(phase);

    const result = streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages,
      onFinish: async (event) => {
        // Persist assistant message
        await InterviewDAL.addMessage({
          sessionId,
          role: "assistant",
          content: event.text,
          phase: phase as any,
        });
      },
    });

    return result;
  }

  static async analyzeDesign(sessionId: bigint, graph: SerializedGraph) {
    const graphStr = graphToString(graph);

    const result = await generateText({
      model: google("gemini-1.5-flash"),
      system:
        "You are a Senior System Architect. Analyze the following system design topology for potential flaws, bottlenecks, or single points of failure. Be critical but constructive.",
      prompt: `Analyze this system design:\n${graphStr}`,
    });

    // We could store this as a system message or separate critique record
    // For now, returning text
    return result.text;
  }

  static async generateScorecard(sessionId: bigint) {
    // Fetch all messages and diagrams to analyze
    const messages = await InterviewDAL.getSessionMessages(sessionId);
    // simplified context construction
    const conversation = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: ScorecardSchema,
      system:
        "You are an expert interviewer grading a System Design Interview.",
      prompt: `Review the following interview transcript and generate a scorecard based on Requirements Gathering, Data Modeling, Trade-off Analysis, and Scalability.\n\nTranscript:\n${conversation}`,
    });

    await InterviewDAL.createScorecard({
      sessionId,
      overallGrade: object.overallGrade,
      requirementsGathering: object.categories.requirementsGathering,
      dataModeling: object.categories.dataModeling,
      tradeOffAnalysis: object.categories.tradeOffAnalysis,
      scalability: object.categories.scalability,
      strengths: object.strengths,
      growthAreas: object.growthAreas,
      actionableFeedback: object.actionableFeedback,
    });

    return object;
  }

  static getSystemPrompt(phase: string): string {
    switch (phase) {
      case "requirements":
        return "You are a System Design Interviewer. Phase 1: Requirements Gathering. Help the candidate clarify functional and non-functional requirements for a food delivery app. Do not solve the problem for them. Ask clarifying questions.";
      case "high_level_design":
        return "You are a System Design Interviewer. Phase 2: High Level Design. The candidate is drawing a diagram. Critique their choices, ask about trade-offs, DB choices, APi design.";
      // ... others
      default:
        return "You are a System Design Interviewer.";
    }
  }
}

export default InterviewRepo;
