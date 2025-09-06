import { Request, Response } from "express";
import { AuthService } from "../services/user.service";
import { TokenService } from "../services/token.service";
import { AuthType, Role } from "@prisma/client";

export class UserController {
    static async registerWithEmail(req: Request, res: Response) {
        try {
            const { email, password, firstName, lastName, role } = req.body;
            let userRole;
            if(role === "student") userRole = Role.STUDENT;
            else if(role === "educator") userRole = Role.EDUCATOR;
            else throw new Error("Invalid role");
            const user = await AuthService.registerWithEmail(email, password, firstName, lastName, userRole);
            const tokens = await TokenService.generateTokens({ id: user.id, email: user.email, role: userRole });
            await TokenService.saveRefreshToken(user.id, tokens.refreshToken, userRole);

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(201).json({ success: true, message: 'User registered successfully', data: { accessToken: tokens.accessToken } });
        } catch (error) {
            res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Registration failed" });
        }
    }

    static async loginWithEmail(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await AuthService.loginWithEmail(email, password);
            if (!user) {
                throw new Error('Invalid credentials');
            }
            const tokens = await TokenService.generateTokens({ id: user.id, email: user.email, role: user.role });
            await TokenService.saveRefreshToken(user.id, tokens.refreshToken, user.role);

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({ success: true, message: 'Login successful', data: { accessToken: tokens.accessToken } });
        } catch (error) {
            res.status(500).json({ success: false, error: "Login failed" });
        }
    }
}
