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

  return NextResponse.json(response.stream, {
    status: response.isSuccess ? 200 : 400,
  });
};

export const POST = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema({ body: Schemas.ZGetChatStreamRequest }, handler),
  ),
);
