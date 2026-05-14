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
  const response = await FlashcardRepo.getCards(deckId, session!.user.id);
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 500 });
};

const postHandler = async (
  _req: NextRequest,
  body: Schemas.CreateCardRequest,
  _logger: Logger,
  context: RouteContext,
) => {
  const { deckId } = await context.params;
  const response = await FlashcardRepo.createCard({
    deckId,
    front: body.front,
    back: body.back,
    tags: body.tags,
  });
  return NextResponse.json(response, { status: response.isSuccess ? 201 : 500 });
};

export const GET = routeWrapper(
  checkAuth({}, validateRequestSchema({ params: ["deckId"] }, getHandler)),
);
export const POST = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema(
      { params: ["deckId"], body: Schemas.ZCreateCardRequest },
      postHandler,
    ),
  ),
);
