import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/logger";

type RouteContext = { params: Promise<{ id: string }> };

const getHandler = async (
  _req: NextRequest,
  _: any,
  _logger: Logger,
  context: RouteContext,
) => {
  const { id } = await context.params;
  const response = await InterviewRepo.getSession(id);
  return NextResponse.json(response);
};

const patchHandler = async (
  req: NextRequest,
  _: any,
  _logger: Logger,
  context: RouteContext,
) => {
  const { id } = await context.params;
  const body = await req.json();
  const result = await InterviewRepo.updateInterviewSessionStatus(
    id,
    body.status,
  );
  return NextResponse.json(result, { status: result.isSuccess ? 200 : 400 });
};

const deleteHandler = async (
  _req: NextRequest,
  _: any,
  _logger: Logger,
  context: RouteContext,
) => {
  const { id } = await context.params;
  const deleted = await InterviewRepo.updateInterviewSessionStatus(
    id,
    Schemas.InterviewStatusIntEnum.Deleted,
  );

  if (!deleted) {
    return NextResponse.json(
      { isSuccess: false, message: "Failed to delete interview" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    isSuccess: true,
    message: "Interview deleted successfully",
  });
};

export const GET = routeWrapper(checkAuth({}, getHandler));
export const PATCH = routeWrapper(
  checkAuth({}, patchHandler),
);
export const DELETE = routeWrapper(
  checkAuth({}, deleteHandler),
);
