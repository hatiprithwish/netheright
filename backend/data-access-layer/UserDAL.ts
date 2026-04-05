import neonDBClient from "@/lib/neon-db";
import { eq } from "drizzle-orm";
import { users } from "@/backend/db/tables";
import * as Schemas from "@/schemas";
import Log from "@/lib/pino/Log";

class UserDAL {
  static async updateUserRole(params: Schemas.UpdateUserRoleSqlRequest) {
    const response: Schemas.ApiResponse = {
      isSuccess: false,
      message: "Failed to update user role",
    };
    try {
      const isRoleIdValid = await neonDBClient.query.roles.findFirst({
        where: (roles, { eq }) => eq(roles.id, params.roleId),
      });
      if (!isRoleIdValid) {
        Log.error({
          msg: `${params.roleId} role_id not found in database`,
        });
        return response;
      }

      const isUserIdValid = await neonDBClient.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, params.userId),
      });
      if (!isUserIdValid) {
        Log.error({
          msg: `${params.userId} user_id not found in database`,
        });
        return response;
      }

      await neonDBClient
        .update(users)
        .set({ role_id: params.roleId })
        .where(eq(users.id, params.userId));

      response.isSuccess = true;
      response.message = "Successfully updated user role";
    } catch (error) {
      Log.error({
        err: error,
        msg: `Unknown error occured while updating user role for userId: ${params.userId} and roleId: ${params.roleId}`,
      });
    }
    return response;
  }
}

export default UserDAL;
