import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";
import { auth } from "@/lib/next-auth";
import type { Logger } from "@/lib/pino";

const handler = async (
  _req: NextRequest,
  validatedBody: Schemas.CreateInterviewRequest,
  _logger: Logger,
): Promise<NextResponse<Schemas.CreateInterviewResponse>> => {
  const session = await auth();

  const response = await InterviewRepo.createInterview({
    userId: session!.user.id,
    problemId: validatedBody.problemId,
  });

  return NextResponse.json(response, {
    status: response.isSuccess ? 201 : 500,
  });
};

export const POST = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema({ body: Schemas.ZCreateInterviewRequest }, handler),
  ),
);
