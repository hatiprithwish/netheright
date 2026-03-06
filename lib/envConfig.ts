import { z } from "zod";
import Log from "./pino/Log";

const envSchema = z.object({
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

type EnvSchema = z.infer<typeof envSchema>;

export class EnvConfig {
  private static instance: EnvConfig;
  private readonly env: EnvSchema;

  private constructor() {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      Log.error({
        message: "Invalid environment variables",
        error: parsed.error,
      });
      // DEV_NOTE: Throwing error explicitly because app shouldn't boot if env variables are invalid
      throw new Error("Invalid environment variables");
    }

    this.env = parsed.data;
  }

  public static getInstance(): EnvConfig {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig();
    }
    return EnvConfig.instance;
  }

  public get AUTH_SECRET() {
    return this.env.AUTH_SECRET;
  }
  public get NEXTAUTH_URL() {
    return this.env.NEXTAUTH_URL;
  }
  public get GOOGLE_CLIENT_ID() {
    return this.env.GOOGLE_CLIENT_ID;
  }
  public get GOOGLE_CLIENT_SECRET() {
    return this.env.GOOGLE_CLIENT_SECRET;
  }
  public get GITHUB_CLIENT_ID() {
    return this.env.GITHUB_CLIENT_ID;
  }
  public get GITHUB_CLIENT_SECRET() {
    return this.env.GITHUB_CLIENT_SECRET;
  }
  public get DATABASE_URL() {
    return this.env.DATABASE_URL;
  }
  public get SENTRY_AUTH_TOKEN() {
    return this.env.SENTRY_AUTH_TOKEN;
  }
  public get SENTRY_DSN() {
    return this.env.SENTRY_DSN;
  }
  public get GOOGLE_GENERATIVE_AI_API_KEY() {
    return this.env.GOOGLE_GENERATIVE_AI_API_KEY;
  }
  public get AUTH_TRUST_HOST() {
    return this.env.AUTH_TRUST_HOST;
  }
  public get NODE_ENV() {
    return this.env.NODE_ENV;
  }
  public get REDIS_USERNAME() {
    return this.env.REDIS_USERNAME;
  }
  public get REDIS_PASSWORD() {
    return this.env.REDIS_PASSWORD;
  }
  public get REDIS_HOST() {
    return this.env.REDIS_HOST;
  }
  public get REDIS_PORT() {
    return this.env.REDIS_PORT;
  }
}

export const envConfig = EnvConfig.getInstance();
