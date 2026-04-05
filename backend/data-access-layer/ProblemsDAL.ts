import neonDBClient from "@/lib/neon-db";
import { problems } from "@/backend/db/tables";
import * as Schemas from "@/schemas";
import { eq, sql } from "drizzle-orm";
import Log from "@/lib/pino/Log";

class ProblemsDAL {
  static async getProblem(problemId: number) {
    const response: Schemas.GetProblemResponse = {
      isSuccess: true,
      message: "Successfully fetched problem details",
      problem: null,
    };

    try {
      const [result] = await neonDBClient
        .select({
          id: sql<string>`problems.id`,
          title: problems.title,
          description: problems.description,
          functionalRequirements: problems.functional_requirements,
          nonFunctionalRequirements: problems.non_functional_requirements,
          boteFactors: problems.bote_factors,
          difficulty: problems.difficulty,
          tags: problems.tags,
        })
        .from(problems)
        .where(eq(problems.id, BigInt(problemId)))
        .limit(1);

      response.problem = result;
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching sdi problem details",
      });
      response.isSuccess = false;
      response.message = "Failed to get sdi problem details";
    }

    return response;
  }

  static async getProblems() {
    const response: Schemas.GetProblemsResponse = {
      isSuccess: true,
      message: "Successfully fetched problems",
      problems: [],
    };

    try {
      const result = await neonDBClient
        .select({
          id: sql<string>`problems.id`,
          title: problems.title,
          description: problems.description,
          difficulty: problems.difficulty,
          tags: problems.tags,
        })
        .from(problems)
        .orderBy(problems.id);

      response.problems = result;
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching problems",
      });
      response.isSuccess = false;
      response.message = "Failed to get problems";
    }

    return response;
  }
}

export default ProblemsDAL;
