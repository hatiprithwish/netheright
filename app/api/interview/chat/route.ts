import { validateRequest } from "@/backend/middlewares/ApiRequestValidator";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/logger";

const handler = async (
  _req: Request,
  validatedBody: Schemas.GetChatStreamRequest,
  logger: Logger,
) => {
  return await InterviewRepo.getChatStream(validatedBody, logger);
};

export const POST = validateRequest(
  {
    body: Schemas.ZGetChatStreamRequest,
    requiresAuth: true,
  },
  handler,
);
