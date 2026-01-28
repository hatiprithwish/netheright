import { db } from "@/backend/db";
import { eq, desc } from "drizzle-orm";
import {
  sdiSessions,
  aiChats,
  hldDiagrams,
  sdiScorecards,
} from "@/backend/db/models";
import * as Schemas from "@/schemas";

class InterviewDAL {
  // Session Management
  static async createSession({
    userId,
    problemId,
  }: Schemas.CreateSessionParams) {
    const [session] = await db
      .insert(sdiSessions)
      .values({
        userId,
        problemId,
        status: Schemas.InterviewSessionStatus.Active,
        currentPhase: Schemas.InterviewPhase.Requirements,
      })
      .returning();
    return session;
  }

  static async getSession(sessionId: bigint) {
    return await db.query.sdiSessions.findFirst({
      where: eq(sdiSessions.id, sessionId),
    });
  }

  static async updateSessionPhase(
    sessionId: bigint,
    phase: Schemas.InterviewPhase,
  ) {
    const [updated] = await db
      .update(sdiSessions)
      .set({ currentPhase: phase })
      .where(eq(sdiSessions.id, sessionId))
      .returning();
    return updated;
  }

  static async endSession(sessionId: bigint) {
    const [ended] = await db
      .update(sdiSessions)
      .set({
        status: Schemas.InterviewSessionStatus.Completed,
        endTime: new Date(),
      })
      .where(eq(sdiSessions.id, sessionId))
      .returning();
    return ended;
  }

  // Messages
  static async addMessage({
    sessionId,
    role,
    content,
    phase,
  }: Schemas.AddMessageParams) {
    const [message] = await db
      .insert(aiChats)
      .values({
        sessionId,
        role,
        content,
        phase,
      })
      .returning();
    return message;
  }

  static async getSessionMessages(sessionId: bigint) {
    return await db.query.aiChats.findMany({
      where: eq(aiChats.sessionId, sessionId),
      orderBy: [desc(aiChats.createdAt)],
    });
  }

  // Diagrams
  static async saveDiagram({
    sessionId,
    topology,
    rawReactFlow,
    phase,
    userId,
  }: Schemas.SaveDiagramParams) {
    const [diagram] = await db
      .insert(hldDiagrams)
      .values({
        sessionId,
        topology,
        rawReactFlow,
        phase,
        createdBy: userId,
        updatedBy: userId,
      })
      .returning();
    return diagram;
  }

  static async getLatestDiagram(sessionId: bigint) {
    return await db.query.hldDiagrams.findFirst({
      where: eq(hldDiagrams.sessionId, sessionId),
      orderBy: [desc(hldDiagrams.createdAt)],
    });
  }

  // Scorecards
  static async createScorecard(data: typeof sdiScorecards.$inferInsert) {
    const [scorecard] = await db.insert(sdiScorecards).values(data).returning();
    return scorecard;
  }

  static async getScorecard(sessionId: bigint) {
    return await db.query.sdiScorecards.findFirst({
      where: eq(sdiScorecards.sessionId, sessionId),
    });
  }
}

export default InterviewDAL;
