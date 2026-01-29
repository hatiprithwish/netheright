import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import * as Schemas from "../../schemas";
import gemini from "@/lib/gemini";
import { streamText, convertToModelMessages, UIMessage } from "ai";

class InterviewRepo {
  static async createInterviewSession(
    params: Schemas.CreateInterviewSessionRepoRequest,
  ) {
    return await InterviewDAL.createInterviewSession(params);
  }

  static async getSession(sessionId: string) {
    const session = await InterviewDAL.getSession(sessionId);
    if (!session) throw new Error("Session not found");
    return session;
  }

  static async advancePhase(sessionId: string, currentPhase: string) {
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

  static async endSession(sessionId: string) {
    return await InterviewDAL.endSession(sessionId);
  }

  static async getChatStream(params: Schemas.GetChatStreamRequest) {
    // Persist user message
    const lastMessage = params.messages[params.messages.length - 1];
    if (lastMessage.role === Schemas.ChatRoleLabelEnum.User) {
      await InterviewDAL.createMessageInAiChats({
        sessionId: params.sessionId,
        role: Schemas.ChatRoleIntEnum.User,
        content: lastMessage.parts[0].text,
        phase: Schemas.interviewPhaseLabelToInt[params.phaseLabel],
      });
    }

    const result = streamText({
      model: gemini("gemini-2.5-flash"),
      system: this.getSystemPrompt(params.phaseLabel),
      messages: await convertToModelMessages(params.messages as UIMessage[]),
    });

    return result.toUIMessageStreamResponse({
      onFinish: async ({ messages }) => {
        await InterviewDAL.createMessageInAiChats({
          sessionId: params.sessionId,
          role: Schemas.ChatRoleIntEnum.Assistant,
          content: messages[messages.length - 1].parts
            .map((p) => (p.type == "text" ? p.text : ""))
            .join(""),
          phase: Schemas.interviewPhaseLabelToInt[params.phaseLabel],
        });
      },
    });
  }

  static async analyzeDesign(sessionId: string, graph: SerializedGraph) {
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

  static async generateScorecard(sessionId: string) {
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
