import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import FlashcardRepo from "@/backend/repositories/FlashcardRepo";
import { auth } from "@/lib/next-auth";
import type { Logger } from "@/lib/pino";

type RouteContext = { params: Promise<{ deckId: string }> };

const getHandler = async (
  req: NextRequest,
  _body: undefined,
  _logger: Logger,
  context: RouteContext,
) => {
  const session = await auth();
  const { deckId } = await context.params;
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  const response = await FlashcardRepo.getDueCards({
    userId: session!.user.id,
    deckId,
    limit: isNaN(limit) ? 20 : limit,
  });
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 500 });
};

export const GET = routeWrapper(
  checkAuth({}, validateRequestSchema({ params: ["deckId"] }, getHandler)),
);
