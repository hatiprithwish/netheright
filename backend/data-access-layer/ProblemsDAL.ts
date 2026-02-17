import { db } from "@/backend/db";
import { sdiProblems } from "@/backend/db/models";
import * as Schemas from "@/schemas";

class ProblemsDAL {
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
        })
        .from(sdiProblems)
        .orderBy(sdiProblems.id);

      response.problems = dbResults.map((problem) => ({
        id: Number(problem.id),
        title: problem.title,
        description: problem.description,
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
