export interface CreateDeckSqlRequest {
  userId: string;
  name: string;
  description?: string;
}

export interface UpdateDeckSqlRequest {
  deckId: string;
  userId: string;
  name?: string;
  description?: string;
}

export interface CreateCardSqlRequest {
  deckId: string;
  front: string;
  back: string;
  tags?: string[];
}

export interface BulkCreateCardsSqlRequest {
  deckId: string;
  cards: Array<{ front: string; back: string; tags?: string[] }>;
}

export interface UpdateCardSqlRequest {
  cardId: string;
  front?: string;
  back?: string;
  tags?: string[];
}

export interface SubmitReviewSqlRequest {
  cardId: string;
  userId: string;
  quality: number;
}

export interface GetDueCardsSqlRequest {
  userId: string;
  deckId?: string;
  limit?: number;
}
