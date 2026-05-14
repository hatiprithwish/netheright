import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import FlashcardRepo from "@/backend/repositories/FlashcardRepo";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/pino";

type RouteContext = { params: Promise<{ deckId: string }> };

const postHandler = async (
  _req: NextRequest,
  body: Schemas.BulkCreateCardsRequest,
  _logger: Logger,
  context: RouteContext,
) => {
  const { deckId } = await context.params;
  const response = await FlashcardRepo.bulkCreateCards({ deckId, cards: body.cards });
  return NextResponse.json(response, { status: response.isSuccess ? 201 : 500 });
};

export const POST = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema(
      { params: ["deckId"], body: Schemas.ZBulkCreateCardsRequest },
      postHandler,
    ),
  ),
);
