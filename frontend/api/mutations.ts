import { apiClient } from "./apiClient";

export const analyzeDesign = async (sessionId: string, graph: any) => {
  return apiClient.post<any>("/api/interview/analyze", { sessionId, graph });
};

export const createInterviewSession = async (problemId: string) => {
  return apiClient.post<{ sessionId: string; [key: string]: any }>(
    "/api/interview/session",
    { problemId },
  );
};

export const endInterviewSession = async (sessionId: string) => {
  return apiClient.post(`/api/interview/session/${sessionId}/end`, {});
};
