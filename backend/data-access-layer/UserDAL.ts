import { db } from "@/backend/db";
import { count, eq, desc, asc, ne, and } from "drizzle-orm";
import {
  interviews,
  sdiProblems,
  sdiScorecards,
  features,
  roleFeatures,
} from "@/backend/db/models";
import * as Schemas from "@/schemas";
import CacheManager from "@/lib/CacheManager";
import Constants from "@/constants";

class UserDAL {
  static async getInterviewsByUser(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
    sortBy: Schemas.InterviewSortColumn = Schemas.InterviewSortColumn.Date,
    sortOrder: Schemas.SortDirection = Schemas.SortDirection.Desc,
  ) {
    const orderColumn = resolveOrderColumn(sortBy);
    const orderFn = sortOrder === Schemas.SortDirection.Asc ? asc : desc;

    const results = await db
      .select({
        sessionId: interviews.id,
        problemId: interviews.problemId,
        problemTitle: sdiProblems.title,
        status: interviews.status,
        currentPhase: interviews.currentPhase,
        startTime: interviews.startTime,
        endTime: interviews.endTime,
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
      .orderBy(orderFn(orderColumn))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return results.map((row) => mapInterviewRow(row));
  }

  static async getInterviewsCountByUser(userId: string) {
    const rows = await db
      .select({ status: interviews.status, cnt: count() })
      .from(interviews)
      .where(
        and(
          eq(interviews.userId, userId),
          ne(interviews.status, Schemas.InterviewStatusIntEnum.Deleted),
        ),
      )
      .groupBy(interviews.status);

    let total = 0;
    let completed = 0;
    let inProgress = 0;
    let abandoned = 0;

    for (const row of rows) {
      total += row.cnt;
      if (row.status === Schemas.InterviewStatusIntEnum.Completed)
        completed += row.cnt;
      else if (row.status === Schemas.InterviewStatusIntEnum.Active)
        inProgress += row.cnt;
      else if (row.status === Schemas.InterviewStatusIntEnum.Abandoned)
        abandoned += row.cnt;
    }

    return { total, completed, inProgress, abandoned };
  }

  static async getFeaturesByRole(roleId: string): Promise<string[]> {
    return CacheManager.get(
      `role_features_${roleId}`,
      async () => {
        const rows = await db
          .select({ featureId: roleFeatures.featureId })
          .from(roleFeatures)
          .where(eq(roleFeatures.roleId, roleId));
        return rows.map((r) => r.featureId);
      },
      Constants.DEFAULT_CACHE_KEY_TTL,
    );
  }
}

function resolveOrderColumn(sortBy: Schemas.InterviewSortColumn) {
  switch (sortBy) {
    case Schemas.InterviewSortColumn.Id:
      return interviews.id;
    case Schemas.InterviewSortColumn.Status:
      return interviews.status;
    case Schemas.InterviewSortColumn.Date:
    default:
      return interviews.createdAt;
  }
}

function mapInterviewRow(row: {
  sessionId: string;
  problemId: number;
  problemTitle: string | null;
  status: number;
  currentPhase: number;
  startTime: Date;
  endTime: Date | null;
  overallGrade: number | null;
  requirementsGathering: number | null;
  dataModeling: number | null;
  tradeOffAnalysis: number | null;
  scalability: number | null;
  strengths: string[] | null;
  growthAreas: string[] | null;
  actionableFeedback: string | null;
}): Schemas.InterviewHistoryItem {
  return {
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
  };
}

export default UserDAL;
