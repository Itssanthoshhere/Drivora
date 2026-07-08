import { NextFunction, Response } from "express";
import { AuthenticateRequest, sendError } from "../types";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers?.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    sendError(res, "No token provided", 401);
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

export const requireAdmin = (
  req: AuthenticateRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "ADMIN") {
    sendError(res, "Forbidden: Admin access required", 403);
    return;
  }

  next();
};
