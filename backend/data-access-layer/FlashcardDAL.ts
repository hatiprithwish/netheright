import neonDBClient from "@/lib/neon-db";
import { and, count, eq, lte, sql } from "drizzle-orm";
import { cards, card_schedules, card_reviews, decks } from "@/backend/db/tables";
import * as Schemas from "@/schemas";
import Log from "@/lib/pino/Log";

class FlashcardDAL {
  // ── Decks ──────────────────────────────────────────────────────────────────

  static async getDecks(userId: string): Promise<Schemas.GetDecksResponse> {
    const response: Schemas.GetDecksResponse = {
      isSuccess: true,
      message: "Decks fetched successfully",
      decks: [],
    };
    try {
      const now = new Date();
      const rows = await neonDBClient
        .select({
          id: decks.id,
          name: decks.name,
          description: decks.description,
          createdAt: decks.created_at,
          cardCount: count(cards.id),
          dueCount: sql<number>`COUNT(CASE WHEN ${card_schedules.next_due} <= ${now} OR ${card_schedules.id} IS NULL THEN 1 END)`,
        })
        .from(decks)
        .leftJoin(cards, eq(cards.deck_id, decks.id))
        .leftJoin(
          card_schedules,
          and(
            eq(card_schedules.card_id, cards.id),
            eq(card_schedules.user_id, userId),
          ),
        )
        .where(eq(decks.user_id, userId))
        .groupBy(decks.id);

      response.decks = rows.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        cardCount: Number(r.cardCount),
        dueCount: Number(r.dueCount),
        createdAt: r.createdAt,
      }));
    } catch (error) {
      Log.error({ err: error, msg: "Failed to fetch decks" });
      response.isSuccess = false;
      response.message = "Failed to fetch decks";
    }
    return response;
  }

  static async getDeck(
    deckId: string,
    userId: string,
  ): Promise<Schemas.GetDeckResponse> {
    const response: Schemas.GetDeckResponse = {
      isSuccess: true,
      message: "Deck fetched successfully",
      deck: null,
    };
    try {
      const now = new Date();
      const [row] = await neonDBClient
        .select({
          id: decks.id,
          name: decks.name,
          description: decks.description,
          createdAt: decks.created_at,
          cardCount: count(cards.id),
          dueCount: sql<number>`COUNT(CASE WHEN ${card_schedules.next_due} <= ${now} OR ${card_schedules.id} IS NULL THEN 1 END)`,
        })
        .from(decks)
        .leftJoin(cards, eq(cards.deck_id, decks.id))
        .leftJoin(
          card_schedules,
          and(
            eq(card_schedules.card_id, cards.id),
            eq(card_schedules.user_id, userId),
          ),
        )
        .where(and(eq(decks.id, deckId), eq(decks.user_id, userId)))
        .groupBy(decks.id);

      if (!row) {
        response.isSuccess = false;
        response.message = "Deck not found";
        return response;
      }

      response.deck = {
        id: row.id,
        name: row.name,
        description: row.description,
        cardCount: Number(row.cardCount),
        dueCount: Number(row.dueCount),
        createdAt: row.createdAt,
      };
    } catch (error) {
      Log.error({ err: error, msg: "Failed to fetch deck" });
      response.isSuccess = false;
      response.message = "Failed to fetch deck";
    }
    return response;
  }

  static async createDeck(
    params: Schemas.CreateDeckSqlRequest,
  ): Promise<Schemas.CreateDeckResponse> {
    const response: Schemas.CreateDeckResponse = {
      isSuccess: false,
      message: "Failed to create deck",
      deck: null,
    };
    try {
      const [inserted] = await neonDBClient
        .insert(decks)
        .values({
          user_id: params.userId,
          name: params.name,
          description: params.description,
        })
        .returning({ id: decks.id });

      const fetched = await this.getDeck(inserted.id, params.userId);
      response.deck = fetched.deck;
      response.isSuccess = true;
      response.message = "Deck created successfully";
    } catch (error) {
      Log.error({ err: error, msg: "Failed to create deck" });
    }
    return response;
  }

  static async updateDeck(
    params: Schemas.UpdateDeckSqlRequest,
  ): Promise<Schemas.UpdateDeckResponse> {
    const response: Schemas.UpdateDeckResponse = {
      isSuccess: false,
      message: "Failed to update deck",
      deck: null,
    };
    try {
      await neonDBClient
        .update(decks)
        .set({
          ...(params.name && { name: params.name }),
          ...(params.description !== undefined && {
            description: params.description,
          }),
          updated_at: new Date(),
        })
        .where(and(eq(decks.id, params.deckId), eq(decks.user_id, params.userId)));

      const fetched = await this.getDeck(params.deckId, params.userId);
      response.deck = fetched.deck;
      response.isSuccess = true;
      response.message = "Deck updated successfully";
    } catch (error) {
      Log.error({ err: error, msg: "Failed to update deck" });
    }
    return response;
  }

  static async deleteDeck(
    deckId: string,
    userId: string,
  ): Promise<Schemas.DeleteDeckResponse> {
    const response: Schemas.DeleteDeckResponse = {
      isSuccess: false,
      message: "Failed to delete deck",
    };
    try {
      await neonDBClient
        .delete(decks)
        .where(and(eq(decks.id, deckId), eq(decks.user_id, userId)));
      response.isSuccess = true;
      response.message = "Deck deleted successfully";
    } catch (error) {
      Log.error({ err: error, msg: "Failed to delete deck" });
    }
    return response;
  }

  // ── Cards ──────────────────────────────────────────────────────────────────

  static async getCards(
    deckId: string,
    userId: string,
  ): Promise<Schemas.GetCardsResponse> {
    const response: Schemas.GetCardsResponse = {
      isSuccess: true,
      message: "Cards fetched successfully",
      cards: [],
    };
    try {
      const rows = await neonDBClient
        .select({
          id: cards.id,
          deckId: cards.deck_id,
          front: cards.front,
          back: cards.back,
          tags: cards.tags,
          createdAt: cards.created_at,
          easinessFactor: card_schedules.easiness_factor,
          interval: card_schedules.interval,
          repetitions: card_schedules.repetitions,
          nextDue: card_schedules.next_due,
        })
        .from(cards)
        .leftJoin(
          card_schedules,
          and(
            eq(card_schedules.card_id, cards.id),
            eq(card_schedules.user_id, userId),
          ),
        )
        .where(eq(cards.deck_id, deckId));

      response.cards = rows.map((r) => ({
        id: r.id,
        deckId: r.deckId,
        front: r.front,
        back: r.back,
        tags: r.tags,
        createdAt: r.createdAt,
        schedule: r.easinessFactor != null
          ? {
              easinessFactor: r.easinessFactor,
              interval: r.interval!,
              repetitions: r.repetitions!,
              nextDue: r.nextDue!,
            }
          : undefined,
      }));
    } catch (error) {
      Log.error({ err: error, msg: "Failed to fetch cards" });
      response.isSuccess = false;
      response.message = "Failed to fetch cards";
    }
    return response;
  }

  static async createCard(
    params: Schemas.CreateCardSqlRequest,
  ): Promise<Schemas.CreateCardResponse> {
    const response: Schemas.CreateCardResponse = {
      isSuccess: false,
      message: "Failed to create card",
      card: null,
    };
    try {
      const [inserted] = await neonDBClient
        .insert(cards)
        .values({
          deck_id: params.deckId,
          front: params.front,
          back: params.back,
          tags: params.tags,
        })
        .returning();

      response.card = {
        id: inserted.id,
        deckId: inserted.deck_id,
        front: inserted.front,
        back: inserted.back,
        tags: inserted.tags,
        createdAt: inserted.created_at,
      };
      response.isSuccess = true;
      response.message = "Card created successfully";
    } catch (error) {
      Log.error({ err: error, msg: "Failed to create card" });
    }
    return response;
  }

  static async bulkCreateCards(
    params: Schemas.BulkCreateCardsSqlRequest,
  ): Promise<Schemas.BulkCreateCardsResponse> {
    const response: Schemas.BulkCreateCardsResponse = {
      isSuccess: false,
      message: "Failed to create cards",
      cards: [],
    };
    try {
      const inserted = await neonDBClient
        .insert(cards)
        .values(
          params.cards.map((c) => ({
            deck_id: params.deckId,
            front: c.front,
            back: c.back,
            tags: c.tags,
          })),
        )
        .returning();

      response.cards = inserted.map((r) => ({
        id: r.id,
        deckId: r.deck_id,
        front: r.front,
        back: r.back,
        tags: r.tags,
        createdAt: r.created_at,
      }));
      response.isSuccess = true;
      response.message = `${inserted.length} cards created successfully`;
    } catch (error) {
      Log.error({ err: error, msg: "Failed to bulk create cards" });
    }
    return response;
  }

  static async deleteCard(cardId: string): Promise<Schemas.DeleteCardResponse> {
    const response: Schemas.DeleteCardResponse = {
      isSuccess: false,
      message: "Failed to delete card",
    };
    try {
      await neonDBClient.delete(cards).where(eq(cards.id, cardId));
      response.isSuccess = true;
      response.message = "Card deleted successfully";
    } catch (error) {
      Log.error({ err: error, msg: "Failed to delete card" });
    }
    return response;
  }

  // ── Reviews & Scheduling ───────────────────────────────────────────────────

  static async getDueCards(
    params: Schemas.GetDueCardsSqlRequest,
  ): Promise<Schemas.GetDueCardsResponse> {
    const response: Schemas.GetDueCardsResponse = {
      isSuccess: true,
      message: "Due cards fetched successfully",
      cards: [],
      totalDue: 0,
    };
    try {
      const now = new Date();
      const limit = params.limit ?? 20;

      const whereConditions = [
        params.deckId ? eq(cards.deck_id, params.deckId) : undefined,
      ].filter(Boolean);

      // Cards with no schedule row are always due (never reviewed)
      const rows = await neonDBClient
        .select({
          id: cards.id,
          deckId: cards.deck_id,
          front: cards.front,
          back: cards.back,
          tags: cards.tags,
          createdAt: cards.created_at,
          easinessFactor: card_schedules.easiness_factor,
          interval: card_schedules.interval,
          repetitions: card_schedules.repetitions,
          nextDue: card_schedules.next_due,
        })
        .from(cards)
        .innerJoin(decks, eq(decks.id, cards.deck_id))
        .leftJoin(
          card_schedules,
          and(
            eq(card_schedules.card_id, cards.id),
            eq(card_schedules.user_id, params.userId),
          ),
        )
        .where(
          and(
            eq(decks.user_id, params.userId),
            ...whereConditions,
            sql`(${card_schedules.next_due} IS NULL OR ${card_schedules.next_due} <= ${now})`,
          ),
        )
        .limit(limit);

      response.cards = rows.map((r) => ({
        id: r.id,
        deckId: r.deckId,
        front: r.front,
        back: r.back,
        tags: r.tags,
        createdAt: r.createdAt,
        schedule: r.easinessFactor != null
          ? {
              easinessFactor: r.easinessFactor,
              interval: r.interval!,
              repetitions: r.repetitions!,
              nextDue: r.nextDue!,
            }
          : undefined,
      }));
      response.totalDue = rows.length;
    } catch (error) {
      Log.error({ err: error, msg: "Failed to fetch due cards" });
      response.isSuccess = false;
      response.message = "Failed to fetch due cards";
    }
    return response;
  }

  static async upsertSchedule(
    cardId: string,
    userId: string,
    schedule: {
      easinessFactor: number;
      interval: number;
      repetitions: number;
      nextDue: Date;
    },
  ): Promise<Schemas.CardSchedule> {
    const [row] = await neonDBClient
      .insert(card_schedules)
      .values({
        card_id: cardId,
        user_id: userId,
        easiness_factor: schedule.easinessFactor,
        interval: schedule.interval,
        repetitions: schedule.repetitions,
        next_due: schedule.nextDue,
        updated_at: new Date(),
      })
      .onConflictDoUpdate({
        target: [card_schedules.card_id, card_schedules.user_id],
        set: {
          easiness_factor: schedule.easinessFactor,
          interval: schedule.interval,
          repetitions: schedule.repetitions,
          next_due: schedule.nextDue,
          updated_at: new Date(),
        },
      })
      .returning();

    return {
      easinessFactor: row.easiness_factor,
      interval: row.interval,
      repetitions: row.repetitions,
      nextDue: row.next_due,
    };
  }

  static async recordReview(
    params: Schemas.SubmitReviewSqlRequest,
  ): Promise<void> {
    await neonDBClient.insert(card_reviews).values({
      card_id: params.cardId,
      user_id: params.userId,
      quality: params.quality,
    });
  }

  static async getStats(
    userId: string,
    deckId?: string,
  ): Promise<Schemas.GetStatsResponse> {
    const response: Schemas.GetStatsResponse = {
      isSuccess: true,
      message: "Stats fetched successfully",
      stats: null,
    };
    try {
      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const deckFilter = deckId
        ? eq(cards.deck_id, deckId)
        : undefined;

      const [totalRow] = await neonDBClient
        .select({ count: count() })
        .from(cards)
        .innerJoin(decks, and(eq(decks.id, cards.deck_id), eq(decks.user_id, userId)))
        .where(deckFilter);

      const [dueRow] = await neonDBClient
        .select({ count: count() })
        .from(cards)
        .innerJoin(decks, and(eq(decks.id, cards.deck_id), eq(decks.user_id, userId)))
        .leftJoin(
          card_schedules,
          and(eq(card_schedules.card_id, cards.id), eq(card_schedules.user_id, userId)),
        )
        .where(
          and(
            deckFilter,
            sql`(${card_schedules.next_due} IS NULL OR ${card_schedules.next_due} <= ${now})`,
          ),
        );

      const [reviewedTodayRow] = await neonDBClient
        .select({ count: count() })
        .from(card_reviews)
        .where(
          and(
            eq(card_reviews.user_id, userId),
            lte(sql`DATE(${card_reviews.reviewed_at})`, sql`DATE(${now})`),
          ),
        );

      const [totalReviewsRow] = await neonDBClient
        .select({ count: count() })
        .from(card_reviews)
        .where(eq(card_reviews.user_id, userId));

      response.stats = {
        totalCards: Number(totalRow.count),
        dueToday: Number(dueRow.count),
        reviewedToday: Number(reviewedTodayRow.count),
        totalReviews: Number(totalReviewsRow.count),
      };
    } catch (error) {
      Log.error({ err: error, msg: "Failed to fetch stats" });
      response.isSuccess = false;
      response.message = "Failed to fetch stats";
    }
    return response;
  }
}

export default FlashcardDAL;
