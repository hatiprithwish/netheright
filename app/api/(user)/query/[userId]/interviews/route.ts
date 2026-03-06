import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import { auth } from "@/lib/next-auth";
import UserRepo from "@/backend/repositories/UserRepo";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/pino";

type RouteContext = { params: Promise<{ userId: string }> };

const getHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
  context: RouteContext,
): Promise<NextResponse> => {
  const { userId } = await context.params;
  const result = await UserRepo.getInterviewsByUser({ userId });
  return NextResponse.json(result, {
    status: result.isSuccess ? 200 : 500,
  });
};

const postHandler = async (
  _req: NextRequest,
  validatedBody: Schemas.GetInterviewsByUserRequest,
  _logger: Logger,
  context: RouteContext,
): Promise<NextResponse> => {
  const { userId } = await context.params;

  const result = await UserRepo.getInterviewsByUser({
    ...validatedBody,
    userId,
  });
  return NextResponse.json(result, {
    status: result.isSuccess ? 200 : 500,
  });
};

export const GET = routeWrapper(
  checkAuth({}, validateRequestSchema({ params: ["userId"] }, getHandler)),
);

export const POST = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema(
      { params: ["userId"], body: Schemas.ZGetInterviewsByUserRequest },
      postHandler,
    ),
  ),
);
