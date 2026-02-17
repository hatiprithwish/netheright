import { ApiResponse } from "../common";
import { InterviewSession, SdiProblem } from "./InterviewCommon";
import { z } from "zod";

export interface CreateInterviewSessionResponse extends ApiResponse {
  session: InterviewSession | null;
}

export interface GetInterviewSessionResponse extends ApiResponse {
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

export interface GetSdiProblemDetailsResponse extends ApiResponse {
  problem: SdiProblem | null;
}

export interface DeleteInterviewResponse extends ApiResponse {}

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
