// DONE_PRITH

import Constants from "@/constants";
import RedisCache from "@/lib/redis/cache";
import * as Schemas from "@/schemas";
import MetadataDAL from "../data-access-layer/MetadataDAL";
import UserDAL from "../data-access-layer/UserDAL";
import InterviewDAL from "../data-access-layer/InterviewDAL";
import Log from "@/lib/pino/Log";

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

  static async calculateAccessBitmask(featureIds: string[]) {
    const allFeatures = await RedisCache.get<Schemas.Feature[]>(
      Constants.FEATURES_CACHE_KEY,
      async () => (await MetadataDAL.getAllFeatures()).features,
      Constants.DEFAULT_CACHE_KEY_TTL,
    );

    const access: number[] = [];

    for (const featureId of featureIds) {
      const feature = allFeatures.find((f) => f.id === featureId);
      if (!feature) {
        Log.warn(`Faced an invalid feature: ${featureId}`);
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
}

export default UserRepo;
