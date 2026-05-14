import { apiClient } from "./apiClient";
import * as Schemas from "@/schemas";

export const analyzeDesign = async (sessionId: string, graph: any) => {
  return apiClient.post<any>("/api/interview/analyze", { sessionId, graph });
};

export const createInterviewSession = async (
  params: Schemas.CreateInterviewRequest,
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

export const updateUserRole = async (
  userId: string,
  body: Schemas.UpdateUserRoleRequest,
) => {
  return apiClient.post(`/api/${userId}/update-role`, body);
};

// ------ Flashcards ------

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

// ------ MCP Keys ------

export const createMcpKey = (name: string): Promise<{ id: string; key: string; name: string; createdAt: string }> =>
  apiClient.post<{ id: string; key: string; name: string; createdAt: string }>("/api/mcp-keys", { name });

export const revokeMcpKey = (keyId: string): Promise<void> =>
  apiClient.delete(`/api/mcp-keys/${keyId}`);
