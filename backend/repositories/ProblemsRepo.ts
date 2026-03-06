// DONE_PRITH

import ProblemsDAL from "@/backend/data-access-layer/ProblemsDAL";

class ProblemsRepo {
  static async getProblems() {
    return await ProblemsDAL.getProblems();
  }
}

export default ProblemsRepo;
