import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id?: string;
      email?: string;
      role?: string;
    };
  }
}

export class ProfileController {
  static async createStudentProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { interests, skillLevel, goals } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!interests || !Array.isArray(interests)) {
        return res
          .status(400)
          .json({ message: "Interests are required and must be an array" });
      }

      const profile = await ProfileService.createStudentProfile(userId, {
        interests,
        skillLevel,
        goals,
      });

      return res.status(201).json({
        message: "Student profile created successfully",
        profile,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to create student profile",
      });
    }
  }

  static async createEducatorProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { qualifications, experience, expertise, website } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!qualifications || !Array.isArray(qualifications)) {
        return res
          .status(400)
          .json({
            message: "Qualifications are required and must be an array",
          });
      }

      if (!expertise || !Array.isArray(expertise)) {
        return res
          .status(400)
          .json({
            message: "Expertise areas are required and must be an array",
          });
      }

      const profile = await ProfileService.createEducatorProfile(userId, {
        qualifications,
        experience,
        expertise,
        website,
      });

      return res.status(201).json({
        message: "Educator profile created successfully",
        profile,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to create educator profile",
      });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const profile = await ProfileService.getProfile(userId);

      return res.status(200).json({ profile });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || "Profile not found",
      });
    }
  }

  static async updateStudentProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const profile = await ProfileService.updateStudentProfile(
        userId,
        updates
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to update profile",
      });
    }
  }

  static async updateEducatorProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const profile = await ProfileService.updateEducatorProfile(
        userId,
        updates
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to update profile",
      });
    }
  }
}
