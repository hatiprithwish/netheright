import { db } from "@/backend/db";
import { eq, desc } from "drizzle-orm";
import {
  sdiSessions,
  aiChats,
  redFlags,
  hldDiagrams,
  sdiScorecards,
} from "@/backend/db/models";
import * as Schemas from "@/schemas";

class InterviewDAL {
  static async createInterviewSession(
    params: Schemas.CreateInterviewSessionSqlRequest,
  ) {
    const response: Schemas.CreateInterviewSessionResponse = {
      isSuccess: false,
      message: "Failed to create interview session",
      session: null,
    };
    try {
      const [session] = await db
        .insert(sdiSessions)
        .values({
          userId: params.userId,
          problemId: params.problemId,
          status: Schemas.InterviewSessionStatusIntEnum.Active,
          currentPhase: Schemas.InterviewPhaseIntEnum.RequirementsGathering,
        })
        .returning();

      response.session = {
        id: session.id,
        userId: session.userId,
        problemId: session.problemId,
        status: session.status,
        statusLabel:
          Schemas.interviewSessionStatusIntToLabel[
            session.status as Schemas.InterviewSessionStatusIntEnum
          ],
        currentPhase: session.currentPhase,
        currentPhaseLabel:
          Schemas.interviewPhaseIntToLabel[
            session.currentPhase as Schemas.InterviewPhaseIntEnum
          ],
        createdAt: session.createdAt.toISOString(),
      };

      response.isSuccess = true;
      response.message = "Interview session created successfully";
    } catch (error) {
      console.log(error);
    }
    return response;
  }

  static async getSession(sessionId: string) {
    return await db.query.sdiSessions.findFirst({
      where: eq(sdiSessions.id, sessionId),
    });
  }

  static async updateSessionPhase(
    sessionId: string,
    phase: Schemas.InterviewPhaseIntEnum,
  ) {
    const [updated] = await db
      .update(sdiSessions)
      .set({ currentPhase: phase })
      .where(eq(sdiSessions.id, sessionId))
      .returning();
    return updated;
  }

  static async endSession(sessionId: string) {
    const [ended] = await db
      .update(sdiSessions)
      .set({
        status: Schemas.InterviewSessionStatusIntEnum.Completed,
        endTime: new Date(),
      })
      .where(eq(sdiSessions.id, sessionId))
      .returning();
    return ended;
  }

  static async createMessageInAiChats(params: Schemas.CreateMessageSqlRequest) {
    const [message] = await db
      .insert(aiChats)
      .values({
        sessionId: params.sessionId,
        role: params.role,
        content: params.content,
        phase: params.phase,
      })
      .returning();
    return message;
  }

  static async getSessionMessages(sessionId: string) {
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

  static async getLatestDiagram(sessionId: string) {
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

  static async getScorecard(sessionId: string) {
    return await db.query.sdiScorecards.findFirst({
      where: eq(sdiScorecards.sessionId, sessionId),
    });
  }

  // Red Flags
  static async createRedFlag(data: Schemas.CreateRedFlagSqlRequest) {
    const [redFlag] = await db
      .insert(redFlags)
      .values({
        sessionId: data.sessionId,
        type: data.type,
        reason: data.reason,
        phase: data.phase,
      })
      .returning();
    return redFlag;
  }

  static async getSessionRedFlags(sessionId: string) {
    return await db.query.redFlags.findMany({
      where: eq(redFlags.sessionId, sessionId),
      orderBy: [desc(redFlags.createdAt)],
    });
  }
}

export default InterviewDAL;
