import z from "zod";

export const ZEnvSchema = z.object({
  NODE_ENV: z.string().min(1, "NODE_ENV is required"),
  // Auth
  AUTH_TRUST_HOST: z
    .string("AUTH_TRUST_HOST is required")
    .transform((val) => val === "true"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  NEXTAUTH_URL: z.url("NEXTAUTH_URL must be a valid URL"),

  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),

  // Database
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),

  // Sentry
  SENTRY_AUTH_TOKEN: z.string("SENTRY_AUTH_TOKEN is required"),
  SENTRY_DSN: z.url("SENTRY_DSN is required"),

  // Gemini
  GOOGLE_GENERATIVE_AI_API_KEY: z
    .string()
    .min(1, "GOOGLE_GENERATIVE_AI_API_KEY is required"),

  // Redis
  REDIS_USERNAME: z.string().min(1, "REDIS_USERNAME is required"),
  REDIS_PASSWORD: z.string().min(1, "REDIS_PASSWORD is required"),
  REDIS_HOST: z.string().min(1, "REDIS_HOST is required"),
  REDIS_PORT: z.string().min(1, "REDIS_PORT is required"),
});

export type EnvSchema = z.infer<typeof ZEnvSchema>;
