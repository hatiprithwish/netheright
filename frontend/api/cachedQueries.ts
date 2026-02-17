import useSWR from "swr";
import { fetcher } from "./apiClient";
import * as Schemas from "@/schemas";

export const useInterviewSession = (sessionId: string | null) => {
  const { data, error, isLoading, mutate } =
    useSWR<Schemas.GetInterviewSessionResponse>(
      sessionId ? `/api/interview/${sessionId}` : null,
      fetcher,
    );

  return {
    session: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useInterviewHistory = () => {
  const { data, error, isLoading } =
    useSWR<Schemas.GetInterviewHistoryResponse>(
      "/api/dashboard/interviews",
      fetcher,
    );

  return {
    interviews: data?.interviews ?? [],
    isLoading,
    error: error?.message ?? null,
  };
};

export const useProblems = () => {
  const { data, error, isLoading } = useSWR<Schemas.GetProblemsResponse>(
    "/api/problems",
    fetcher,
  );

  return {
    problems: data?.problems ?? [],
    isLoading,
    error: error?.message ?? null,
  };
};
