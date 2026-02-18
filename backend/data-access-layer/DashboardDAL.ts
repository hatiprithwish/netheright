import { db } from "@/backend/db";
import { eq, desc, ne, and } from "drizzle-orm";
import { interviews, sdiProblems, sdiScorecards } from "@/backend/db/models";
import * as Schemas from "@/schemas";

class DashboardDAL {
  static async getUserInterviewsWithScorecards(userId: string) {
    const results = await db
      .select({
        sessionId: interviews.id,
        problemId: interviews.problemId,
        problemTitle: sdiProblems.title,
        status: interviews.status,
        currentPhase: interviews.currentPhase,
        startTime: interviews.startTime,
        endTime: interviews.endTime,
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
      .from(interviews)
      .leftJoin(sdiProblems, eq(interviews.problemId, sdiProblems.id))
      .leftJoin(sdiScorecards, eq(interviews.id, sdiScorecards.sessionId))
      .where(
        and(
          eq(interviews.userId, userId),
          ne(interviews.status, Schemas.InterviewStatusIntEnum.Deleted),
        ),
      )
      .orderBy(desc(interviews.createdAt));

    return results.map((row) => ({
      sessionId: row.sessionId,
      problemId: row.problemId,
      problemTitle: row.problemTitle ?? "Unknown Problem",
      status: row.status,
      statusLabel:
        Schemas.interviewStatusIntToLabel[
          row.status as Schemas.InterviewStatusIntEnum
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
