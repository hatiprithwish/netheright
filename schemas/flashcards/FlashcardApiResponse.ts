export interface Deck {
  id: string;
  name: string;
  description: string | null;
  cardCount: number;
  dueCount: number;
  createdAt: Date;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  tags: string[] | null;
  createdAt: Date;
  schedule?: CardSchedule;
}

export interface CardSchedule {
  easinessFactor: number;
  interval: number;
  repetitions: number;
  nextDue: Date;
}

export interface GetDecksResponse {
  isSuccess: boolean;
  message: string;
  decks: Deck[];
}

export interface GetDeckResponse {
  isSuccess: boolean;
  message: string;
  deck: Deck | null;
}

export interface CreateDeckResponse {
  isSuccess: boolean;
  message: string;
  deck: Deck | null;
}

export interface UpdateDeckResponse {
  isSuccess: boolean;
  message: string;
  deck: Deck | null;
}

export interface DeleteDeckResponse {
  isSuccess: boolean;
  message: string;
}

export interface GetCardsResponse {
  isSuccess: boolean;
  message: string;
  cards: Card[];
}

export interface GetCardResponse {
  isSuccess: boolean;
  message: string;
  card: Card | null;
}

export interface CreateCardResponse {
  isSuccess: boolean;
  message: string;
  card: Card | null;
}

export interface BulkCreateCardsResponse {
  isSuccess: boolean;
  message: string;
  cards: Card[];
}

export interface DeleteCardResponse {
  isSuccess: boolean;
  message: string;
}

export interface GetDueCardsResponse {
  isSuccess: boolean;
  message: string;
  cards: Card[];
  totalDue: number;
}

export interface SubmitReviewResponse {
  isSuccess: boolean;
  message: string;
  schedule: CardSchedule | null;
}

export interface GetStatsResponse {
  isSuccess: boolean;
  message: string;
  stats: {
    totalCards: number;
    dueToday: number;
    reviewedToday: number;
    totalReviews: number;
  } | null;
}
