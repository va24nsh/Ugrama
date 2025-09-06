import express from 'express';
import passport from 'passport';
import { TokenService } from '../services/token.service';
import { UserController } from '../controllers/user.controller';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/register', UserController.registerWithEmail);
router.post('/login', UserController.loginWithEmail);

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      if (!req.user) {
        throw new Error("User authentication failed");
      }
      const user = req.user as { id: string; email: string; role: Role };

      const tokens = await TokenService.generateTokens({ id: user.id, email: user.email, role: user.role });

      await TokenService.saveRefreshToken(user.id, tokens.refreshToken, user.role);
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

export default router;