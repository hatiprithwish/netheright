import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import { auth } from "@/lib/next-auth";
import UserRepo from "@/backend/repositories/UserRepo";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/logger";

type RouteContext = { params: Promise<{ userId: string }> };

const getHandler = async (
  _req: NextRequest,
  _: any,
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

const postHandler = async (
  _req: NextRequest,
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

export const GET = routeWrapper(checkAuth({}, getHandler));

export const POST = routeWrapper(
  checkAuth({},
    validateRequestSchema(
      { body: Schemas.ZGetInterviewsByUserRequest },
      postHandler,
    ),
  ),
);
