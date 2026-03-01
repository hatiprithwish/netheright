import pino from "pino";
import { envConfig } from "./envConfig";

export type Logger = pino.Logger;

const baseLogger = pino({
  level: envConfig.NODE_ENV === "production" ? "info" : "debug",
  transport:
    envConfig.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

/**
 * Create a request-scoped logger with request context
 * This is used by middleware to create loggers with request metadata
 */
export function createRequestLogger(
  requestId: string,
  url: string,
  additionalContext?: Record<string, any>,
): Logger {
  return baseLogger.child({
    requestId,
    url,
    ...additionalContext,
  });
}
