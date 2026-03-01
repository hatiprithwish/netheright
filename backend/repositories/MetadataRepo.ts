import CacheManager from "@/lib/CacheManager";
import MetadataDAL from "@/backend/data-access-layer/MetadataDAL";
import Constants from "@/constants";
import * as Schemas from "@/schemas";

class MetadataRepo {
  static async getAllFeatures(): Promise<Schemas.Feature[]> {
    return CacheManager.get(
      Constants.FEATURES_CACHE_KEY,
      () => MetadataDAL.getAllFeatures(),
      Constants.DEFAULT_CACHE_KEY_TTL,
    );
  }

  static async getAllRoles(): Promise<Schemas.Role[]> {
    return CacheManager.get(
      Constants.ROLES_CACHE_KEY,
      () => MetadataDAL.getAllRoles(),
      Constants.DEFAULT_CACHE_KEY_TTL,
    );
  }
}

export default MetadataRepo;
