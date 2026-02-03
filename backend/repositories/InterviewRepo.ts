import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import * as Schemas from "../../schemas";
import gemini from "@/lib/gemini";
import { streamText, convertToModelMessages, UIMessage, tool } from "ai";
import Constants from "@/constants";
import type { Logger } from "@/lib/logger";
import Utilities from "@/utils";

class InterviewRepo {
  static async getChatStream(
    params: Schemas.GetChatStreamRequest,
    logger: Logger,
  ) {
    // 1. Persist user message
    const lastMessage = params.messages[params.messages.length - 1];
    if (lastMessage.role === Schemas.ChatRoleLabelEnum.User) {
      await InterviewDAL.createMessageInAiChats({
        sessionId: params.sessionId,
        role: Schemas.ChatRoleIntEnum.User,
        content: lastMessage.parts[0].text,
        phase: params.phase,
      });
    }

    // 2. Get sdi problem details -- TODO: Add problems to redis
    const sdiProblemDetails = await InterviewDAL.getSdiProblemDetails(
      params.problemId,
    );
    if (!sdiProblemDetails.problem) {
      return;
    }
    const systemPrompt = Constants.systemPrompts({
      phase: params.phase,
      systemName: sdiProblemDetails.problem?.title,
      botEAssumptions: sdiProblemDetails.problem?.boteFactors,
      functionalRequirements: sdiProblemDetails.problem?.functionalRequirements,
      nonFunctionalRequirements:
        sdiProblemDetails.problem?.nonFunctionalRequirements,
    });

    const modelMessages = await convertToModelMessages(
      params.messages as UIMessage[],
    );

    if (params.graph) {
      const graphStr = Utilities.graphToString(params.graph);
      const lastModelMessage = modelMessages[modelMessages.length - 1];
      if (lastModelMessage.role === "user") {
        const note = `\n\nHere is the serialized HLD graph:\n${graphStr}\n\nPlease analyze this graph and provide feedback as per the phase requirements.`;

        if (typeof lastModelMessage.content === "string") {
          lastModelMessage.content += note;
        } else if (Array.isArray(lastModelMessage.content)) {
          const textPart = lastModelMessage.content.find(
            (p) => p.type === "text",
          );
          if (textPart && "text" in textPart) {
            (textPart as any).text += note;
          } else {
            lastModelMessage.content.push({ type: "text", text: note });
          }
        }
      }
    }

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
          phase: params.phase,
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
}

export default InterviewRepo;
