import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import ProblemsDAL from "@/backend/data-access-layer/ProblemsDAL";
import * as Schemas from "../../schemas";
import gemini from "@/lib/gemini";
import { streamText, convertToModelMessages, UIMessage, tool } from "ai";
import Constants from "@/constants";
import type { Logger } from "@/lib/logger";
import Utilities from "@/utils";
import z from "zod";

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

    // 2. Fetch message history from database (clean, without tool invocations)
    const dbMessages = await InterviewDAL.getMessagesBySession(
      params.sessionId,
    );

    // 3. Convert DB messages to UIMessage format
    const uiMessages: UIMessage[] = dbMessages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      parts: [{ type: "text", text: msg.content }],
    }));

    // 4. Get sdi problem details -- TODO: Add problems to redis
    const sdiProblemDetails = await ProblemsDAL.getProblemDetails(
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

    const modelMessages = await convertToModelMessages(uiMessages);

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

    // logger.debug(
    //   {
    //     systemPrompt,
    //     messages: modelMessages,
    //   },
    //   "Gemini request details",
    // );

    const result = streamText({
      model: gemini("gemini-2.5-flash"),
      system: systemPrompt,
      messages: modelMessages,
      // @ts-expect-error
      maxSteps: 5,
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
            await InterviewDAL.updateInterviewPhase(
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
        endInterview: tool({
          description: "Call this when the interview is complete.",
          inputSchema: z.object({}),
          execute: async () => {
            console.log("Ending interview session");
            await InterviewDAL.endInterviewSession(params.sessionId);

            // Generate scorecard by sending entire chat history to LLM
            const allMessages = await InterviewDAL.getMessagesBySession(
              params.sessionId,
            );

            // Create a conversation summary for the LLM
            const conversationHistory = allMessages
              .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
              .join("\n\n");

            try {
              const { generateObject } = await import("ai");
              const scorecardResult = await generateObject({
                model: gemini("gemini-2.5-flash"),
                schema: Schemas.ZScorecardSchema,
                prompt: Constants.scoreCardPrompt({ conversationHistory }),
              });

              // Save scorecard to database
              await InterviewDAL.createScorecard({
                sessionId: params.sessionId,
                overallGrade: scorecardResult.object.overallGrade,
                requirementsGathering:
                  scorecardResult.object.categories.requirementsGathering,
                dataModeling: scorecardResult.object.categories.dataModeling,
                tradeOffAnalysis:
                  scorecardResult.object.categories.tradeOffAnalysis,
                scalability: scorecardResult.object.categories.scalability,
                strengths: scorecardResult.object.strengths,
                growthAreas: scorecardResult.object.growthAreas,
                actionableFeedback: scorecardResult.object.actionableFeedback,
              });

              logger.info(
                { scorecard: scorecardResult.object },
                "Scorecard generated and saved successfully",
              );
            } catch (error) {
              logger.error({ error }, "Failed to generate or save scorecard");
            }

            return {
              status: "interview_completed",
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse({
      onFinish: async ({ messages }) => {
        const assistantMessage = messages[messages.length - 1];
        const content = assistantMessage.parts
          .map((p) => (p.type == "text" ? p.text : ""))
          .join("");

        await InterviewDAL.createMessageInAiChats({
          sessionId: params.sessionId,
          role: Schemas.ChatRoleIntEnum.Assistant,
          content,
          phase: params.phase,
        });
      },
    });
  }

  static async createInterviewSession(
    params: Schemas.CreateInterviewSessionRepoRequest,
  ) {
    return await InterviewDAL.createInterview(params);
  }

  static async getSession(sessionId: string) {
    const session = await InterviewDAL.getInterview(sessionId);
    if (!session) throw new Error("Session not found");
    return session;
  }

  static async getInterviewFeedbackDetails(
    sessionId: string,
    userId: string,
  ): Promise<Schemas.GetInterviewFeedbackDetailsResponse> {
    const response: Schemas.GetInterviewFeedbackDetailsResponse = {
      isSuccess: false,
      message: "Failed to fetch interview feedback details",
      feedback: null,
    };

    try {
      const feedback = await InterviewDAL.getInterviewFeedbackDetails(
        sessionId,
        userId,
      );

      if (!feedback) {
        response.message = "Feedback not found or access denied";
        return response;
      }

      response.feedback = feedback;
      response.isSuccess = true;
      response.message = "Feedback fetched successfully";
      return response;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return response;
    }
  }

  static async updateInterviewSessionStatus(
    sessionId: string,
    status: Schemas.InterviewStatusIntEnum,
  ): Promise<Schemas.ApiResponse> {
    return await InterviewDAL.updateInterviewSessionStatus(sessionId, status);
  }
}

export default InterviewRepo;
