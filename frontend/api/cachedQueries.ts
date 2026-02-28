import useSWR from "swr";
import { fetcher, apiClient } from "./apiClient";
import * as Schemas from "@/schemas";
import { useAuth } from "../ui/hooks/useAuth";

export const useInterviewSession = (sessionId: string | null) => {
  const isDisabled = !sessionId;
  const cachedKey = !isDisabled ? `/api/interview/${sessionId}` : null;

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.GetInterviewResponse>(cachedKey, fetcher);

  return {
    data,
    error,
    isLoading: !isDisabled && !error && !data,
    handleRefresh,
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
  const isDisabled = !userId;
  const cachedKey = !isDisabled ? `/api/${userId}/interviews/count` : null;

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.GetInterviewCountResponse>(cachedKey, fetcher);

  return {
    data,
    error,
    isLoading: !isDisabled && !error && !data,
    handleRefresh,
  };
};

// Public API
export const useProblems = () => {
  const cachedKey = "/api/problems";

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.GetProblemsResponse>(cachedKey, fetcher);

  return {
    data,
    error,
    isLoading: !error && !data,
    handleRefresh,
  };
};
