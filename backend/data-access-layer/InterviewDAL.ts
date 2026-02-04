import { db } from "@/backend/db";
import { eq } from "drizzle-orm";
import {
  sdiSessions,
  aiChats,
  redFlags,
  sdiProblems,
  sdiScorecards,
} from "@/backend/db/models";
import * as Schemas from "@/schemas";

class InterviewDAL {
  static async getSdiProblemDetails(problemId: number) {
    let response: Schemas.GetSdiProblemDetailsResponse = {
      isSuccess: false,
      message: "Failed to get sdi problem details",
      problem: null,
    };

    try {
      const [dbResult] = await db
        .select({
          id: sdiProblems.id,
          title: sdiProblems.title,
          description: sdiProblems.description,
          functionalRequirements: sdiProblems.functionalRequirements,
          nonFunctionalRequirements: sdiProblems.nonFunctionalRequirements,
          boteFactors: sdiProblems.boteFactors,
        })
        .from(sdiProblems)
        .where(eq(sdiProblems.id, BigInt(problemId)))
        .limit(1);

      response.problem = {
        ...dbResult,
        id: Number(dbResult.id),
        functionalRequirements: dbResult.functionalRequirements.join("\n"),
        nonFunctionalRequirements:
          dbResult.nonFunctionalRequirements.join("\n"),
        boteFactors: dbResult.boteFactors.join("\n"),
      };

      response.isSuccess = true;
      response.message = "Sdi problem details fetched successfully";
      return response;
    } catch (error) {
      return response;
    }
  }

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

  static async updateInterviewPhase(
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

  static async endInterviewSession(sessionId: string) {
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

  static async getMessagesBySession(
    sessionId: string,
    upToPhase?: Schemas.InterviewPhaseIntEnum,
  ) {
    let query = db
      .select({
        id: aiChats.id,
        role: aiChats.role,
        content: aiChats.content,
        phase: aiChats.phase,
        createdAt: aiChats.createdAt,
      })
      .from(aiChats)
      .where(eq(aiChats.sessionId, sessionId));

    const messages = await query.orderBy(aiChats.createdAt);

    // Filter by phase if specified (include messages up to and including the specified phase)
    const filteredMessages = upToPhase
      ? messages.filter((msg) => msg.phase <= upToPhase)
      : messages;

    return filteredMessages.map((msg) => ({
      id: msg.id.toString(),
      role: Schemas.chatRoleIntToLabel[msg.role as Schemas.ChatRoleIntEnum],
      content: msg.content as string,
    }));
  }

  static async createScorecard(data: Schemas.CreateScorecardSqlRequest) {
    const [scorecard] = await db
      .insert(sdiScorecards)
      .values({
        sessionId: data.sessionId,
        overallGrade: data.overallGrade,
        requirementsGathering: data.requirementsGathering,
        dataModeling: data.dataModeling,
        tradeOffAnalysis: data.tradeOffAnalysis,
        scalability: data.scalability,
        strengths: data.strengths,
        growthAreas: data.growthAreas,
        actionableFeedback: data.actionableFeedback,
      })
      .returning();
    return scorecard;
  }
}

export default InterviewDAL;
