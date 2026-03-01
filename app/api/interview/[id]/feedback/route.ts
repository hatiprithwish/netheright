import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import { auth } from "@/lib/next-auth";
import type { Logger } from "@/lib/logger";

type RouteContext = { params: Promise<{ id: string }> };

const getHandler = async (
  _req: NextRequest,
  _: any,
  _logger: Logger,
  context: RouteContext,
) => {
  const session = await auth();
  const { id } = await context.params;
  const result = await InterviewRepo.getInterviewFeedbackDetails(
    id,
    session!.user.id,
  );

  if (!result.isSuccess) {
    return NextResponse.json(result, { status: 404 });
  }
  return NextResponse.json(result);
};

export const GET = routeWrapper(
  checkAuth({}, validateRequestSchema({ params: ["id"] }, getHandler)),
);
