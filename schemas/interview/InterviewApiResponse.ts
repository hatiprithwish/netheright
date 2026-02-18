import { ApiResponse } from "../common";
import { Interview } from "./InterviewCommon";
import { z } from "zod";

export interface CreateInterviewResponse extends ApiResponse {
  session: Interview | null;
}

export interface GetInterviewResponse extends ApiResponse {
  session: Interview | null;
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

export interface GetInterviewFeedbackDetailsResponse extends ApiResponse {
  feedback: {
    overallGrade: number;
    requirementsGathering: number;
    dataModeling: number;
    tradeOffAnalysis: number;
    scalability: number;
    strengths: string[];
    growthAreas: string[];
    actionableFeedback: string;
  } | null;
}
