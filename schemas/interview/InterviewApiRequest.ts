import { z } from "zod";
import {
  ZInterviewPhaseIntEnum,
  ZInterviewStatusIntEnum,
} from "./InterviewEnum";
import { ZAiMessage } from "./InterviewCommon";
import { ZSanitizedGraph } from "../common";

export const ZCreateInterviewRequest = z.object({
  problemId: z.string(),
});

export type CreateInterviewRequest = z.infer<typeof ZCreateInterviewRequest>;

export type CreateInterviewRepoRequest = z.infer<
  typeof ZCreateInterviewRequest
> & {
  userId: string;
};

export const ZGetInterviewApiRequest = z.object({
  interviewId: z.string(),
});

export type GetInterviewApiRequest = z.infer<typeof ZGetInterviewApiRequest>;

export const ZGetInterviewScorecardApiRequest = z.object({
  interviewId: z.string(),
  userId: z.string(),
});

export type GetInterviewScorecardApiRequest = z.infer<
  typeof ZGetInterviewScorecardApiRequest
>;

export const ZGetChatStreamRequest = z.object({
  phase: ZInterviewPhaseIntEnum,
  interviewId: z.string(),
  problemId: z.number(),
  messages: z.array(ZAiMessage),
  graph: ZSanitizedGraph.optional(),
});

export type GetChatStreamRequest = z.infer<typeof ZGetChatStreamRequest>;

export const ZDeleteInterviewApiRequest = z.object({
  interviewId: z.string(),
});

export type DeleteInterviewApiRequest = z.infer<
  typeof ZDeleteInterviewApiRequest
>;

export const ZUpdateInterviewStatusApiRequest = z.object({
  interviewId: z.string(),
  status: ZInterviewStatusIntEnum,
});

export type UpdateInterviewStatusApiRequest = z.infer<
  typeof ZUpdateInterviewStatusApiRequest
>;
