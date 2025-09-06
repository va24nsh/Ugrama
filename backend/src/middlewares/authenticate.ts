import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/token.service";
import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id?: string;
      email?: string;
      role?: Role;
    }
  }
}

const access_secret = process.env.TOKEN_SECRET || "";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    if (!refreshToken && !accessToken) throw new Error("No Cookie or Authorization header provided");
    const token = refreshToken?.trim() || accessToken?.trim();
    if (!token) throw new Error("No token provided");

    const refreshTokenDetails = await TokenService.verifyRefreshToken(refreshToken);
    if (!refreshTokenDetails) throw new Error("Cannot get token");

    if (!accessToken) throw new Error("No access token provided");
    const { id, email, role } = jwt.verify(accessToken, access_secret) as unknown as { id: string; email: string; role: Role };

    if (!id) throw new Error("Cannot verify token");

    req.user = {
      id,
      role,
      email,
    };
    next();
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(401).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Error checking token",
      });
    }
  }
};
