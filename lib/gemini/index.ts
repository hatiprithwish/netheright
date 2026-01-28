import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { envConfig } from "@/lib/envConfig";

const google = createGoogleGenerativeAI({
  apiKey: envConfig.GOOGLE_GENERATIVE_AI_API_KEY,
});

export default google;
