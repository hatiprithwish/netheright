import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import ProblemsDAL from "@/backend/data-access-layer/ProblemsDAL";
import * as Schemas from "../../schemas";
import gemini from "@/lib/gemini";
import { streamText, convertToModelMessages, UIMessage, tool } from "ai";
import Constants from "@/constants";
import Utilities from "@/utils";
import z from "zod";
import Log from "@/lib/pino/Log";
import { generateObject } from "ai";

class InterviewRepo {
  // TODO: Clean this up
  static async getChatStream(params: Schemas.GetChatStreamRequest) {
    // 1. Persist user message
    const lastMessage = params.messages[params.messages.length - 1];
    if (lastMessage.role === Schemas.ChatRoleLabelEnum.User) {
      await InterviewDAL.createInterviewChat({
        interviewId: params.interviewId,
        role: Schemas.ChatRoleIntEnum.User,
        content: lastMessage.parts[0].text,
        phase: params.phase,
      });
    }

    // 2. Fetch message history from database (clean, without tool invocations)
    const response = await InterviewDAL.getInterviewChats({
      interviewId: params.interviewId,
    });

    // 3. Convert DB messages to UIMessage format
    const uiMessages: UIMessage[] = response.messages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      parts: [{ type: "text", text: msg.content }],
    }));
    const modelMessages = await convertToModelMessages(uiMessages);

    // 4. Get problem details
    const problemDetailsResponse = await ProblemsDAL.getProblemDetails(
      params.problemId,
    );
    if (!problemDetailsResponse.problem) {
      Log.error(`Problem details not found for problemId ${params.problemId}`);
      return {
        isSuccess: false,
        message: "Problem details not found",
      };
    }

    // 5. Generate system prompt
    const systemPrompt = Constants.systemPrompts({
      phase: params.phase,
      systemName: problemDetailsResponse.problem?.title,
      botEAssumptions: problemDetailsResponse.problem?.boteFactors,
      functionalRequirements:
        problemDetailsResponse.problem?.functionalRequirements,
      nonFunctionalRequirements:
        problemDetailsResponse.problem?.nonFunctionalRequirements,
    });

    // 6. If the request is HLD design, append the graph to the last model message
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

    const result = streamText({
      model: gemini("gemini-2.5-flash"),
      system: systemPrompt,
      messages: modelMessages,
      tools: {
        transitionToPhase: tool({
          description:
            "Call this when the current phase is complete to move to the next phase.",
          inputSchema: Schemas.ZTransitionToPhaseParams,
          execute: async ({ nextPhase }) => {
            const response = await InterviewDAL.updateInterview({
              interviewId: params.interviewId,
              phase: Schemas.interviewPhaseLabelToInt[nextPhase],
              status: null,
            });
            if (response.isSuccess) {
              return {
                status: "transition_complete",
                newPhase: Schemas.interviewPhaseLabelToInt[nextPhase],
              };
            } else {
              return {
                status: "transition_failed",
                newPhase: Schemas.interviewPhaseLabelToInt[nextPhase],
              };
            }
          },
        }),
        endInterview: tool({
          description: "Call this when the interview is complete.",
          inputSchema: z.object({}),
          execute: async () => {
            await InterviewDAL.updateInterview({
              interviewId: params.interviewId,
              status: Schemas.InterviewStatusIntEnum.Completed,
              phase: null,
            });

            // Generate scorecard by sending entire chat history to LLM
            const interviewChatsResponse = await InterviewDAL.getInterviewChats(
              {
                interviewId: params.interviewId,
              },
            );

            // Create a conversation summary for the LLM
            const conversationHistory = interviewChatsResponse.messages
              .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
              .join("\n\n");

            try {
              const scorecardResult = await generateObject({
                model: gemini("gemini-2.5-flash"),
                schema: Schemas.ZInterviewScorecard,
                prompt: Constants.scoreCardPrompt({ conversationHistory }),
              });

              // Save scorecard to database
              await InterviewDAL.createInterviewScorecard({
                interviewId: params.interviewId,
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
            } catch (error) {
              Log.error({ error }, "Failed to generate or save scorecard");
            }

            return {
              status: "interview_completed",
            };
          },
        }),
      },
    });

    return {
      isSuccess: true,
      message: "Stream initiated successfully",
      stream: result.toUIMessageStreamResponse({
        onFinish: async ({ messages }) => {
          const assistantMessage = messages[messages.length - 1];
          const content = assistantMessage.parts
            .map((p) => (p.type == "text" ? p.text : ""))
            .join("");

          await InterviewDAL.createInterviewChat({
            interviewId: params.interviewId,
            role: Schemas.ChatRoleIntEnum.Assistant,
            content,
            phase: params.phase,
          });
        },
      }),
    };
  }

  static async createInterview(params: Schemas.CreateInterviewRepoRequest) {
    return await InterviewDAL.createInterview(params);
  }

  static async getInterview(params: Schemas.GetInterviewApiRequest) {
    return await InterviewDAL.getInterview({ interviewId: params.interviewId });
  }

  static async getInterviewScorecard(
    params: Schemas.GetInterviewScorecardApiRequest,
  ) {
    return await InterviewDAL.getInterviewScorecard({
      interviewId: params.interviewId,
      userId: params.userId,
    });
  }

  static async updateInterviewStatus(
    params: Schemas.UpdateInterviewStatusApiRequest,
  ) {
    return await InterviewDAL.updateInterview({
      interviewId: params.interviewId,
      status: params.status,
      phase: null,
    });
  }
}

export default InterviewRepo;
