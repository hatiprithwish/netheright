import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkMcpAuth } from "@/backend/middlewares/CheckMcpAuth";
import FlashcardDAL from "@/backend/data-access-layer/FlashcardDAL";
import type { Logger } from "@/lib/pino";

const handler = async (req: NextRequest, _body: undefined, _logger: Logger, _ctx: any, _userId: string) => {
  const body = await req.json();
  const response = await FlashcardDAL.deleteCard(body.card_id);
  return NextResponse.json(response, { status: response.isSuccess ? 200 : 500 });
};

export const DELETE = routeWrapper(checkMcpAuth(handler));
