import { NextFunction, Request, Response } from "express";
import z from "zod";
import { sendError, sendSuccess } from "../types";
import { authService } from "../services/auth.service";

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid indian mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

const loginSchema = z.object({
  email: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1),
});

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const result = await authService.register(input);

      sendSuccess(res, "Registration Successful", result, 201);
    } catch (err) {
      if (err instanceof Error && err.message.includes("already registered")) {
        sendError(res, err.message, 409);
        return;
      }

      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const result = await authService.login(input);

      sendSuccess(res, "Login Successful", result);
    } catch (err) {
      if (err instanceof Error && err.message.includes("Invalid credentials")) {
        sendError(res, err.message, 401);
        return;
      }

      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = z
        .object({
          refreshToken: z.string(),
        })
        .parse(req.body);

      const result = await authService.refreshTokens(refreshToken);

      sendSuccess(res, "Token refreshed", result);
    } catch (err) {
      if (err instanceof Error && err.message.includes("refresh token")) {
        sendError(res, err.message, 401);
        return;
      }
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = z
        .object({
          refreshToken: z.string(),
        })
        .parse(req.body);

      await authService.logout(refreshToken);

      sendSuccess(res, "Logged out successfully");
    } catch (err) {
      next(err);
    }
  },
};
