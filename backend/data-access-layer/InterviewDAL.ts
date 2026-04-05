import neonDBClient from "@/lib/neon-db";
import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import {
  interview_chats,
  interviews,
  problems,
  scorecards,
} from "@/backend/db/tables";
import * as Schemas from "@/schemas";
import Log from "@/lib/pino/Log";

class InterviewDAL {
  static async createInterview(params: Schemas.CreateInterviewSqlRequest) {
    const response: Schemas.CreateInterviewResponse = {
      isSuccess: false,
      message: "Failed to create interview",
      interview: null,
    };
    try {
      const [interview] = await neonDBClient
        .insert(interviews)
        .values({
          user_id: params.userId,
          problem_id: params.problemId,
          status: Schemas.InterviewStatusIntEnum.Active,
          phase: Schemas.InterviewPhaseIntEnum.RequirementsGathering,
        })
        .returning({ id: interviews.id });

      const interviewDetailsResponse = await this.getInterview({
        interviewId: interview.id,
      });

      response.interview = interviewDetailsResponse.interview;
      response.isSuccess = true;
      response.message = "Interview session created successfully";
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while creating interview",
      });
      response.isSuccess = false;
      response.message = "Failed to create interview";
    }
    return response;
  }

  static async getInterview(params: Schemas.GetInterviewSqlRequest) {
    const response: Schemas.GetInterviewResponse = {
      isSuccess: true,
      message: "Interview session fetched successfully",
      interview: null,
    };
    try {
      const result = await neonDBClient
        .select({
          id: interviews.id,
          userId: interviews.user_id,
          problemId: interviews.problem_id,
          problemTitle: problems.title,
          status: interviews.status,
          isTest: interviews.is_test,
          statusLabel: sql<Schemas.InterviewStatusLabelEnum>`CASE
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Completed} THEN ${Schemas.InterviewStatusLabelEnum.Completed}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Abandoned} THEN ${Schemas.InterviewStatusLabelEnum.Abandoned}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Deleted} THEN ${Schemas.InterviewStatusLabelEnum.Deleted}
            ELSE ${Schemas.InterviewStatusLabelEnum.Active}
            END`,
          currentPhase: interviews.phase,
          currentPhaseLabel: sql<Schemas.InterviewPhaseLabelEnum>`CASE
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.BotECalculation} THEN ${Schemas.InterviewPhaseLabelEnum.BotECalculation}
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.HighLevelDesign} THEN ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.ComponentDeepDive} THEN ${Schemas.InterviewPhaseLabelEnum.ComponentDeepDive}
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion} THEN ${Schemas.InterviewPhaseLabelEnum.BottlenecksDiscussion}
            ELSE ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}
            END`,
          createdAt: interviews.created_at,
        })
        .from(interviews)
        .innerJoin(problems, eq(interviews.problem_id, problems.id))
        .where(eq(interviews.id, params.interviewId))
        .limit(1);

      response.interview = result[0];
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching interview session",
      });
      response.isSuccess = false;
      response.message = "Failed to fetch interview session";
    }
    return response;
  }

  static async getInterviews(params: Schemas.GetInterviewsSqlRequest) {
    const response: Schemas.GetInterviewsResponse = {
      isSuccess: true,
      message: "Successfully fetched interviews",
      interviews: [],
    };
    try {
      const sortColumnMap = {
        [Schemas.InterviewSortColumn.Id]: interviews.id,
        [Schemas.InterviewSortColumn.Status]: interviews.status,
        [Schemas.InterviewSortColumn.CreatedAt]: interviews.created_at,
      };
      const sortCol = sortColumnMap[params.sortColumn] ?? interviews.created_at;
      const orderExpr =
        params.sortDirection === "desc" ? desc(sortCol) : asc(sortCol);
      const offset = (params.pageNo - 1) * params.pageSize;

      const result = await neonDBClient
        .select({
          id: interviews.id,
          problemId: interviews.problem_id,
          problemTitle: problems.title,
          userId: interviews.user_id,
          status: interviews.status,
          statusLabel: sql<Schemas.InterviewStatusLabelEnum>`CASE
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Completed} THEN ${Schemas.InterviewStatusLabelEnum.Completed}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Abandoned} THEN ${Schemas.InterviewStatusLabelEnum.Abandoned}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Deleted} THEN ${Schemas.InterviewStatusLabelEnum.Deleted}
            ELSE ${Schemas.InterviewStatusLabelEnum.Active}
            END`,
          currentPhase: interviews.phase,
          currentPhaseLabel: sql<Schemas.InterviewPhaseLabelEnum>`CASE
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.BotECalculation} THEN ${Schemas.InterviewPhaseLabelEnum.BotECalculation}
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.HighLevelDesign} THEN ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.ComponentDeepDive} THEN ${Schemas.InterviewPhaseLabelEnum.ComponentDeepDive}
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion} THEN ${Schemas.InterviewPhaseLabelEnum.BottlenecksDiscussion}
            ELSE ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}
            END`,
          overallGrade: scorecards.overall_grade,
          createdAt: interviews.created_at,
        })
        .from(interviews)
        .innerJoin(problems, eq(interviews.problem_id, problems.id))
        .leftJoin(scorecards, eq(interviews.id, scorecards.interview_id))
        .where(() => {
          const conditions = [];
          conditions.push(eq(interviews.user_id, params.userId));
          conditions.push(
            ne(interviews.status, Schemas.InterviewStatusIntEnum.Deleted),
          );
          if (params.status) {
            conditions.push(eq(interviews.status, params.status));
          }
          return and(...conditions);
        })
        .orderBy(orderExpr)
        .limit(params.pageSize)
        .offset(offset);

      response.interviews = result.map((r) => ({
        ...r,
        startTime: r.createdAt,
      })) as any;
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching interviews",
      });
      response.isSuccess = false;
      response.message = "Failed to fetch interviews";
    }
    return response;
  }

  static async getInterviewsCount(
    params: Schemas.GetInterviewsCountSqlRequest,
  ) {
    const response: Schemas.TotalRecordsResponse = {
      totalRecords: 0,
      isSuccess: true,
      message: "Successfully fetched interviews count",
    };
    try {
      const result = await neonDBClient
        .select({ count: sql<number>`count(*)` })
        .from(interviews)
        .innerJoin(problems, eq(interviews.problem_id, problems.id))
        .where(() => {
          const conditions = [];
          conditions.push(eq(interviews.user_id, params.userId));
          if (params.status) {
            conditions.push(eq(interviews.status, params.status));
          }
          return and(...conditions);
        });
      response.totalRecords = result[0].count;
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching interviews count",
      });
      response.isSuccess = false;
      response.message = "Failed to fetch interviews count";
    }
    return response;
  }

  static async updateInterview(params: Schemas.UpdateInterviewSqlRequest) {
    const response: Schemas.ApiResponse = {
      isSuccess: true,
      message: "Successfully updated interview",
    };
    try {
      const fieldsToUpdate: Partial<typeof interviews.$inferInsert> = {};
      if (params.phase) {
        fieldsToUpdate.phase = params.phase;
      }
      if (params.status) {
        fieldsToUpdate.status = params.status;
      }
      if (Object.keys(fieldsToUpdate).length > 0) {
        await neonDBClient
          .update(interviews)
          .set(fieldsToUpdate)
          .where(
            (() => {
              const conditions = [];
              conditions.push(eq(interviews.id, params.interviewId));
              return and(...conditions);
            })(),
          );
      }
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while updating interview",
      });
      response.isSuccess = false;
      response.message = "Failed to update interview";
    }
    return response;
  }

  static async createInterviewChat(
    params: Schemas.CreateInterviewChatSqlRequest,
  ) {
    const response: Schemas.ApiResponse = {
      isSuccess: true,
      message: "Successfully created message",
    };
    try {
      await neonDBClient.insert(interview_chats).values({
        interview_id: params.interviewId,
        role: params.role,
        content: params.content,
        phase: params.phase,
      });
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while creating message",
      });
      response.isSuccess = false;
      response.message = "Failed to create message";
    }
    return response;
  }

  static async getInterviewChats(params: Schemas.GetInterviewChatsSqlRequest) {
    const response: Schemas.GetInterviewChatsResponse = {
      isSuccess: true,
      message: "Successfully fetched messages",
      messages: [],
    };
    try {
      let result = await neonDBClient
        .select({
          id: sql<string>`CAST(${interview_chats.id} AS TEXT)`,
          role: sql<Schemas.ChatRoleLabelEnum>`CASE
            WHEN ${interview_chats.role} = ${Schemas.ChatRoleIntEnum.User} THEN ${Schemas.ChatRoleLabelEnum.User}
            WHEN ${interview_chats.role} = ${Schemas.ChatRoleIntEnum.Assistant} THEN ${Schemas.ChatRoleLabelEnum.Assistant}
            ELSE ${Schemas.ChatRoleLabelEnum.User}
            END`,
          content: interview_chats.content,
        })
        .from(interview_chats)
        .where(() => {
          const conditions = [];
          conditions.push(eq(interview_chats.interview_id, params.interviewId));
          return and(...conditions);
        })
        .orderBy(interview_chats.created_at);

      response.messages = result.map((m) => ({
        ...m,
        content: m.content as string,
      }));
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching messages",
      });
      response.isSuccess = false;
      response.message = "Failed to fetch messages";
    }
    return response;
  }

  static async createInterviewScorecard(
    params: Schemas.CreateInterviewScorecardSqlRequest,
  ) {
    const response: Schemas.CreateInterviewScorecardResponse = {
      isSuccess: true,
      message: "Successfully created scorecard",
      scorecard: null,
    };
    try {
      const [result] = await neonDBClient
        .insert(scorecards)
        .values({
          interview_id: params.interviewId,
          overall_grade: params.overallGrade,
          requirements_gathering: params.requirementsGathering,
          data_modeling: params.dataModeling,
          trade_off_analysis: params.tradeOffAnalysis,
          scalability: params.scalability,
          strengths: params.strengths,
          growth_areas: params.growthAreas,
          actionable_feedback: params.actionableFeedback,
        })
        .returning();

      response.scorecard = {
        overallGrade: result.overall_grade,
        categories: {
          requirementsGathering: result.requirements_gathering,
          dataModeling: result.data_modeling,
          tradeOffAnalysis: result.trade_off_analysis,
          scalability: result.scalability,
        },
        strengths: result.strengths,
        growthAreas: result.growth_areas,
        actionableFeedback: result.actionable_feedback,
      };
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while creating scorecard",
      });
      response.isSuccess = false;
      response.message = "Failed to create scorecard";
    }
    return response;
  }

  static async getInterviewScorecard(
    params: Schemas.GetInterviewScorecardSqlRequest,
  ) {
    const response: Schemas.GetInterviewScorecardResponse = {
      isSuccess: true,
      message: "Successfully fetched feedback details",
      scorecard: null,
    };
    try {
      const [result] = await neonDBClient
        .select({
          overallGrade: scorecards.overall_grade,
          requirementsGathering: scorecards.requirements_gathering,
          dataModeling: scorecards.data_modeling,
          tradeOffAnalysis: scorecards.trade_off_analysis,
          scalability: scorecards.scalability,
          strengths: scorecards.strengths,
          growthAreas: scorecards.growth_areas,
          actionableFeedback: scorecards.actionable_feedback,
          interviewStatusLabel: sql<Schemas.InterviewStatusLabelEnum>`CASE
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Completed} THEN ${Schemas.InterviewStatusLabelEnum.Completed}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Abandoned} THEN ${Schemas.InterviewStatusLabelEnum.Abandoned}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Deleted} THEN ${Schemas.InterviewStatusLabelEnum.Deleted}
            ELSE ${Schemas.InterviewStatusLabelEnum.Active}
            END`,
        })
        .from(scorecards)
        .innerJoin(interviews, eq(scorecards.interview_id, interviews.id))
        .where(() => {
          const conditions = [];
          conditions.push(eq(scorecards.interview_id, params.interviewId));
          conditions.push(eq(interviews.user_id, params.userId));
          return and(...conditions);
        })
        .limit(1);

      if (result) {
        response.scorecard = {
          overallGrade: result.overallGrade,
          categories: {
            requirementsGathering: result.requirementsGathering,
            dataModeling: result.dataModeling,
            tradeOffAnalysis: result.tradeOffAnalysis,
            scalability: result.scalability,
          },
          strengths: result.strengths,
          growthAreas: result.growthAreas,
          actionableFeedback: result.actionableFeedback,
        };
      } else {
        response.isSuccess = false;
        response.message = "Scorecard not found";
      }
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching scorecard",
      });
      response.isSuccess = false;
      response.message = "Failed to fetch scorecard";
    }
    return response;
  }

  static async getInterviewsSummary(params: { userId: string }) {
    const response: Schemas.GetInterviewsSummaryResponse = {
      isSuccess: true,
      message: "Successfully fetched interviews summary",
      summary: null,
    };
    try {
      const rows = await neonDBClient
        .select({
          status: interviews.status,
          count: sql<number>`count(*)::int`,
        })
        .from(interviews)
        .where(eq(interviews.user_id, params.userId))
        .groupBy(interviews.status);

      let totalCount = 0;
      let completedCount = 0;
      let inProgressCount = 0;
      let abandonedCount = 0;

      for (const row of rows) {
        totalCount += row.count;
        if (row.status === Schemas.InterviewStatusIntEnum.Completed) {
          completedCount += row.count;
        } else if (row.status === Schemas.InterviewStatusIntEnum.Active) {
          inProgressCount += row.count;
        } else if (row.status === Schemas.InterviewStatusIntEnum.Abandoned) {
          abandonedCount += row.count;
        }
      }

      response.summary = {
        totalCount,
        completedCount,
        inProgressCount,
        abandonedCount,
      };
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching interviews summary",
      });
      response.isSuccess = false;
      response.message = "Failed to fetch interviews summary";
    }
    return response;
  }
}

export default InterviewDAL;
