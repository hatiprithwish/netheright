import { SerializedGraph } from "@/lib/serializeGraph";
import {
  ChatRoleLabelEnum,
  InterviewPhaseIntEnum,
  InterviewPhaseLabelEnum,
  InterviewSessionStatusIntEnum,
  InterviewSessionStatusLabelEnum,
  RedFlagTypeEnum,
} from "./InterviewEnum";
import { z } from "zod";

export type SaveDiagramParams = {
  sessionId: string;
  topology: SerializedGraph;
  rawReactFlow: any;
  phase: InterviewPhaseIntEnum;
  userId: string;
};

export interface InterviewSession {
  id: string;
  userId: string;
  problemId: number;
  status: InterviewSessionStatusIntEnum;
  statusLabel: InterviewSessionStatusLabelEnum;
  currentPhase: InterviewPhaseIntEnum;
  currentPhaseLabel: InterviewPhaseLabelEnum;
  createdAt: string;
}

export const ZAiMessage = z.object({
  id: z.string(),
  role: z.enum(ChatRoleLabelEnum),
  parts: z.array(
    z.object({
      type: z.string(),
      text: z.string().optional(),
      state: z.string().optional(),
    }),
  ),
});

export type AiMessage = z.infer<typeof ZAiMessage>;

export const ZRecordRedFlagParams = z.object({
  type: z.enum(RedFlagTypeEnum),
  reason: z.string(),
});

export type RecordRedFlagParams = z.infer<typeof ZRecordRedFlagParams>;

export const ZTransitionToPhaseParams = z.object({
  nextPhase: z.enum(InterviewPhaseLabelEnum),
});

export type TransitionToPhaseParams = z.infer<typeof ZTransitionToPhaseParams>;
