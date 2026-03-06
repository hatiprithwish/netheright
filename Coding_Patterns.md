1. For fatal errors, like DB interactions, always use try-catch block

2. If there's multiple error returns possible, define response as failed so that you don't have to set isSucess = false multiple times.

```
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
        where: (users, { eq }) => eq(users.id, params.roleId),
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
```

3. You'll only define response body once per API call - it will either be in DAL or repo layer. If multiple DALs are being called or external API calls are happening, then you need to define it in Repo, else it should be defined in DAL.
