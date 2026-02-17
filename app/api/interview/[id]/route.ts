import { validateRequest } from "@/backend/middlewares/ApiRequestValidator";
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
  const response = await InterviewRepo.getSession(id);
  return NextResponse.json(response);
};

const patchHandler = async (
  req: Request,
  data: any,
  logger: any,
  context: { params: Promise<{ id: string }> },
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
  req: Request,
  data: any,
  logger: any,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;
  const deleted = await InterviewRepo.updateInterviewSessionStatus(
    id,
    Schemas.InterviewSessionStatusIntEnum.Deleted,
  );

  if (!deleted) {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to delete interview",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      isSuccess: true,
      message: "Interview deleted successfully",
    },
    { status: 200 },
  );
};

export const GET = validateRequest({ requiresAuth: true }, getHandler);
export const PATCH = validateRequest({ requiresAuth: true }, patchHandler);
export const DELETE = validateRequest({ requiresAuth: true }, deleteHandler);
