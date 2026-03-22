import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/pino";

const handler = async (
  _req: NextRequest,
  validatedBody: Schemas.GetChatStreamRequest,
  _logger: Logger,
) => {
  const response = await InterviewRepo.getChatStream(validatedBody);

  if (!response.stream) {
    return NextResponse.json({ error: response.message }, { status: 500 });
  }

  return response.stream;
};

export const POST = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema({ body: Schemas.ZGetChatStreamRequest }, handler),
  ),
);
