import FlashcardDAL from "@/backend/data-access-layer/FlashcardDAL";
import * as Schemas from "@/schemas";

// SM-2 algorithm: https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
function sm2(
  quality: number,
  repetitions: number,
  easinessFactor: number,
  interval: number,
): { repetitions: number; easinessFactor: number; interval: number; nextDue: Date } {
  let newRepetitions = repetitions;
  let newEF = easinessFactor;
  let newInterval = interval;

  if (quality >= 3) {
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(interval * easinessFactor);
    newRepetitions = repetitions + 1;
  } else {
    newRepetitions = 0;
    newInterval = 1;
  }

  newEF = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + newInterval);

  return {
    repetitions: newRepetitions,
    easinessFactor: newEF,
    interval: newInterval,
    nextDue,
  };
}

class FlashcardRepo {
  // ── Decks ──────────────────────────────────────────────────────────────────

  static async getDecks(userId: string) {
    return FlashcardDAL.getDecks(userId);
  }

  static async getDeck(deckId: string, userId: string) {
    return FlashcardDAL.getDeck(deckId, userId);
  }

  static async createDeck(params: Schemas.CreateDeckSqlRequest) {
    return FlashcardDAL.createDeck(params);
  }

  static async updateDeck(params: Schemas.UpdateDeckSqlRequest) {
    return FlashcardDAL.updateDeck(params);
  }

  static async deleteDeck(deckId: string, userId: string) {
    return FlashcardDAL.deleteDeck(deckId, userId);
  }

  // ── Cards ──────────────────────────────────────────────────────────────────

  static async getCards(deckId: string, userId: string) {
    return FlashcardDAL.getCards(deckId, userId);
  }

  static async createCard(params: Schemas.CreateCardSqlRequest) {
    return FlashcardDAL.createCard(params);
  }

  static async bulkCreateCards(params: Schemas.BulkCreateCardsSqlRequest) {
    return FlashcardDAL.bulkCreateCards(params);
  }

  static async deleteCard(cardId: string) {
    return FlashcardDAL.deleteCard(cardId);
  }

  // ── Reviews ────────────────────────────────────────────────────────────────

  static async getDueCards(params: Schemas.GetDueCardsSqlRequest) {
    return FlashcardDAL.getDueCards(params);
  }

  static async submitReview(
    params: Schemas.SubmitReviewSqlRequest,
  ): Promise<Schemas.SubmitReviewResponse> {
    const response: Schemas.SubmitReviewResponse = {
      isSuccess: false,
      message: "Failed to submit review",
      schedule: null,
    };

    try {
      // Fetch current schedule (defaults if none exists)
      const existingCards = await FlashcardDAL.getDueCards({
        userId: params.userId,
        limit: 1,
      });

      // Find this card's current schedule or use defaults
      const existing = existingCards.cards.find((c) => c.id === params.cardId);
      const currentSchedule = existing?.schedule ?? {
        easinessFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextDue: new Date(),
      };

      const next = sm2(
        params.quality,
        currentSchedule.repetitions,
        currentSchedule.easinessFactor,
        currentSchedule.interval,
      );

      const [updatedSchedule] = await Promise.all([
        FlashcardDAL.upsertSchedule(params.cardId, params.userId, next),
        FlashcardDAL.recordReview(params),
      ]);

      response.isSuccess = true;
      response.message = "Review submitted successfully";
      response.schedule = updatedSchedule;
    } catch (error) {
      response.isSuccess = false;
      response.message = "Failed to submit review";
    }

    return response;
  }

  static async getStats(userId: string, deckId?: string) {
    return FlashcardDAL.getStats(userId, deckId);
  }
}

export default FlashcardRepo;
