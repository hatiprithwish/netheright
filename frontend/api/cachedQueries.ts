import useSWR from "swr";
import { fetcher } from "./apiClient";
import * as Schemas from "@/schemas";

export const useInterviewSession = (sessionId: string | null) => {
  const { data, error, isLoading, mutate } =
    useSWR<Schemas.GetInterviewSessionResponse>(
      sessionId ? `/api/interview/session/${sessionId}` : null,
      fetcher,
    );

  return {
    session: data,
    isLoading,
    isError: error,
    mutate,
  };
};
