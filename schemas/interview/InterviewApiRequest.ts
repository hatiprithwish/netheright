import { z } from "zod";
import { InterviewPhaseLabelEnum } from "./InterviewEnum";
import { ZAiMessage } from "./InterviewCommon";

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
  phaseLabel: z.enum(InterviewPhaseLabelEnum),
  sessionId: z.string(),
  messages: z.array(ZAiMessage),
});

export type GetChatStreamRequest = z.infer<typeof ZGetChatStreamRequest>;
