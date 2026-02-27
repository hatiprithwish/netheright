import useSWR from "swr";
import { fetcher, apiClient } from "./apiClient";
import * as Schemas from "@/schemas";
import { useAuth } from "../ui/hooks/useAuth";

export const useInterviewSession = (sessionId: string | null) => {
  const { data, error, isLoading, mutate } =
    useSWR<Schemas.GetInterviewResponse>(
      sessionId ? `/api/interview/${sessionId}` : null,
      fetcher,
    );

  return {
    session: data?.interview ?? null,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useGetInterviewsByUser = (
  body: Schemas.GetInterviewsByUserRequest,
) => {
  const { currentUser } = useAuth();
  const isDisabled = !currentUser;
  const cachedKey = !isDisabled
    ? [`/api/query/${currentUser?.id}/interviews`, body]
    : null;

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.GetInterviewHistoryResponse>(
    cachedKey,
    ([url, reqBody]: [string, Schemas.GetInterviewsByUserRequest]) =>
      apiClient.post<Schemas.GetInterviewHistoryResponse>(url, reqBody),
  );

  return {
    data,
    error,
    isLoading: !isDisabled && !error && !data,
    handleRefresh,
  };
};

export const useGetInterviewsByUserCount = (userId: string | null) => {
  const { data, error, isLoading } = useSWR<Schemas.GetInterviewCountResponse>(
    userId ? `/api/${userId}/interviews/count` : null,
    fetcher,
  );

  return {
    total: data?.total ?? 0,
    completed: data?.completed ?? 0,
    inProgress: data?.inProgress ?? 0,
    abandoned: data?.abandoned ?? 0,
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
