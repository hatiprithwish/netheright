import pino from "pino";

export type Logger = pino.Logger;

// Create base logger instance
const baseLogger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV !== "production"
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
 * Create a scoped logger with a specific context
 * Use this for standalone scripts or code outside of middleware chains
 */
export function createScopedLogger(scope: string): Logger {
  return baseLogger.child({ scope });
}

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

/**
 * Extend logger with additional context
 * Returns a new logger instance with the additional context
 */
export function withContext(
  logger: Logger,
  context: Record<string, any>,
): Logger {
  return logger.child(context);
}
