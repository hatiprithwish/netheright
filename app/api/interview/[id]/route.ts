import { validateRequest } from "@/backend/middlewares/ApiRequestValidator";
import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";
import { NextResponse } from "next/server";

const getHandler = async (
  req: Request,
  data: any,
  logger: any,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  try {
    const response = await InterviewRepo.getSession(id);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching interview session:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to fetch interview session",
        session: null,
      },
      { status: 500 },
    );
  }
};

const deleteHandler = async (
  req: Request,
  data: any,
  logger: any,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  const response: Schemas.DeleteInterviewResponse = {
    isSuccess: false,
    message: "Failed to delete interview",
  };

  try {
    const deleted = await InterviewDAL.deleteInterviewSession(id);

    if (!deleted) {
      return NextResponse.json(response, { status: 404 });
    }

    response.isSuccess = true;
    response.message = "Interview deleted successfully";
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json(response, { status: 500 });
  }
};

export const GET = validateRequest({ requiresAuth: true }, getHandler);
export const DELETE = validateRequest({ requiresAuth: true }, deleteHandler);
