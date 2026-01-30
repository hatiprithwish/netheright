import { ApiResponse } from "../common";
import { InterviewSession } from "./InterviewCommon";
import { z } from "zod";

export interface CreateInterviewSessionResponse extends ApiResponse {
  session: InterviewSession | null;
}

export const ZScorecardSchema = z.object({
  overallGrade: z.number().min(1).max(5),
  categories: z.object({
    requirementsGathering: z.number().min(1).max(5),
    dataModeling: z.number().min(1).max(5),
    tradeOffAnalysis: z.number().min(1).max(5),
    scalability: z.number().min(1).max(5),
  }),
  strengths: z.array(z.string()),
  growthAreas: z.array(z.string()),
  actionableFeedback: z.string(),
});

export type ScorecardSchema = z.infer<typeof ZScorecardSchema>;
