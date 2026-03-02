import { createRequestLogger } from "@/lib/logger";

// Module-level logger for use outside of request middleware chains
const log = createRequestLogger("app", "global");

export default class Log {
  static info(msg: string): void {
    log.info(msg);
  }

  static error(msg: string): void {
    log.error(msg);
  }

  static warn(msg: string): void {
    log.warn(msg);
  }

  static debug(msg: string): void {
    log.debug(msg);
  }
}
