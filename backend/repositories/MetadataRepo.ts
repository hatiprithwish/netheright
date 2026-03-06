import RedisCache from "@/lib/redis/cache";
import MetadataDAL from "@/backend/data-access-layer/MetadataDAL";
import Constants from "@/constants";
import * as Schemas from "@/schemas";

class MetadataRepo {
  static async getAllFeatures() {
    const response: Schemas.GetAllFeaturesResponse = {
      isSuccess: true,
      message: "Features fetched successfully",
      features: [],
    };

    try {
      response.features = await RedisCache.get(
        Constants.FEATURES_CACHE_KEY,
        async () => (await MetadataDAL.getAllFeatures()).features,
      );
    } catch {
      response.isSuccess = false;
      response.message = "Failed to fetch features";
    }

    return response;
  }

  static async getAllRoles() {
    const response: Schemas.GetAllRolesResponse = {
      isSuccess: true,
      message: "Roles feched successfully",
      roles: [],
    };

    try {
      response.roles = await RedisCache.get(
        Constants.ROLES_CACHE_KEY,
        async () => (await MetadataDAL.getAllRoles()).roles,
      );
    } catch (error) {
      response.isSuccess = false;
      response.message = "Falied to fetch roles";
    }

    return response;
  }
}

export default MetadataRepo;
