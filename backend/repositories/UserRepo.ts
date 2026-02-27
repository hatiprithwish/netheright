import UserDAL from "@/backend/data-access-layer/UserDAL";
import * as Schemas from "@/schemas";

class UserRepo {
  static async getInterviewsByUser(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
    sortBy: Schemas.InterviewSortColumn = Schemas.InterviewSortColumn.Date,
    sortOrder: Schemas.SortDirection = Schemas.SortDirection.Desc,
  ) {
    const response: Schemas.GetInterviewHistoryResponse = {
      isSuccess: false,
      message: "Failed to fetch interviews",
      interviews: [],
    };

    const interviews = await UserDAL.getInterviewsByUser(
      userId,
      page,
      pageSize,
      sortBy,
      sortOrder,
    );
    response.interviews = interviews;
    response.isSuccess = true;
    response.message = "Interviews fetched successfully";
    return response;
  }

  static async getInterviewsCount(userId: string) {
    const response: Schemas.GetInterviewCountResponse = {
      isSuccess: false,
      message: "Failed to fetch interview counts",
      total: 0,
      completed: 0,
      inProgress: 0,
      abandoned: 0,
    };

    const counts = await UserDAL.getInterviewsCountByUser(userId);
    response.total = counts.total;
    response.completed = counts.completed;
    response.inProgress = counts.inProgress;
    response.abandoned = counts.abandoned;
    response.isSuccess = true;
    response.message = "Interview counts fetched successfully";
    return response;
  }
}

export default UserRepo;
