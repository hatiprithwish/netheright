import { InterviewPhase, InterviewSessionStatus } from "./InterviewEnum";

export interface GetInterviewSessionResponse {
    id: string;
    userId: string;
    problemId: string;
    status: InterviewSessionStatus;
    currentPhase: InterviewPhase;
    createdAt: string;
    updatedAt: string;
}