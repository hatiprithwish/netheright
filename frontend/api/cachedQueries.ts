import useSWR from "swr";
import { fetcher, apiClient } from "./apiClient";
import * as Schemas from "@/schemas";
import { useAuth } from "../../lib/next-auth/useAuth";

export interface McpKey {
  id: string;
  name: string;
  createdAt: string;
  revokedAt: string | null;
}

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
    ([url, reqBody]: [string, Schemas.GetInterviewsByUserRepoRequest]) =>
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

export const useGetInterviewsSummary = () => {
  const { currentUser } = useAuth();
  const isDisabled = !currentUser;
  const cachedKey = !isDisabled ? `/api/${currentUser?.id}/interviews/summary` : null;

  const {
    data,
    error,
    mutate: handleRefresh,
  } = useSWR<Schemas.GetInterviewsSummaryResponse>(cachedKey, fetcher);

  return {
    data,
    error,
    isLoading: !isDisabled && !error && !data,
    handleRefresh,
  };
};

export const useGetInterviewFeedbackDetails = (sessionId: string | null) => {
  const isDisabled = !sessionId;
  const cachedKey = !isDisabled ? `/api/interview/${sessionId}/scorecard` : null;

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

// ------ Flashcards ------

export const useGetDecks = () => {
  const { currentUser } = useAuth();
  const key = currentUser ? "/api/flashcards/decks" : null;
  const { data, error, mutate } = useSWR<Schemas.GetDecksResponse>(key, fetcher);
  return { data, error, isLoading: !!currentUser && !error && !data, handleRefresh: mutate };
};

export const useGetDeck = (deckId: string | null) => {
  const key = deckId ? `/api/flashcards/decks/${deckId}` : null;
  const { data, error, mutate } = useSWR<Schemas.GetDeckResponse>(key, fetcher);
  return { data, error, isLoading: !!deckId && !error && !data, handleRefresh: mutate };
};

export const useGetCards = (deckId: string | null) => {
  const key = deckId ? `/api/flashcards/decks/${deckId}/cards` : null;
  const { data, error, mutate } = useSWR<Schemas.GetCardsResponse>(key, fetcher);
  return { data, error, isLoading: !!deckId && !error && !data, handleRefresh: mutate };
};

export const useGetDueCards = (deckId: string | null) => {
  const key = deckId ? `/api/flashcards/decks/${deckId}/due` : null;
  const { data, error, mutate } = useSWR<Schemas.GetDueCardsResponse>(key, fetcher);
  return { data, error, isLoading: !!deckId && !error && !data, handleRefresh: mutate };
};

export const useGetFlashcardStats = (deckId?: string) => {
  const { currentUser } = useAuth();
  const key = currentUser
    ? `/api/flashcards/stats${deckId ? `?deckId=${deckId}` : ""}`
    : null;
  const { data, error, mutate } = useSWR<Schemas.GetStatsResponse>(key, fetcher);
  return { data, error, isLoading: !!currentUser && !error && !data, handleRefresh: mutate };
};

// ------ MCP Keys ------

export const useGetMcpKeys = () => {
  const { data, isLoading, mutate } = useSWR<{ keys: McpKey[] }>("/api/mcp-keys", fetcher);
  return { data, isLoading, handleRefresh: mutate };
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
