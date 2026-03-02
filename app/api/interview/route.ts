import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";
import { auth } from "@/lib/next-auth";
import type { Logger } from "@/lib/logger";

const handler = async (
  _req: NextRequest,
  validatedBody: Schemas.CreateInterviewSessionRequest,
  _logger: Logger,
): Promise<NextResponse<Schemas.CreateInterviewResponse>> => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to authorize user",
        interview: null,
      },
      { status: 401 },
    );
  }

  const response = await InterviewRepo.createInterviewSession({
    userId: session.user.id,
    problemId: validatedBody.problemId,
  });

  return NextResponse.json(response);
};

export const POST = routeWrapper(
  checkAuth({},
    validateRequestSchema(
      { body: Schemas.ZCreateInterviewSessionRequest },
      handler,
    ),
  ),
);
