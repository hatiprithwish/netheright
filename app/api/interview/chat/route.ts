import { validateRequest } from "@/backend/middlewares/ApiRequestValidator";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";

const handler = async (
  _req: Request,
  validatedBody: Schemas.GetChatStreamRequest,
) => {
  return await InterviewRepo.getChatStream(validatedBody);
};

export const POST = validateRequest(
  {
    body: Schemas.ZGetChatStreamRequest,
    requiresAuth: true,
  },
  handler,
);
