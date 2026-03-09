import winston from "winston";
import { env } from "../config/env";

const { combine, timestamp, errors, splat, json, colorize, printf } =
  winston.format;

const isProd = env.NODE_ENV === "production";

const devFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaKeys = Object.keys(meta);
  const shouldPrintMeta =
    metaKeys.length > 0 && !(metaKeys.length === 1 && metaKeys[0] === "service");
  const metaSuffix = shouldPrintMeta ? ` ${JSON.stringify(meta, null, 2)}` : "";
  return `${ts} ${level}: ${message}${metaSuffix}`;
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL ?? "info",
  defaultMeta: { service: "auth-service" },
  format: combine(
    timestamp(),
    errors({ stack: true }),
    splat(),
    isProd ? json() : combine(colorize(), devFormat),
  ),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()],
});

// Helpful if you later add morgan or other stream-based loggers
export const loggerStream = {
  write(message: string) {
    logger.http(message.trim());
  },
};

export default logger;
