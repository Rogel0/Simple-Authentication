import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

const getTokenFromRequest = (req: Request): string | null => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.substring("Bearer ".length).trim();
  }

  // Fallback to cookie (set as "accessToken" in auth.controller)
  const cookieToken = (req as any).cookies?.accessToken;
  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }

  return null;
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = getTokenFromRequest(req);

  if (!token) {
    res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
    return;
  }

  try {
    const payload = verifyAccessToken(token) as { sub?: string } | undefined;

    if (!payload?.sub) {
      res.status(401).json({
        status: "error",
        message: "Invalid access token",
      });
      return;
    }

    // Attach user id to request for downstream handlers
    (req as any).userId = payload.sub;
    next();
  } catch (error) {
    logger.warn("JWT authentication failed", { error });
    res.status(401).json({
      status: "error",
      message: "Invalid or expired access token",
    });
  }
};
