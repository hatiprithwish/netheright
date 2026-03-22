import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import ProblemsDAL from "@/backend/data-access-layer/ProblemsDAL";
import * as Schemas from "../../schemas";
import gemini from "@/lib/gemini";
import {
  streamText,
  convertToModelMessages,
  UIMessage,
  tool,
  generateText,
  Output,
} from "ai";
import Constants from "@/constants";
import Utilities from "@/utils";
import z from "zod";
import Log from "@/lib/pino/Log";

class InterviewRepo {
  private static async persistUserMessage(
    params: Pick<
      Schemas.GetChatStreamRequest,
      "messages" | "interviewId" | "phase"
    >,
  ) {
    const lastMessage = params.messages[params.messages.length - 1];
    if (lastMessage.role !== Schemas.ChatRoleLabelEnum.User) return;

    await InterviewDAL.createInterviewChat({
      interviewId: params.interviewId,
      role: Schemas.ChatRoleIntEnum.User,
      content: lastMessage.parts[0].text,
      phase: params.phase,
    });
  }

  private static async buildModelMessages(params: {
    interviewId: string;
    graph?: Schemas.SanitizedGraph;
  }) {
    const { messages } = await InterviewDAL.getInterviewChats({
      interviewId: params.interviewId,
    });

    const uiMessages: UIMessage[] = messages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      parts: [{ type: "text", text: msg.content }],
    }));

    const modelMessages = await convertToModelMessages(uiMessages);

    if (params.graph) {
      const graphStr = Utilities.graphToString(params.graph);
      const lastMessage = modelMessages[modelMessages.length - 1];
      const graphNote = `\n\nHere is the serialized HLD graph:\n${graphStr}\n\nPlease analyze this graph and provide feedback as per the phase requirements.`;

      if (lastMessage.role === Schemas.ChatRoleLabelEnum.User) {
        if (typeof lastMessage.content === "string") {
          lastMessage.content += graphNote;
        } else if (Array.isArray(lastMessage.content)) {
          const textPart = lastMessage.content.find((p) => p.type === "text");
          if (textPart && "text" in textPart) {
            (textPart as { type: "text"; text: string }).text += graphNote;
          } else {
            lastMessage.content.push({ type: "text", text: graphNote });
          }
        }
      }
    }

    return modelMessages;
  }

  private static async generateAndSaveScorecard(interviewId: string) {
    const { messages } = await InterviewDAL.getInterviewChats({ interviewId });
    const conversationHistory = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    const scorecardResult = await generateText({
      model: gemini("gemini-2.5-flash"),
      output: Output.object({ schema: Schemas.ZInterviewScorecard }),
      prompt: Constants.scoreCardPrompt({ conversationHistory }),
    });

    const scorecard = scorecardResult.output;
    return await InterviewDAL.createInterviewScorecard({
      interviewId,
      overallGrade: scorecard.overallGrade,
      requirementsGathering: scorecard.categories.requirementsGathering,
      dataModeling: scorecard.categories.dataModeling,
      tradeOffAnalysis: scorecard.categories.tradeOffAnalysis,
      scalability: scorecard.categories.scalability,
      strengths: scorecard.strengths,
      growthAreas: scorecard.growthAreas,
      actionableFeedback: scorecard.actionableFeedback,
    });
  }

  static async getChatStream(params: Schemas.GetChatStreamRequest) {
    await InterviewRepo.persistUserMessage(params);

    const modelMessages = await InterviewRepo.buildModelMessages(params);

    const { problem } = await ProblemsDAL.getProblem(params.problemId);
    if (!problem) {
      Log.error(`Problem not found for problemId ${params.problemId}`);
      return { isSuccess: false, message: "Problem details not found" };
    }

    const systemPrompt = Constants.systemPrompts({
      phase: params.phase,
      systemName: problem.title,
      botEAssumptions: problem.boteFactors?.join("\n"),
      functionalRequirements: problem.functionalRequirements?.join("\n"),
      nonFunctionalRequirements: problem.nonFunctionalRequirements?.join("\n"),
    });

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
            const newPhase = Schemas.interviewPhaseLabelToInt[nextPhase];
            const { isSuccess } = await InterviewDAL.updateInterview({
              interviewId: params.interviewId,
              phase: newPhase,
              status: null,
            });
            return {
              newPhase,
              status: isSuccess ? "transition_complete" : "transition_failed",
            };
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

            InterviewRepo.generateAndSaveScorecard(params.interviewId).catch(
              (error) =>
                Log.error({ error }, "Failed to generate or save scorecard"),
            );

            return { status: "interview_completed" };
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
            .map((p) => (p.type === "text" ? p.text : ""))
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
    return await InterviewDAL.createInterview({
      userId: params.userId,
      problemId: Number(params.problemId),
    });
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
