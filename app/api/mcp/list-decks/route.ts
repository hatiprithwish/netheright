import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkMcpAuth } from "@/backend/middlewares/CheckMcpAuth";
import FlashcardDAL from "@/backend/data-access-layer/FlashcardDAL";
import type { Logger } from "@/lib/pino";

const handler = async (_req: NextRequest, _body: undefined, _logger: Logger, _ctx: any, userId: string) => {
  const response = await FlashcardDAL.getDecks(userId);
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 500 });
};

export const GET = routeWrapper(checkMcpAuth(handler));
