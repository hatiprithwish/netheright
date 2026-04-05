import * as Schemas from "@/schemas";

export class EnvConfig {
  private static instance: EnvConfig;
  private readonly env: Schemas.EnvSchema;

  private constructor() {
    const parsed = Schemas.ZEnvSchema.safeParse(process.env);

    if (!parsed.success) {
      // DEV_NOTE: Throwing error explicitly because app shouldn't boot if env variables are invalid
      throw new Error("Invalid environment variables", { cause: parsed.error });
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
