import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import FlashcardRepo from "@/backend/repositories/FlashcardRepo";
import { auth } from "@/lib/next-auth";
import type { Logger } from "@/lib/pino";

const getHandler = async (req: NextRequest, _body: undefined, _logger: Logger) => {
  const session = await auth();
  const deckId = req.nextUrl.searchParams.get("deckId") ?? undefined;
  const response = await FlashcardRepo.getStats(session!.user.id, deckId);
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 500 });
};

export const GET = routeWrapper(checkAuth({}, validateRequestSchema({}, getHandler)));
