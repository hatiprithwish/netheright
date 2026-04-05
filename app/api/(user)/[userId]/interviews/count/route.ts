import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import UserRepo from "@/backend/repositories/UserRepo";
import type { Logger } from "@/lib/pino";

type RouteContext = { params: Promise<{ userId: string }> };

const getHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
  context: RouteContext,
) => {
  const { userId } = await context.params;
  const result = await UserRepo.getInterviewsByUserCount({ userId });
  return NextResponse.json(result, {
    status: result.isSuccess ? 200 : 500,
  });
};

export const GET = routeWrapper(checkAuth({}, getHandler));
