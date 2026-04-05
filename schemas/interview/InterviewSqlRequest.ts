import { SortDirection } from "../common";
import {
  ChatRoleIntEnum,
  InterviewGradeIntEnum,
  InterviewPhaseIntEnum,
  InterviewSortColumn,
  InterviewStatusIntEnum,
} from "./InterviewEnum";

export interface CreateInterviewChatSqlRequest {
  interviewId: string;
  role: ChatRoleIntEnum;
  content: any; // JSONB
  phase: InterviewPhaseIntEnum;
}

export interface CreateInterviewSqlRequest {
  userId: string;
  problemId: number;
}

export interface CreateRedFlagSqlRequest {
  interviewId: string;
  type: string;
  reason: string;
  phase: InterviewPhaseIntEnum;
}

export interface CreateInterviewScorecardSqlRequest {
  interviewId: string;
  overallGrade: InterviewGradeIntEnum;
  requirementsGathering: InterviewGradeIntEnum;
  dataModeling: InterviewGradeIntEnum;
  tradeOffAnalysis: InterviewGradeIntEnum;
  scalability: InterviewGradeIntEnum;
  strengths: string[];
  growthAreas: string[];
  actionableFeedback: string;
}

export interface GetInterviewsCountSqlRequest {
  userId: string;
  status: number | null;
}

export interface GetInterviewsSqlRequest extends GetInterviewsCountSqlRequest {
  pageNo: number;
  pageSize: number;
  sortColumn: InterviewSortColumn;
  sortDirection: SortDirection;
}

export interface GetInterviewSqlRequest {
  interviewId: string;
}

export interface UpdateInterviewSqlRequest {
  interviewId: string;
  phase: InterviewPhaseIntEnum | null;
  status: InterviewStatusIntEnum | null;
}

export interface GetInterviewChatsSqlRequest {
  interviewId: string;
}

export interface GetInterviewScorecardSqlRequest {
  interviewId: string;
  userId: string;
}
