import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import UserRepo from "@/backend/repositories/UserRepo";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import type { Logger } from "@/lib/pino";
import * as Schemas from "@/schemas";

type RouteContext = { params: Promise<{ userId: string }> };

const postHandler = async (
  _req: NextRequest,
  validatedBody: Schemas.SwitchRoleRequest,
  _logger: Logger,
  context: RouteContext,
) => {
  const { userId } = await context.params;

  const result = await UserRepo.switchRole({
    userId,
    roleId: validatedBody.roleId,
  });

  return NextResponse.json(result, {
    status: result.isSuccess ? 200 : 400,
  });
};

export const POST = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema(
      { params: ["userId"], body: Schemas.ZSwitchRoleRequest },
      postHandler,
    ),
  ),
);
