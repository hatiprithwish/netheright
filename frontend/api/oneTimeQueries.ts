import { apiClient } from "./apiClient";
import * as Schemas from "@/schemas";

export const getInterviewFeedbackDetails = async (sessionId: string) => {
  return apiClient.get<Schemas.GetInterviewFeedbackDetailsResponse>(
    `/api/interview/${sessionId}/feedback`,
  );
};
