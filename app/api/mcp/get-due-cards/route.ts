import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkMcpAuth } from "@/backend/middlewares/CheckMcpAuth";
import FlashcardDAL from "@/backend/data-access-layer/FlashcardDAL";
import type { Logger } from "@/lib/pino";

const handler = async (req: NextRequest, _body: undefined, _logger: Logger, _ctx: any, userId: string) => {
  const { searchParams } = new URL(req.url);
  const deckId = searchParams.get("deck_id") ?? undefined;
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20;
  const response = await FlashcardDAL.getDueCards({ userId, deckId, limit });
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 500 });
};

export const GET = routeWrapper(checkMcpAuth(handler));
