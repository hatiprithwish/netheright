import { ApiResponse } from "../common";
import { Interview, InterviewScorecard } from "./InterviewCommon";
import { ChatRoleLabelEnum } from "./InterviewEnum";

export interface CreateInterviewResponse extends ApiResponse {
  interview: Interview | null;
}

export interface GetInterviewResponse extends ApiResponse {
  interview: Interview | null;
}

export interface GetInterviewsResponse extends ApiResponse {
  interviews: Interview[];
}

export interface GetInterviewScorecardResponse extends ApiResponse {
  scorecard: InterviewScorecard | null;
}

export interface CreateMessageResponse extends ApiResponse {
  messageData: any | null;
}

export interface GetChatStreamResponse extends ApiResponse {
  stream?: Response;
}

export interface GetInterviewChatsResponse extends ApiResponse {
  messages: {
    id: string;
    role: ChatRoleLabelEnum;
    content: string;
  }[];
}

export interface CreateInterviewScorecardResponse extends ApiResponse {
  scorecard: InterviewScorecard | null;
}

export interface GetInterviewsSummaryResponse extends ApiResponse {
  summary: {
    totalCount: number;
    completedCount: number;
    inProgressCount: number;
    abandonedCount: number;
  } | null;
}
