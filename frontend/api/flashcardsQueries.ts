import useSWR from "swr";
import { fetcher, apiClient } from "./apiClient";
import * as Schemas from "@/schemas";
import { useAuth } from "../../lib/next-auth/useAuth";

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

export const useGetStats = (deckId?: string) => {
  const { currentUser } = useAuth();
  const key = currentUser
    ? `/api/flashcards/stats${deckId ? `?deckId=${deckId}` : ""}`
    : null;
  const { data, error, mutate } = useSWR<Schemas.GetStatsResponse>(key, fetcher);
  return { data, error, isLoading: !!currentUser && !error && !data, handleRefresh: mutate };
};

// ── Mutations ──────────────────────────────────────────────────────────────

export const createDeck = (body: Schemas.CreateDeckRequest) =>
  apiClient.post<Schemas.CreateDeckResponse>("/api/flashcards/decks", body);

export const deleteDeck = (deckId: string) =>
  apiClient.delete<Schemas.DeleteDeckResponse>(`/api/flashcards/decks/${deckId}`);

export const createCard = (deckId: string, body: Schemas.CreateCardRequest) =>
  apiClient.post<Schemas.CreateCardResponse>(
    `/api/flashcards/decks/${deckId}/cards`,
    body,
  );

export const bulkCreateCards = (deckId: string, body: Schemas.BulkCreateCardsRequest) =>
  apiClient.post<Schemas.BulkCreateCardsResponse>(
    `/api/flashcards/decks/${deckId}/cards/bulk`,
    body,
  );

export const deleteCard = (deckId: string, cardId: string) =>
  apiClient.delete<Schemas.DeleteCardResponse>(
    `/api/flashcards/decks/${deckId}/cards/${cardId}`,
  );

export const submitReview = (cardId: string, body: Schemas.SubmitReviewRequest) =>
  apiClient.post<Schemas.SubmitReviewResponse>(
    `/api/flashcards/cards/${cardId}/review`,
    body,
  );
