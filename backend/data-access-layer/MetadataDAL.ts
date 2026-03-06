import { db } from "@/backend/db";
import { features, roles } from "@/backend/db/tables";
import { eq } from "drizzle-orm";
import * as Schemas from "@/schemas";
import Log from "@/lib/pino/Log";

class MetadataDAL {
  static async getAllFeatures() {
    const response: Schemas.GetAllFeaturesResponse = {
      isSuccess: true,
      message: "Successfully fetched features",
      features: [],
    };
    try {
      const result = await db
        .select({
          id: features.id,
          description: features.description,
          permBit: features.perm_bit,
          permBitIndex: features.perm_bit_index,
        })
        .from(features)
        .where(eq(features.is_active, true));

      response.features = result;
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching all features",
      });
      response.isSuccess = false;
      response.message = "Failed to fetch features";
    }
    return response;
  }

  static async getAllRoles() {
    const response: Schemas.GetAllRolesResponse = {
      isSuccess: true,
      message: "Successfully fetched roles",
      roles: [],
    };
    try {
      const result = await db
        .select({
          id: roles.id,
          name: roles.name,
        })
        .from(roles)
        .where(eq(roles.is_active, true));

      response.roles = result;
    } catch (error) {
      Log.error({
        err: error,
        msg: "Unknown error occured while fetching all roles",
      });
      response.isSuccess = false;
      response.message = "Failed to fetch roles";
    }
    return response;
  }
}

export default MetadataDAL;
