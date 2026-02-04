import { db } from "@/backend/db";
import { eq, desc } from "drizzle-orm";
import { sdiSessions, sdiProblems, sdiScorecards } from "@/backend/db/models";
import * as Schemas from "@/schemas";

class DashboardDAL {
  static async getUserInterviewsWithScorecards(userId: string) {
    const results = await db
      .select({
        sessionId: sdiSessions.id,
        problemId: sdiSessions.problemId,
        problemTitle: sdiProblems.title,
        status: sdiSessions.status,
        currentPhase: sdiSessions.currentPhase,
        startTime: sdiSessions.startTime,
        endTime: sdiSessions.endTime,
        // Scorecard fields
        overallGrade: sdiScorecards.overallGrade,
        requirementsGathering: sdiScorecards.requirementsGathering,
        dataModeling: sdiScorecards.dataModeling,
        tradeOffAnalysis: sdiScorecards.tradeOffAnalysis,
        scalability: sdiScorecards.scalability,
        strengths: sdiScorecards.strengths,
        growthAreas: sdiScorecards.growthAreas,
        actionableFeedback: sdiScorecards.actionableFeedback,
      })
      .from(sdiSessions)
      .leftJoin(sdiProblems, eq(sdiSessions.problemId, sdiProblems.id))
      .leftJoin(sdiScorecards, eq(sdiSessions.id, sdiScorecards.sessionId))
      .where(eq(sdiSessions.userId, userId))
      .orderBy(desc(sdiSessions.createdAt));

    return results.map((row) => ({
      sessionId: row.sessionId,
      problemId: row.problemId,
      problemTitle: row.problemTitle ?? "Unknown Problem",
      status: row.status,
      statusLabel:
        Schemas.interviewSessionStatusIntToLabel[
          row.status as Schemas.InterviewSessionStatusIntEnum
        ],
      currentPhase: row.currentPhase,
      currentPhaseLabel:
        Schemas.interviewPhaseIntToLabel[
          row.currentPhase as Schemas.InterviewPhaseIntEnum
        ],
      startTime: row.startTime.toISOString(),
      endTime: row.endTime ? row.endTime.toISOString() : null,
      scorecard: row.overallGrade
        ? {
            overallGrade: row.overallGrade,
            requirementsGathering: row.requirementsGathering!,
            dataModeling: row.dataModeling!,
            tradeOffAnalysis: row.tradeOffAnalysis!,
            scalability: row.scalability!,
            strengths: row.strengths!,
            growthAreas: row.growthAreas!,
            actionableFeedback: row.actionableFeedback!,
          }
        : null,
    }));
  }
}

export default DashboardDAL;
