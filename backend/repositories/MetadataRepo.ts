import CacheManager from "@/lib/CacheManager";
import MetadataDAL from "@/backend/data-access-layer/MetadataDAL";
import Constants from "@/constants";
import * as Schemas from "@/schemas";

class MetadataRepo {
  static async getAllFeatures(): Promise<Schemas.Feature[]> {
    return CacheManager.get(
      Constants.FEATURES_CACHE_KEY,
      async () => (await MetadataDAL.getAllFeatures()).features,
      Constants.DEFAULT_CACHE_KEY_TTL,
    );
  }

  static async getAllRoles(): Promise<Schemas.Role[]> {
    return CacheManager.get(
      Constants.ROLES_CACHE_KEY,
      async () => (await MetadataDAL.getAllRoles()).roles,
      Constants.DEFAULT_CACHE_KEY_TTL,
    );
  }
}

export default MetadataRepo;
