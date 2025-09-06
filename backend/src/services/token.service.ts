import jwt from "jsonwebtoken";
import { prisma } from "../config/databases";
import { Role } from "@prisma/client";

export class TokenService {
  static async generateTokens({id, email, role}: { id: string; email: string, role: Role }): Promise<{ accessToken: string; refreshToken: string; }> {
    const accessToken = jwt.sign(
      { id, email, role },
      process.env.TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id, role },
      process.env.REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  }

  static async saveRefreshToken(userId: string, token: string, role: Role): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        role,
        expiresAt,
      },
    });
  }

  static async verifyRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return false;
    }

    return true;
  }

  static async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token },
    });
  }
}