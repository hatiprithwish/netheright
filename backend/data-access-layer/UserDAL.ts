import neonDBClient from "@/lib/neon-db";
import { eq } from "drizzle-orm";
import { role_features } from "@/backend/db/tables";
import RedisCache from "@/lib/redis/cache";
import Constants from "@/constants";
import Log from "@/lib/pino/Log";

class UserDAL {
  static async getFeaturesByRole(roleId: string): Promise<string[]> {
    try {
      return await RedisCache.get(
        `role_features_${roleId}`,
        async () => {
          const rows = await neonDBClient
            .select({ featureId: role_features.feature_id })
            .from(role_features)
            .where(eq(role_features.role_id, roleId));
          return rows.map((r: { featureId: string }) => r.featureId);
        },
        Constants.DEFAULT_CACHE_KEY_TTL,
      );
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching features by role",
      });
      return [];
    }
  }
}

export default UserDAL;
