import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkMcpAuth } from "@/backend/middlewares/CheckMcpAuth";
import FlashcardRepo from "@/backend/repositories/FlashcardRepo";
import type { Logger } from "@/lib/pino";

const handler = async (req: NextRequest, _body: undefined, _logger: Logger, _ctx: any, userId: string) => {
  const body = await req.json();
  const response = await FlashcardRepo.submitReview({ cardId: body.card_id, userId, quality: body.quality });
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 500 });
};

export const POST = routeWrapper(checkMcpAuth(handler));
