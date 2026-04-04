import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import type { Logger } from "@/lib/pino";
import * as Schemas from "@/schemas";
import UserRepo from "@/backend/repositories/UserRepo";

type RouteContext = { params: Promise<{ userId: string }> };

const getHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
  context: RouteContext,
) => {
  const { userId } = await context.params;
  const result = await UserRepo.getInterviewsSummary({ userId });
  return NextResponse.json(result, {
    status: result.isSuccess ? 200 : 500,
  });
};

export const GET = routeWrapper(
  checkAuth({ featureIds: [Schemas.FeatureEnum.ManageDashboard] }, getHandler),
);
