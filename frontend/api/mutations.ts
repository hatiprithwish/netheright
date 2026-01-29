import { apiClient } from "./apiClient";
import * as Schemas from "@/schemas";

export const analyzeDesign = async (sessionId: string, graph: any) => {
  return apiClient.post<any>("/api/interview/analyze", { sessionId, graph });
};

export const createInterviewSession = async (
  params: Schemas.CreateInterviewSessionRequest,
) => {
  return apiClient.post<Schemas.CreateInterviewSessionResponse>(
    "/api/interview/session",
    params,
  );
};

export const endInterviewSession = async (sessionId: string) => {
  return apiClient.post(`/api/interview/session/${sessionId}/end`, {});
};
