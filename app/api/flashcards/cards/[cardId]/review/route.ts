import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import FlashcardRepo from "@/backend/repositories/FlashcardRepo";
import * as Schemas from "@/schemas";
import { auth } from "@/lib/next-auth";
import type { Logger } from "@/lib/pino";

type RouteContext = { params: Promise<{ cardId: string }> };

const postHandler = async (
  _req: NextRequest,
  body: Schemas.SubmitReviewRequest,
  _logger: Logger,
  context: RouteContext,
) => {
  const session = await auth();
  const { cardId } = await context.params;
  const response = await FlashcardRepo.submitReview({
    cardId,
    userId: session!.user.id,
    quality: body.quality,
  });
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 500 });
};

export const POST = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema(
      { params: ["cardId"], body: Schemas.ZSubmitReviewRequest },
      postHandler,
    ),
  ),
);
