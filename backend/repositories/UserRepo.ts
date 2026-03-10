// DONE_PRITH

import Constants from "@/constants";
import * as Schemas from "@/schemas";
import UserDAL from "../data-access-layer/UserDAL";
import InterviewDAL from "../data-access-layer/InterviewDAL";

class UserRepo {
  static async getInterviewsByUser(params: Schemas.GetInterviewsByUserRequest) {
    return await InterviewDAL.getInterviews({
      userId: params.userId,
      pageNo: params.pageNo ?? Constants.DEFAULT_PAGE_NO,
      pageSize: params.pageSize ?? Constants.DEFAULT_PAGE_SIZE,
      sortColumn: params.sortColumn ?? Schemas.InterviewSortColumn.createdAt,
      sortDirection: params.sortDirection ?? Schemas.SortDirection.Desc,
      status: params.status ?? null,
    });
  }

  static async getInterviewsByUserCount(
    params: Schemas.GetInterviewsByUserCountRequest,
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
}

export default UserRepo;
