import { auth } from "@/lib/next-auth";
import UserRepo from "@/backend/repositories/UserRepo";
import * as Schemas from "@/schemas";
import { NextResponse } from "next/server";
import { validateRequest } from "@/backend/middlewares/ApiRequestValidator";
import { Logger } from "@/lib/logger";

interface RouteContext {
  params: Promise<{ userId: string }>;
}

const getHandler = async (
  _req: Request,
  _data: any,
  _logger: Logger,
  { params }: RouteContext,
): Promise<NextResponse> => {
  const session = await auth();
  const { userId } = await params;

  if (session?.user?.id !== userId) {
    return NextResponse.json(
      { isSuccess: false, message: "Forbidden", interviews: [] },
      { status: 403 },
    );
  }

  const result = await UserRepo.getInterviewsByUser(userId);
  return NextResponse.json(result);
};

export const GET = validateRequest({ requiresAuth: true }, getHandler);

const postHandler = async (
  _req: Request,
  validatedBody: Schemas.GetInterviewsByUserRequest,
  _logger: Logger,
  { params }: RouteContext,
): Promise<NextResponse> => {
  const session = await auth();
  const { userId } = await params;

  if (session?.user?.id !== userId) {
    return NextResponse.json(
      { isSuccess: false, message: "Forbidden", interviews: [] },
      { status: 403 },
    );
  }

  const result = await UserRepo.getInterviewsByUser(
    userId,
    validatedBody.pageNo,
    validatedBody.pageSize,
    validatedBody.sortColumn,
    validatedBody.sortDirection,
  );
  return NextResponse.json(result);
};

export const POST = validateRequest(
  {
    body: Schemas.ZGetInterviewsByUserRequest,
    requiresAuth: true,
  },
  postHandler,
);
