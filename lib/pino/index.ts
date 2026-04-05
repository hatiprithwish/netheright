import pino from "pino";
import { envConfig } from "../envConfig";
import * as Schemas from "@/schemas";
import pinoCaller from "pino-caller";

export type Logger = pino.Logger;

const baseLogger = pinoCaller(
  pino({
    level: envConfig.NODE_ENV === Schemas.NodeEnv.Production ? "info" : "debug",
    transport:
      envConfig.NODE_ENV !== Schemas.NodeEnv.Production
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          }
        : undefined,
  }),
);

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
