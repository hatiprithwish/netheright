import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import FlashcardRepo from "@/backend/repositories/FlashcardRepo";
import * as Schemas from "@/schemas";
import { auth } from "@/lib/next-auth";
import type { Logger } from "@/lib/pino";

const getHandler = async (_req: NextRequest, _body: undefined, _logger: Logger) => {
  const session = await auth();
  const response = await FlashcardRepo.getDecks(session!.user.id);
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 500 });
};

const postHandler = async (
  _req: NextRequest,
  body: Schemas.CreateDeckRequest,
  _logger: Logger,
) => {
  const session = await auth();
  const response = await FlashcardRepo.createDeck({
    userId: session!.user.id,
    name: body.name,
    description: body.description,
  });
  return NextResponse.json(response, { status: response.isSuccess ? 201 : 500 });
};

export const GET = routeWrapper(checkAuth({}, validateRequestSchema({}, getHandler)));
export const POST = routeWrapper(
  checkAuth({}, validateRequestSchema({ body: Schemas.ZCreateDeckRequest }, postHandler)),
);
