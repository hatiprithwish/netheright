import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import * as Schemas from "../../schemas";
import gemini from "@/lib/gemini";
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  generateText,
  stepCountIs,
  Output,
  tool,
} from "ai";
import { google } from "@ai-sdk/google";
import Constants from "@/constants";
import type { Logger } from "@/lib/logger";

class InterviewRepo {
  static async getChatStream(
    params: Schemas.GetChatStreamRequest,
    logger: Logger,
  ) {
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

    const systemPrompt = this.getSystemPrompt(params.phaseLabel);
    const modelMessages = await convertToModelMessages(
      params.messages as UIMessage[],
    );

    logger.debug(
      {
        systemPrompt,
        messages: modelMessages,
      },
      "Gemini request details",
    );

    const result = streamText({
      model: gemini("gemini-2.5-flash"),
      system: systemPrompt,
      messages: modelMessages,
      // maxSteps: 5,
      // experimental_continueSteps: true,
      // experimental_toolCallStreaming: true,
      tools: {
        // recordRedFlag: {
        //   description:
        //     "Call this when candidate exhibits poor behavior (jumping to solution, vague abstractions).",
        //   inputSchema: Schemas.ZRecordRedFlagParams,
        //   execute: async ({ type, reason }) => {
        //     await InterviewDAL.createRedFlag({
        //       sessionId: params.sessionId,
        //       type,
        //       reason,
        //       phase: Schemas.interviewPhaseLabelToInt[params.phaseLabel],
        //     });
        //     console.log(`Red Flag: ${reason}`);
        //     return "Flag recorded. Continue the interview naturally.";
        //   },
        // },
        transitionToPhase: tool({
          description:
            "Call this when the current phase is complete to move to the next phase.",
          inputSchema: Schemas.ZTransitionToPhaseParams,
          execute: async ({ nextPhase }) => {
            await InterviewDAL.updateSessionPhase(
              params.sessionId,
              Schemas.interviewPhaseLabelToInt[nextPhase],
            );
            console.log(`Transitioning to phase: ${nextPhase}`);

            return {
              status: "transition_complete",
              newPhase: Schemas.interviewPhaseLabelToInt[nextPhase],
            };
          },
        }),
      },
    });

    logger.info("Gemini stream initiated successfully");

    return result.toUIMessageStreamResponse({
      onFinish: async ({ messages }) => {
        const assistantMessage = messages[messages.length - 1];
        const content = assistantMessage.parts
          .map((p) => (p.type == "text" ? p.text : ""))
          .join("");

        logger.debug(
          {
            content,
            parts: assistantMessage.parts,
          },
          "Full Gemini response",
        );

        await InterviewDAL.createMessageInAiChats({
          sessionId: params.sessionId,
          role: Schemas.ChatRoleIntEnum.Assistant,
          content,
          phase: Schemas.interviewPhaseLabelToInt[params.phaseLabel],
        });

        logger.debug("Persisted assistant message to database");
      },
    });
  }

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
      "requirements_gathering",
      "bote_calculation",
      "high_level_design",
      "component_deep_dive",
      "bottlenecks_discussion",
    ];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex === -1 || currentIndex === phases.length - 1) return null;

    const nextPhase = phases[currentIndex + 1] as any;
    return await InterviewDAL.updateSessionPhase(sessionId, nextPhase);
  }

  static async endSession(sessionId: string) {
    return await InterviewDAL.endSession(sessionId);
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

    const { output } = await generateText({
      model: google("gemini-1.5-flash"),
      output: Output.object({
        schema: Schemas.ZScorecardSchema,
      }),
      system:
        "You are an expert interviewer grading a System Design Interview.",
      prompt: `Review the following interview transcript and generate a scorecard based on Requirements Gathering, Data Modeling, Trade-off Analysis, and Scalability.\n\nTranscript:\n${conversation}`,
    });

    await InterviewDAL.createScorecard({
      sessionId,
      overallGrade: output.overallGrade,
      requirementsGathering: output.categories.requirementsGathering,
      dataModeling: output.categories.dataModeling,
      tradeOffAnalysis: output.categories.tradeOffAnalysis,
      scalability: output.categories.scalability,
      strengths: output.strengths,
      growthAreas: output.growthAreas,
      actionableFeedback: output.actionableFeedback,
    });

    return output;
  }

  static getSystemPrompt(phase: string): string {
    switch (phase) {
      case Schemas.InterviewPhaseLabelEnum.RequirementsGathering:
        return Constants.SYSTEM_PROMPTS.REQUIREMENTS_GATHERING;
      case Schemas.InterviewPhaseLabelEnum.BotECalculation:
        return Constants.SYSTEM_PROMPTS.BOTE_CALCULATION;
      case Schemas.InterviewPhaseLabelEnum.HighLevelDesign:
        return Constants.SYSTEM_PROMPTS.HIGH_LEVEL_DESIGN;
      case Schemas.InterviewPhaseLabelEnum.ComponentDeepDive:
        return Constants.SYSTEM_PROMPTS.COMPONENT_DEEP_DIVE;
      case Schemas.InterviewPhaseLabelEnum.BottlenecksDiscussion:
        return Constants.SYSTEM_PROMPTS.BOTTLENECKS_DISCUSSION;
      default:
        return "You are a System Design Interviewer.";
    }
  }
}

export default InterviewRepo;
