import { auth } from "@/lib/next-auth";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Unauthorized",
          feedback: null,
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const result = await InterviewRepo.getInterviewFeedbackDetails(
      id,
      session.user.id,
    );

    if (!result.isSuccess) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in feedback API:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Internal server error",
        feedback: null,
      },
      { status: 500 },
    );
  }
}
