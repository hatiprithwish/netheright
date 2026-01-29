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
