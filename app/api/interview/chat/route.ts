import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/logger";

const handler = async (
  _req: NextRequest,
  validatedBody: Schemas.GetChatStreamRequest,
  logger: Logger,
) => {
  const response = await InterviewRepo.getChatStream(validatedBody, logger);
  if (!response) {
    return NextResponse.json(
      { error: "Problem not found or invalid session" },
      { status: 404 },
    );
  }
  return response;
};

export const POST = routeWrapper(
  checkAuth({},
    validateRequestSchema({ body: Schemas.ZGetChatStreamRequest }, handler),
  ),
);
