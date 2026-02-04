import { ChatRoleIntEnum, InterviewPhaseIntEnum } from "./InterviewEnum";

export interface CreateMessageSqlRequest {
  sessionId: string;
  role: ChatRoleIntEnum;
  content: any;
  phase: InterviewPhaseIntEnum;
}

export interface CreateInterviewSessionSqlRequest {
  userId: string;
  problemId: number;
}

export interface CreateRedFlagSqlRequest {
  sessionId: string;
  type: string;
  reason: string;
  phase: InterviewPhaseIntEnum;
}

export interface CreateScorecardSqlRequest {
  sessionId: string;
  overallGrade: number;
  requirementsGathering: number;
  dataModeling: number;
  tradeOffAnalysis: number;
  scalability: number;
  strengths: string[];
  growthAreas: string[];
  actionableFeedback: string;
}
