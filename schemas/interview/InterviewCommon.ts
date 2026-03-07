import {
  ChatRoleLabelEnum,
  InterviewPhaseIntEnum,
  InterviewPhaseLabelEnum,
  InterviewStatusIntEnum,
  InterviewStatusLabelEnum,
  RedFlagTypeEnum,
  InterviewGradeIntEnum,
} from "./InterviewEnum";
import { z } from "zod";

export interface Interview {
  id: string;
  userId: string;
  problemId: number;
  problemTitle: string;
  status: InterviewStatusIntEnum;
  statusLabel: InterviewStatusLabelEnum;
  currentPhase: InterviewPhaseIntEnum;
  currentPhaseLabel: InterviewPhaseLabelEnum;
  overallGrade?: InterviewGradeIntEnum | null;
  scorecard?: InterviewScorecard;
  createdAt: string | Date;
}

export const ZInterviewScorecard = z.object({
  overallGrade: z.nativeEnum(InterviewGradeIntEnum),
  categories: z.object({
    requirementsGathering: z.nativeEnum(InterviewGradeIntEnum),
    dataModeling: z.nativeEnum(InterviewGradeIntEnum),
    tradeOffAnalysis: z.nativeEnum(InterviewGradeIntEnum),
    scalability: z.nativeEnum(InterviewGradeIntEnum),
  }),
  strengths: z.array(z.string()),
  growthAreas: z.array(z.string()),
  actionableFeedback: z.string(),
});

export type InterviewScorecard = z.infer<typeof ZInterviewScorecard>;

export const ZAiMessage = z.object({
  id: z.string(),
  role: z.enum(ChatRoleLabelEnum),
  parts: z.array(
    z.object({
      type: z.string(),
      text: z.string().optional(),
      state: z.string().optional(),
      toolInvocation: z.any().optional(),
    }),
  ),
});

export type AiMessage = z.infer<typeof ZAiMessage>;

export const ZTransitionToPhaseParams = z.object({
  nextPhase: z.enum(InterviewPhaseLabelEnum),
});

export type TransitionToPhaseParams = z.infer<typeof ZTransitionToPhaseParams>;
