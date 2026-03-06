import { db } from "@/backend/db";
import { and, asc, desc, eq, sql } from "drizzle-orm";
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
      const [interview] = await db
        .insert(interviews)
        .values({
          userId: params.userId,
          problemId: params.problemId,
          status: Schemas.InterviewStatusIntEnum.Active,
          currentPhase: Schemas.InterviewPhaseIntEnum.RequirementsGathering,
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
      const result = await db
        .select({
          id: interviews.id,
          userId: interviews.userId,
          problemId: interviews.problem_id,
          problemTitle: problems.title,
          status: interviews.status,
          statusLabel: sql<Schemas.InterviewStatusLabelEnum>`CASE
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Completed} THEN ${Schemas.InterviewStatusLabelEnum.Completed}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Abandoned} THEN ${Schemas.InterviewStatusLabelEnum.Abandoned}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Deleted} THEN ${Schemas.InterviewStatusLabelEnum.Deleted}
            ELSE ${Schemas.InterviewStatusLabelEnum.Active}
            END`,
          currentPhase: interviews.current_phase,
          currentPhaseLabel: sql<Schemas.InterviewPhaseLabelEnum>`CASE
            WHEN ${interviews.current_phase} = ${Schemas.InterviewPhaseIntEnum.BotECalculation} THEN ${Schemas.InterviewPhaseLabelEnum.BotECalculation}
            WHEN ${interviews.current_phase} = ${Schemas.InterviewPhaseIntEnum.HighLevelDesign} THEN ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}
            WHEN ${interviews.current_phase} = ${Schemas.InterviewPhaseIntEnum.ComponentDeepDive} THEN ${Schemas.InterviewPhaseLabelEnum.ComponentDeepDive}
            WHEN ${interviews.current_phase} = ${Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion} THEN ${Schemas.InterviewPhaseLabelEnum.BottlenecksDiscussion}
            ELSE ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}
            END`,
          createdAt: interviews.createdAt,
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
      const sortCol =
        interviews[
          params.sortColumn as keyof Pick<
            typeof interviews,
            "id" | "status" | "createdAt"
          >
        ];
      const orderExpr =
        params.sortDirection === "desc" ? desc(sortCol) : asc(sortCol);
      const offset = (params.pageNo - 1) * params.pageSize;

      const result = await db
        .select({
          id: interviews.id,
          problemId: interviews.problem_id,
          problemTitle: problems.title,
          userId: interviews.userId,
          status: interviews.status,
          statusLabel: sql<Schemas.InterviewStatusLabelEnum>`CASE
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Completed} THEN ${Schemas.InterviewStatusLabelEnum.Completed}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Abandoned} THEN ${Schemas.InterviewStatusLabelEnum.Abandoned}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Deleted} THEN ${Schemas.InterviewStatusLabelEnum.Deleted}
            ELSE ${Schemas.InterviewStatusLabelEnum.Active}
            END`,
          currentPhase: interviews.current_phase,
          currentPhaseLabel: sql<Schemas.InterviewPhaseLabelEnum>`CASE
            WHEN ${interviews.current_phase} = ${Schemas.InterviewPhaseIntEnum.BotECalculation} THEN ${Schemas.InterviewPhaseLabelEnum.BotECalculation}
            WHEN ${interviews.current_phase} = ${Schemas.InterviewPhaseIntEnum.HighLevelDesign} THEN ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}
            WHEN ${interviews.current_phase} = ${Schemas.InterviewPhaseIntEnum.ComponentDeepDive} THEN ${Schemas.InterviewPhaseLabelEnum.ComponentDeepDive}
            WHEN ${interviews.current_phase} = ${Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion} THEN ${Schemas.InterviewPhaseLabelEnum.BottlenecksDiscussion}
            ELSE ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}
            END`,
          overallGrade: scorecards.overall_grade,
          createdAt: interviews.createdAt,
        })
        .from(interviews)
        .innerJoin(problems, eq(interviews.problem_id, problems.id))
        .leftJoin(scorecards, eq(interviews.id, scorecards.interviewId))
        .where(() => {
          const conditions = [];
          conditions.push(eq(interviews.userId, params.userId));
          if (params.status) {
            conditions.push(eq(interviews.status, params.status));
          }
          return and(...conditions);
        })
        .orderBy(orderExpr)
        .limit(params.pageSize)
        .offset(offset);

      response.interviews = result;
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
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(interviews)
        .innerJoin(problems, eq(interviews.problem_id, problems.id))
        .where(() => {
          const conditions = [];
          conditions.push(eq(interviews.userId, params.userId));
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
        fieldsToUpdate.currentPhase = params.phase;
      }
      if (params.status) {
        fieldsToUpdate.status = params.status;
      }
      if (Object.keys(fieldsToUpdate).length > 0) {
        await db
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
      await db.insert(interview_chats).values({
        interviewId: params.interviewId,
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
      let result = await db
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
          conditions.push(eq(interview_chats.interviewId, params.interviewId));
          return and(...conditions);
        })
        .orderBy(interview_chats.createdAt);

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
      const [result] = await db
        .insert(scorecards)
        .values({
          interviewId: params.interviewId,
          overallGrade: params.overallGrade,
          requirementsGathering: params.requirementsGathering,
          dataModeling: params.dataModeling,
          tradeOffAnalysis: params.tradeOffAnalysis,
          scalability: params.scalability,
          strengths: params.strengths,
          growthAreas: params.growthAreas,
          actionableFeedback: params.actionableFeedback,
        })
        .returning();
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
      const [result] = await db
        .select({
          overallGrade: scorecards.overall_grade,
          requirementsGathering: scorecards.requirements_gathering,
          dataModeling: scorecards.data_modeling,
          tradeOffAnalysis: scorecards.trade_off_analysis,
          scalability: scorecards.scalability,
          strengths: scorecards.strengths,
          growthAreas: scorecards.growth_areas,
          actionableFeedback: scorecards.actionable_feedback,
        })
        .from(scorecards)
        .innerJoin(interviews, eq(scorecards.interviewId, interviews.id))
        .where(() => {
          const conditions = [];
          conditions.push(eq(scorecards.interviewId, params.interviewId));
          conditions.push(eq(interviews.userId, params.userId));
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
}

export default InterviewDAL;
