import neonDBClient from "@/lib/neon-db";
import { eq } from "drizzle-orm";
import { role_features, users } from "@/backend/db/tables";
import * as Schemas from "@/schemas";
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

  static async updateUserRole(userId: string, roleId: string): Promise<void> {
    try {
      await neonDBClient
        .update(users)
        .set({ role_id: roleId as Schemas.RoleCodeEnum })
        .where(eq(users.id, userId));
    } catch (error) {
      Log.error({
        err: error,
        msg: "Failed to update user role",
        userId,
        roleId,
      });
      throw error;
    }
  }
}

export default UserDAL;
