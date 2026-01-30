import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import * as Schemas from "../../schemas";
import gemini from "@/lib/gemini";
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  generateText,
  generateObject,
  stepCountIs,
} from "ai";
import { google } from "@ai-sdk/google";
import Constants from "@/constants";
import type { Logger } from "@/lib/logger";

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

  static async getChatStream(
    params: Schemas.GetChatStreamRequest,
    logger: Logger,
  ) {
    // Log the incoming payload from frontend
    logger.info(
      {
        sessionId: params.sessionId,
        phaseLabel: params.phaseLabel,
        messageCount: params.messages.length,
        lastMessageRole: params.messages[params.messages.length - 1]?.role,
        lastMessagePreview: params.messages[
          params.messages.length - 1
        ]?.parts[0]?.text?.substring(0, 100),
      },
      "Received chat stream request from frontend",
    );

    // Persist user message
    const lastMessage = params.messages[params.messages.length - 1];
    if (lastMessage.role === Schemas.ChatRoleLabelEnum.User) {
      await InterviewDAL.createMessageInAiChats({
        sessionId: params.sessionId,
        role: Schemas.ChatRoleIntEnum.User,
        content: lastMessage.parts[0].text,
        phase: Schemas.interviewPhaseLabelToInt[params.phaseLabel],
      });
      logger.debug("Persisted user message to database");
    }

    const systemPrompt = this.getSystemPrompt(params.phaseLabel);
    const modelMessages = await convertToModelMessages(
      params.messages as UIMessage[],
    );

    // Log payload being sent to Gemini
    logger.info(
      {
        model: "gemini-2.5-flash",
        systemPromptLength: systemPrompt.length,
        messageCount: modelMessages.length,
        toolsAvailable: ["recordRedFlag", "transitionToPhase"],
      },
      "Sending request to Gemini",
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
      // @ts-expect-error
      maxSteps: 5,
      stopWhen: stepCountIs(5),
      tools: {
        recordRedFlag: {
          description:
            "Call this when the candidate exhibits poor interviewing behavior such as jumping to solutions without clarifying requirements, using vague abstractions, or keyword stuffing.",
          inputSchema: Schemas.ZRecordRedFlagParams,
          execute: async ({ type, reason }) => {
            logger.info({ type, reason }, "Tool call: recordRedFlag");
            await InterviewDAL.createRedFlag({
              sessionId: params.sessionId,
              type,
              reason,
              phase: Schemas.interviewPhaseLabelToInt[params.phaseLabel],
            });
            logger.debug("Red flag recorded successfully");
            return { status: "logged" };
          },
        },
        transitionToPhase: {
          description:
            "Move the interview to the next phase when the current phase objectives are complete.",
          inputSchema: Schemas.ZTransitionToPhaseParams,
          execute: async ({ nextPhase }) => {
            logger.info(
              {
                currentPhase: params.phaseLabel,
                nextPhase,
              },
              "Tool call: transitionToPhase",
            );
            const phaseNumber = parseInt(
              nextPhase,
              10,
            ) as Schemas.InterviewPhaseIntEnum;
            await InterviewDAL.updateSessionPhase(
              params.sessionId,
              phaseNumber,
            );
            logger.debug("Phase transition completed successfully");
            return { status: `Moved to phase ${phaseNumber}` };
          },
        },
      },
    });

    logger.info("Gemini stream initiated successfully");

    return result.toUIMessageStreamResponse({
      onFinish: async ({ messages }) => {
        const assistantMessage = messages[messages.length - 1];
        const content = assistantMessage.parts
          .map((p) => (p.type == "text" ? p.text : ""))
          .join("");

        logger.info(
          {
            messageLength: content.length,
            contentPreview: content.substring(0, 100),
            partsCount: assistantMessage.parts.length,
          },
          "Received complete response from Gemini",
        );

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
      schema: Schemas.ZScorecardSchema,
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
      case Schemas.InterviewPhaseLabelEnum.RequirementsGathering:
        return Constants.SYSTEM_PROMPTS.REQUIREMENTS_GATHERING;
      case Schemas.InterviewPhaseLabelEnum.HighLevelDesign:
        return Constants.SYSTEM_PROMPTS.HIGH_LEVEL_DESIGN;
      case Schemas.InterviewPhaseLabelEnum.DeepDive:
        return Constants.SYSTEM_PROMPTS.DEEP_DIVE;
      case Schemas.InterviewPhaseLabelEnum.Scorecard:
        return Constants.SYSTEM_PROMPTS.SCORECARD;
      default:
        return "You are a System Design Interviewer.";
    }
  }
}

export default InterviewRepo;
