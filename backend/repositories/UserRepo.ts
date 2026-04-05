import Constants from "@/constants";
import * as Schemas from "@/schemas";
import UserDAL from "../data-access-layer/UserDAL";
import InterviewDAL from "../data-access-layer/InterviewDAL";

class UserRepo {
  static async getInterviewsByUser(
    params: Schemas.GetInterviewsByUserRepoRequest,
  ) {
    return await InterviewDAL.getInterviews({
      userId: params.userId,
      pageNo: params.pageNo ?? Constants.DEFAULT_PAGE_NO,
      pageSize: params.pageSize ?? Constants.DEFAULT_PAGE_SIZE,
      sortColumn: params.sortColumn ?? Schemas.InterviewSortColumn.CreatedAt,
      sortDirection: params.sortDirection ?? Schemas.SortDirection.Desc,
      status: params.status ?? null,
    });
  }

  static async getInterviewsByUserCount(
    params: Schemas.GetInterviewsByUserCountRepoRequest,
  ) {
    return await InterviewDAL.getInterviewsCount({
      userId: params.userId,
      status: params.status ?? null,
    });
  }

  static async updateUserRole(params: Schemas.UpdateUserRoleRepoRequest) {
    return await UserDAL.updateUserRole({
      userId: params.userId,
      roleId: params.roleId,
    });
  }

  static async getInterviewsSummary(params: { userId: string }) {
    return await InterviewDAL.getInterviewsSummary(params);
  }
}

export default UserRepo;
