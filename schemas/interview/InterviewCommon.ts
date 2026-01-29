import { SerializedGraph } from "@/lib/serializeGraph";
import {
  ChatRoleLabelEnum,
  InterviewPhaseIntEnum,
  InterviewPhaseLabelEnum,
  InterviewSessionStatusIntEnum,
  InterviewSessionStatusLabelEnum,
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
      type: z.literal("text"),
      text: z.string(),
    }),
  ),
});

export type AiMessage = z.infer<typeof ZAiMessage>;
