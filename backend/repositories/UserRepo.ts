import UserDAL from "@/backend/data-access-layer/UserDAL";
import Constants from "@/constants";
import CacheManager from "@/lib/CacheManager";
import * as Schemas from "@/schemas";
import MetadataDAL from "../data-access-layer/MetadataDAL";

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

  static async calculateAccessBitmask(featureIds: string[]): Promise<number[]> {
    const allFeatures = await CacheManager.get<Schemas.Feature[]>(
      Constants.FEATURES_CACHE_KEY,
      () => MetadataDAL.getAllFeatures(),
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
}

export default UserRepo;
