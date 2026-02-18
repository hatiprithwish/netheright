import { ApiResponse } from "../common";
import { z } from "zod";

export const ZInterviewHistoryItem = z.object({
  sessionId: z.string(),
  problemId: z.number(),
  problemTitle: z.string(),
  status: z.number(),
  statusLabel: z.string(),
  currentPhase: z.number(),
  currentPhaseLabel: z.string(),
  startTime: z.string(),
  endTime: z.string().nullable(),
  scorecard: z
    .object({
      overallGrade: z.number(),
      requirementsGathering: z.number(),
      dataModeling: z.number(),
      tradeOffAnalysis: z.number(),
      scalability: z.number(),
      strengths: z.array(z.string()),
      growthAreas: z.array(z.string()),
      actionableFeedback: z.string(),
    })
    .nullable(),
});

export type InterviewHistoryItem = z.infer<typeof ZInterviewHistoryItem>;

export interface GetInterviewHistoryResponse extends ApiResponse {
  interviews: InterviewHistoryItem[];
}
