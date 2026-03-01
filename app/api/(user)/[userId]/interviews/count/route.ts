import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { auth } from "@/lib/next-auth";
import UserRepo from "@/backend/repositories/UserRepo";
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
      {
        isSuccess: false,
        message: "Forbidden",
        total: 0,
        completed: 0,
        inProgress: 0,
        abandoned: 0,
      },
      { status: 403 },
    );
  }

  const result = await UserRepo.getInterviewsCount(userId);
  return NextResponse.json(result);
};

export const GET = routeWrapper(checkAuth({}, getHandler));
