import ProblemsDAL from "@/backend/data-access-layer/ProblemsDAL";
import * as Schemas from "@/schemas";

class ProblemsRepo {
  static async getProblems(): Promise<Schemas.GetProblemsResponse> {
    return await ProblemsDAL.getProblems();
  }
}

export default ProblemsRepo;
