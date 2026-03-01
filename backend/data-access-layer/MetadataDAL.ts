import { db } from "@/backend/db";
import { features, roles } from "@/backend/db/models";
import { eq } from "drizzle-orm";
import * as Schemas from "@/schemas";

class MetadataDAL {
  static async getAllFeatures(): Promise<Schemas.Feature[]> {
    return db
      .select({
        id: features.id,
        description: features.description,
        permBit: features.permBit,
        permBitIndex: features.permBitIndex,
      })
      .from(features)
      .where(eq(features.isActive, true));
  }

  static async getAllRoles(): Promise<Schemas.Role[]> {
    return db
      .select({
        id: roles.id,
        name: roles.name,
      })
      .from(roles)
      .where(eq(roles.isActive, true));
  }
}

export default MetadataDAL;
