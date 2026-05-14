import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkMcpAuth } from "@/backend/middlewares/CheckMcpAuth";
import FlashcardDAL from "@/backend/data-access-layer/FlashcardDAL";
import type { Logger } from "@/lib/pino";

const handler = async (req: NextRequest, _body: undefined, _logger: Logger, _ctx: any, userId: string) => {
  const body = await req.json();
  const response = await FlashcardDAL.createDeck({ userId, name: body.name, description: body.description });
  return NextResponse.json(response, { status: response.isSuccess ? 201 : 500 });
};

export const POST = routeWrapper(checkMcpAuth(handler));
