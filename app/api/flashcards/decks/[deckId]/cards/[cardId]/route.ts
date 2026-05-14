import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import FlashcardRepo from "@/backend/repositories/FlashcardRepo";
import type { Logger } from "@/lib/pino";

type RouteContext = { params: Promise<{ deckId: string; cardId: string }> };

const deleteHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
  context: RouteContext,
) => {
  const { cardId } = await context.params;
  const response = await FlashcardRepo.deleteCard(cardId);
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 400 });
};

export const DELETE = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema({ params: ["deckId", "cardId"] }, deleteHandler),
  ),
);
