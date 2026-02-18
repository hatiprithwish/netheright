import { apiClient } from "./apiClient";
import * as Schemas from "@/schemas";

export const analyzeDesign = async (sessionId: string, graph: any) => {
  return apiClient.post<any>("/api/interview/analyze", { sessionId, graph });
};

export const createInterviewSession = async (
  params: Schemas.CreateInterviewSessionRequest,
) => {
  return apiClient.post<Schemas.CreateInterviewResponse>(
    "/api/interview",
    params,
  );
};

export const endInterviewSession = async (sessionId: string) => {
  return apiClient.post(`/api/interview/${sessionId}/end`, {});
};

export const deleteInterview = async (sessionId: string) => {
  return apiClient.delete<Schemas.ApiResponse>(`/api/interview/${sessionId}`);
};

export const updateInterviewSessionStatus = async (
  sessionId: string,
  status: Schemas.InterviewStatusIntEnum,
) => {
  return apiClient.patch<Schemas.ApiResponse>(`/api/interview/${sessionId}`, {
    status,
  });
};
