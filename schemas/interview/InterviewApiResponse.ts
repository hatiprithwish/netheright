import { ApiResponse } from "../common";
import { InterviewSession } from "./InterviewCommon";

export interface CreateInterviewSessionResponse extends ApiResponse {
  session: InterviewSession | null;
}
