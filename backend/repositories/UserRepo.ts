import Constants from "@/constants";
import RedisCache from "@/lib/redis/cache";
import * as Schemas from "@/schemas";
import MetadataDAL from "../data-access-layer/MetadataDAL";
import MetadataRepo from "./MetadataRepo";
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

  static async getInterviewsCount(userId: string, status?: number | null) {
    const response: Schemas.TotalRecordsResponse = {
      isSuccess: false,
      message: "Failed to fetch interview count",
      totalRecords: 0,
    };

    const counts = await InterviewDAL.getInterviewsCount({
      userId,
      status: status ?? null,
    });
    response.totalRecords = counts.totalRecords;
    response.isSuccess = true;
    response.message = "Interview count fetched successfully";
    return response;
  }

  static async calculateAccessBitmask(featureIds: string[]): Promise<number[]> {
    const allFeatures = await RedisCache.get<Schemas.Feature[]>(
      Constants.FEATURES_CACHE_KEY,
      async () => (await MetadataDAL.getAllFeatures()).features,
      Constants.DEFAULT_CACHE_KEY_TTL,
    );

    const access: number[] = [];

    for (const featureId of featureIds) {
      const feature = allFeatures.find((f) => f.id === featureId);
      if (!feature) {
        console.error(`[UserRepo] Invalid or inactive feature: ${featureId}`);
        continue;
      }
      if (access[feature.permBitIndex] === undefined) {
        access[feature.permBitIndex] = 0;
      }
      access[feature.permBitIndex] =
        access[feature.permBitIndex] | (1 << feature.permBit);
    }

    return access;
  }

  static async switchRole(params: { userId: string; roleId: string }) {
    const { userId, roleId } = params;
    const response: Schemas.ApiResponse & { roleId?: string } = {
      isSuccess: false,
      message: "Failed to switch role",
    };

    try {
      // Validate role against DB (via cache)
      const validRolesResponse = await MetadataRepo.getAllRoles();
      const validRoles = validRolesResponse.roles || [];
      const isValidRole = validRoles.some((r: any) => r.id === roleId);

      if (!isValidRole) {
        response.message = "Invalid role";
        return response;
      }

      await UserDAL.updateUserRole(userId, roleId);

      response.isSuccess = true;
      response.message = "Role switched successfully";
      response.roleId = roleId;
    } catch (error) {
      console.error("[UserRepo] Failed to switch role", error);
      response.message = "Internal server error";
    }

    return response;
  }
}

export default UserRepo;
