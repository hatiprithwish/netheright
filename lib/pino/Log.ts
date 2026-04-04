import { createRequestLogger } from "@/lib/pino";

// Module-level logger for use outside of request middleware chains
const log = createRequestLogger("app", "global");

export default class Log {
  // ...args: any[] allows (msg) OR ({obj}, msg)
  static info(...args: Parameters<typeof log.info>): void {
    log.info(...(args as [any, ...any[]]));
  }

  static error(...args: Parameters<typeof log.error>): void {
    log.error(...(args as [any, ...any[]]));
  }

  static warn(...args: Parameters<typeof log.warn>): void {
    log.warn(...(args as [any, ...any[]]));
  }

  static debug(...args: Parameters<typeof log.debug>): void {
    log.debug(...(args as [any, ...any[]]));
  }
}
