import { validateRequest } from "@/backend/middlewares/ApiRequestValidator";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import google from "@/lib/gemini";
import * as Schemas from "@/schemas";
import { streamText, convertToModelMessages } from "ai";

const handler = async (req: Request) => {
  const { messages, phase } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: InterviewRepo.getSystemPrompt(phase),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    onFinish: ({ messages }) => {
      // Logic to save the full chat history to your database
      // saveChatToDb(sessionId, messages);
    },
  });
};

export const POST = validateRequest(
  {
    // body: Schemas.ZAiChatRequest,
    requiresAuth: true,
  },
  handler,
);
