import { validateRequest } from "@/backend/middlewares/ApiRequestValidator";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/logger";
import { NextResponse } from "next/server";

const handler = async (
  _req: Request,
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

export const POST = validateRequest(
  {
    body: Schemas.ZGetChatStreamRequest,
    requiresAuth: true,
  },
  handler,
);
