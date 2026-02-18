import { db } from "@/backend/db";
import { eq, sql } from "drizzle-orm";
import {
  interviews,
  aiChats,
  redFlags,
  sdiProblems,
  sdiScorecards,
} from "@/backend/db/models";
import * as Schemas from "@/schemas";

class InterviewDAL {
  static async createInterview(params: Schemas.CreateInterviewSqlRequest) {
    const response: Schemas.CreateInterviewResponse = {
      isSuccess: false,
      message: "Failed to create interview",
      session: null,
    };
    try {
      const [session] = await db
        .insert(interviews)
        .values({
          userId: params.userId,
          problemId: params.problemId,
          status: Schemas.InterviewStatusIntEnum.Active,
          currentPhase: Schemas.InterviewPhaseIntEnum.RequirementsGathering,
        })
        .returning();

      response.session = {
        id: session.id,
        userId: session.userId,
        problemId: session.problemId,
        status: session.status,
        statusLabel:
          Schemas.interviewStatusIntToLabel[
            session.status as Schemas.InterviewStatusIntEnum
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

  static async getInterview(sessionId: string) {
    const response: Schemas.GetInterviewResponse = {
      isSuccess: true,
      message: "",
      session: null,
    };
    try {
      const [session] = await db
        .select({
          id: interviews.id,
          userId: interviews.userId,
          problemId: interviews.problemId,
          status: interviews.status,
          statusLabel: sql<Schemas.InterviewStatusLabelEnum>`CASE
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Completed} THEN ${Schemas.InterviewStatusLabelEnum.Completed}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Abandoned} THEN ${Schemas.InterviewStatusLabelEnum.Abandoned}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Deleted} THEN ${Schemas.InterviewStatusLabelEnum.Deleted}
            ELSE ${Schemas.InterviewStatusLabelEnum.Active}
            END`,
          currentPhase: interviews.currentPhase,
          currentPhaseLabel: sql<Schemas.InterviewPhaseLabelEnum>`CASE
            WHEN ${interviews.currentPhase} = ${Schemas.InterviewPhaseIntEnum.BotECalculation} THEN ${Schemas.InterviewPhaseLabelEnum.BotECalculation}
            WHEN ${interviews.currentPhase} = ${Schemas.InterviewPhaseIntEnum.HighLevelDesign} THEN ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}
            WHEN ${interviews.currentPhase} = ${Schemas.InterviewPhaseIntEnum.ComponentDeepDive} THEN ${Schemas.InterviewPhaseLabelEnum.ComponentDeepDive}
            WHEN ${interviews.currentPhase} = ${Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion} THEN ${Schemas.InterviewPhaseLabelEnum.BottlenecksDiscussion}
            ELSE ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}
            END`,
          createdAt: interviews.createdAt,
        })
        .from(interviews)
        .where(eq(interviews.id, sessionId));

      response.session = {
        ...session,
        createdAt: session.createdAt.toISOString(),
      };

      response.message = "Interview session fetched successfully";
    } catch (error) {
      response.isSuccess = false;
      response.message = "Failed to fetch interview session";
    }
    return response;
  }

  static async updateInterviewPhase(
    sessionId: string,
    phase: Schemas.InterviewPhaseIntEnum,
  ) {
    const [updated] = await db
      .update(interviews)
      .set({ currentPhase: phase })
      .where(eq(interviews.id, sessionId))
      .returning();
    return updated;
  }

  static async endInterviewSession(sessionId: string) {
    const [ended] = await db
      .update(interviews)
      .set({
        status: Schemas.InterviewStatusIntEnum.Completed,
        endTime: new Date(),
      })
      .where(eq(interviews.id, sessionId))
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
    exactPhase?: Schemas.InterviewPhaseIntEnum,
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

    // Filter by phase if specified
    let filteredMessages = messages;

    if (exactPhase !== undefined) {
      // Return only messages from the exact phase
      filteredMessages = messages.filter((msg) => msg.phase === exactPhase);
    } else if (upToPhase !== undefined) {
      // Return messages up to and including the specified phase
      filteredMessages = messages.filter((msg) => msg.phase <= upToPhase);
    }

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

  static async getInterviewFeedbackDetails(sessionId: string, userId: string) {
    const result = await db
      .select({
        overallGrade: sdiScorecards.overallGrade,
        requirementsGathering: sdiScorecards.requirementsGathering,
        dataModeling: sdiScorecards.dataModeling,
        tradeOffAnalysis: sdiScorecards.tradeOffAnalysis,
        scalability: sdiScorecards.scalability,
        strengths: sdiScorecards.strengths,
        growthAreas: sdiScorecards.growthAreas,
        actionableFeedback: sdiScorecards.actionableFeedback,
      })
      .from(sdiScorecards)
      .innerJoin(interviews, eq(sdiScorecards.sessionId, interviews.id))
      .where(
        sql`${sdiScorecards.sessionId} = ${sessionId} AND ${interviews.userId} = ${userId}`,
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  static async updateInterviewSessionStatus(
    sessionId: string,
    status: Schemas.InterviewStatusIntEnum,
  ) {
    const [updated] = await db
      .update(interviews)
      .set({
        status,
        endTime: new Date(),
      })
      .where(eq(interviews.id, sessionId))
      .returning();

    if (!updated) {
      return {
        isSuccess: false,
        message: "Interview session not found",
      };
    }

    return {
      isSuccess: true,
      message: "Interview session status updated successfully",
    };
  }
}

export default InterviewDAL;
