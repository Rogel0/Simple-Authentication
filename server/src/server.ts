import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";
import connectDB, { pool } from "./config/database";
import logger from "./utils/logger";
import authRouter from "./routes/auth.routes";

const app = express();

// If you deploy behind a reverse proxy (nginx, render, fly.io, etc.)
// this ensures correct client IPs and secure cookies.
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

app.use("/api/auth", authRouter);

app.get("/health", async (_req: Request, res: Response) => {
  try {
    // quick DB ping so health reflects real readiness
    await pool.query("SELECT 1");
    res.status(200).json({ ok: true });
  } catch (err) {
    logger.warn("Healthcheck DB ping failed", { err });
    res.status(503).json({ ok: false });
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error("Unhandled request error", { err });
  res.status(500).json({ message: "Internal Server Error" });
});

async function start() {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info("Server listening on port %d (%s)", env.PORT, env.NODE_ENV);
  });

  const shutdown = async (signal: string) => {
    logger.info("Received %s, shutting down", signal);

    server.close(async () => {
      try {
        await pool.end();
        logger.info("PostgreSQL pool closed");
      } catch (err) {
        logger.error("Error closing PostgreSQL pool", { err });
      } finally {
        process.exit(0);
      }
    });

    // Force exit if open connections hang
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

start().catch((err) => {
  logger.error("Failed to start server", { err });
  process.exit(1);
});
