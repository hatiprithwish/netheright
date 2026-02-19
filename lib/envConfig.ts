import { z } from "zod";

const envSchema = z.object({
  // Auth
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
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_DSN: z.url().optional(),

  // AI
  GOOGLE_GENERATIVE_AI_API_KEY: z
    .string()
    .min(1, "GOOGLE_GENERATIVE_AI_API_KEY is required"),

  // Misc
  AUTH_TRUST_HOST: z
    .string("AUTH_TRUST_HOST is required")
    .transform((val) => val === "true"),
});

type EnvSchema = z.infer<typeof envSchema>;

export class EnvConfig {
  private static instance: EnvConfig;
  private readonly env: EnvSchema;

  private constructor() {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      console.error(
        "❌ Invalid environment variables:",
        JSON.stringify(parsed.error.format(), null, 4),
      );
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
}

export const envConfig = EnvConfig.getInstance();
