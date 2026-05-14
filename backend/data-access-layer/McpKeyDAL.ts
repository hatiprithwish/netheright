import neonDBClient from "@/lib/neon-db";
import { eq, isNull } from "drizzle-orm";
import { mcp_api_keys } from "@/backend/db/tables";
import { createHash, randomBytes } from "crypto";

function hashKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}

class McpKeyDAL {
  static generateRawKey(): string {
    return `mcp_${randomBytes(32).toString("hex")}`;
  }

  static async createKey(userId: string, name: string): Promise<{ id: string; key: string; name: string; createdAt: Date }> {
    const rawKey = McpKeyDAL.generateRawKey();
    const keyHash = hashKey(rawKey);
    const [row] = await neonDBClient
      .insert(mcp_api_keys)
      .values({ user_id: userId, key_hash: keyHash, name })
      .returning();
    return { id: row.id, key: rawKey, name: row.name, createdAt: row.created_at };
  }

  static async listKeys(userId: string) {
    return neonDBClient
      .select({ id: mcp_api_keys.id, name: mcp_api_keys.name, createdAt: mcp_api_keys.created_at, revokedAt: mcp_api_keys.revoked_at })
      .from(mcp_api_keys)
      .where(eq(mcp_api_keys.user_id, userId));
  }

  static async revokeKey(keyId: string, userId: string): Promise<boolean> {
    const result = await neonDBClient
      .update(mcp_api_keys)
      .set({ revoked_at: new Date() })
      .where(eq(mcp_api_keys.id, keyId))
      .returning();
    return result.length > 0 && result[0].user_id === userId;
  }

  static async verifyKey(rawKey: string): Promise<string | null> {
    const keyHash = hashKey(rawKey);
    const [row] = await neonDBClient
      .select({ user_id: mcp_api_keys.user_id, revoked_at: mcp_api_keys.revoked_at })
      .from(mcp_api_keys)
      .where(eq(mcp_api_keys.key_hash, keyHash))
      .limit(1);
    if (!row || row.revoked_at !== null) return null;
    return row.user_id;
  }
}

export default McpKeyDAL;
