import DashboardDAL from "@/backend/data-access-layer/DashboardDAL";
import * as Schemas from "@/schemas";

class DashboardRepo {
  static async getInterviewHistory(userId: string) {
    const response: Schemas.GetInterviewHistoryResponse = {
      isSuccess: false,
      message: "Failed to fetch interview history",
      interviews: [],
    };

    const interviews =
      await DashboardDAL.getUserInterviewsWithScorecards(userId);

    response.interviews = interviews;
    response.isSuccess = true;
    response.message = "Interview history fetched successfully";

    return response;
  }
}

export default DashboardRepo;
