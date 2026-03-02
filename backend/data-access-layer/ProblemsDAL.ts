import { db } from "@/backend/db";
import { sdiProblems } from "@/backend/db/models";
import * as Schemas from "@/schemas";
import { eq } from "drizzle-orm";

class ProblemsDAL {
  static async getProblemDetails(problemId: number) {
    let response: Schemas.GetProblemDetailsResponse = {
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
          difficulty: sdiProblems.difficulty,
          tags: sdiProblems.tags,
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
        difficulty: dbResult.difficulty,
        tags: dbResult.tags ?? [],
      };

      response.isSuccess = true;
      response.message = "Sdi problem details fetched successfully";
      return response;
    } catch (error) {
      return response;
    }
  }

  static async getProblems() {
    const response: Schemas.GetProblemsResponse = {
      isSuccess: false,
      message: "Failed to get problems",
      problems: [],
    };

    try {
      const dbResults = await db
        .select({
          id: sdiProblems.id,
          title: sdiProblems.title,
          description: sdiProblems.description,
          difficulty: sdiProblems.difficulty,
          tags: sdiProblems.tags,
        })
        .from(sdiProblems)
        .orderBy(sdiProblems.id);

      response.problems = dbResults.map((problem) => ({
        id: Number(problem.id),
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags ?? [],
      }));

      response.isSuccess = true;
      response.message = "Problems fetched successfully";
      return response;
    } catch (error) {
      console.error("Error fetching problems:", error);
      return response;
    }
  }
}

export default ProblemsDAL;
