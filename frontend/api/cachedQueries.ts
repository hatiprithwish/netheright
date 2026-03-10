import useSWR from "swr";
import { fetcher, apiClient } from "./apiClient";
import * as Schemas from "@/schemas";
import { useAuth } from "../hooks/useAuth";

export const useGetInterview = (interviewId: string | null) => {
  const { currentUser } = useAuth();
  const isDisabled = !interviewId || !currentUser;
  const cachedKey = !isDisabled ? `/api/interview/${interviewId}` : null;

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
  } = useSWR<Schemas.GetInterviewsResponse>(
    cachedKey,
    ([url, reqBody]: [string, Schemas.GetInterviewsByUserRequest]) =>
      apiClient.post<Schemas.GetInterviewsResponse>(url, reqBody),
  );

  return {
    data,
    error,
    isLoading: !isDisabled && !error && !data,
    handleRefresh,
  };
};

export const useGetInterviewsByUserCount = (
  body: Schemas.GetInterviewsByUserCountRequest,
) => {
  const { currentUser } = useAuth();
  const isDisabled = !body || !currentUser;
  const cachedKey = !isDisabled
    ? [`/api/query/${currentUser?.id}/interviews/count`, body]
    : null;

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.TotalRecordsResponse>(cachedKey, fetcher);

  return {
    data,
    error,
    isLoading: !isDisabled && !error && !data,
    handleRefresh,
  };
};

export const useGetInterviewFeedbackDetails = (sessionId: string | null) => {
  const isDisabled = !sessionId;
  const cachedKey = !isDisabled ? `/api/interview/${sessionId}/feedback` : null;

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.GetInterviewScorecardResponse>(cachedKey, fetcher);

  return {
    data,
    error,
    isLoading: !isDisabled && !error && !data,
    handleRefresh,
  };
};

export const useGetRoles = () => {
  const { currentUser } = useAuth();
  const isDisabled = !currentUser;
  const cachedKey = !isDisabled ? "/api/metadata/roles" : null;

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.GetAllRolesResponse>(cachedKey, fetcher);

  return {
    data,
    error,
    isLoading: !isDisabled && !error && !data,
    handleRefresh,
  };
};

// ------ Public APIs ------
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
