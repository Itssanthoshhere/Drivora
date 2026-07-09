import { comparePassword, hashPassword } from "../utils/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from "../utils/jwt";
import { config } from "../config/env";
import { logger } from "../utils/logger";
import { prisma } from "../utils/prisma";

interface RegisterInput {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

/**
 * Issues a new access/refresh token pair and persists the refresh token.
 * Centralizes the token-generation logic used by register, login, and refresh.
 */
async function issueTokens(
  payload: TokenPayload,
  userId: string,
  tx: any = prisma,
) {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.jwt.refreshTokenDays);

  await tx.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });

  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: RegisterInput) {
    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { OR: [{ email: input.email }, { phone: input.phone }] },
      });

      if (existingUser) {
        if (existingUser.email === input.email)
          throw new Error("Email already registered");

        throw new Error("Phone number already registered");
      }

      const passwordHash = await hashPassword(input.password);

      const user = await tx.user.create({
        data: {
          email: input.email,
          phone: input.phone,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
        },

        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          role: true,
          isVerified: true,
        },
      });

      const tokens = await issueTokens(
        { userId: user.id, email: user.email, role: user.role },
        user.id,
        tx,
      );

      logger.info(`New user registered: ${user.id}`);
      return { user, ...tokens };
    });
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { phone: input.email }] },
    });

    if (!user || !user.isActive) {
      throw new Error("Invalid credentials");
    }

    const isValid = await comparePassword(input.password, user.passwordHash);

    if (!isValid) throw new Error("Invalid credentials");

    // Revoke all existing refresh tokens for this user before issuing new ones
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    const tokens = await issueTokens(
      { userId: user.id, email: user.email, role: user.role },
      user.id,
    );

    logger.info(`User logged in: ${user.id}`);

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
      ...tokens,
    };
  },

  async refreshTokens(token: string) {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new Error("Invalid or expired refresh token");
    }

    // Use a transaction to prevent race conditions with concurrent refresh requests
    const stored = await prisma.$transaction(async (tx) => {
      const found = await tx.refreshToken.findUnique({ where: { token } });

      if (!found || found.expiresAt < new Date()) {
        throw new Error("Invalid or expired refresh token");
      }

      await tx.refreshToken.delete({ where: { token } });
      return found;
    });

    const tokens = await issueTokens(
      { userId: payload.userId, email: payload.email, role: payload.role },
      stored.userId,
    );

    return tokens;
  },

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
    logger.info(`User logged out, token revoked`);
  },
};
