import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import FlashcardRepo from "@/backend/repositories/FlashcardRepo";
import * as Schemas from "@/schemas";
import { auth } from "@/lib/next-auth";
import type { Logger } from "@/lib/pino";

type RouteContext = { params: Promise<{ deckId: string }> };

const getHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
  context: RouteContext,
) => {
  const session = await auth();
  const { deckId } = await context.params;
  const response = await FlashcardRepo.getDeck(deckId, session!.user.id);
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 404 });
};

const patchHandler = async (
  _req: NextRequest,
  body: Schemas.UpdateDeckRequest,
  _logger: Logger,
  context: RouteContext,
) => {
  const session = await auth();
  const { deckId } = await context.params;
  const response = await FlashcardRepo.updateDeck({
    deckId,
    userId: session!.user.id,
    ...body,
  });
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 400 });
};

const deleteHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
  context: RouteContext,
) => {
  const session = await auth();
  const { deckId } = await context.params;
  const response = await FlashcardRepo.deleteDeck(deckId, session!.user.id);
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 400 });
};

export const GET = routeWrapper(
  checkAuth({}, validateRequestSchema({ params: ["deckId"] }, getHandler)),
);
export const PATCH = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema(
      { params: ["deckId"], body: Schemas.ZUpdateDeckRequest },
      patchHandler,
    ),
  ),
);
export const DELETE = routeWrapper(
  checkAuth({}, validateRequestSchema({ params: ["deckId"] }, deleteHandler)),
);
