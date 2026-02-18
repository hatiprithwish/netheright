import { validateRequest } from "@/backend/middlewares/ApiRequestValidator";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";
import { auth } from "@/lib/next-auth";
import { NextResponse } from "next/server";

const handler = async (
  _req: Request,
  validatedBody: Schemas.CreateInterviewSessionRequest,
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

export const POST = validateRequest(
  {
    body: Schemas.ZCreateInterviewSessionRequest,
    requiresAuth: true,
  },
  handler,
);
