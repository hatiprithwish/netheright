import { z } from "zod";
import { InterviewPhaseIntEnum } from "./InterviewEnum";
import { ZAiMessage } from "./InterviewCommon";
import { ZSanitizedGraph } from "../common";

export const ZCreateInterviewSessionRequest = z.object({
  problemId: z.number(),
});

export type CreateInterviewSessionRequest = z.infer<
  typeof ZCreateInterviewSessionRequest
>;

export type CreateInterviewSessionRepoRequest = z.infer<
  typeof ZCreateInterviewSessionRequest
> & {
  userId: string;
};

export const ZGetChatStreamRequest = z.object({
  phase: z.enum(InterviewPhaseIntEnum),
  sessionId: z.string(),
  problemId: z.number(),
  messages: z.array(ZAiMessage),
  graph: ZSanitizedGraph.optional(),
});

export type GetChatStreamRequest = z.infer<typeof ZGetChatStreamRequest>;
