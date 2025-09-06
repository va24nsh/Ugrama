import { Request, Response } from "express";
import { CourseService } from "../services/course.service";
import { Role } from "@prisma/client";

export class CourseController {
  static async createCourse(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const {
        title,
        description,
        price,
        duration,
        level,
        category,
        thumbnail,
        published,
      } = req.body;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      if (req.user?.role !== Role.EDUCATOR && req.user?.role !== Role.ADMIN) {
        throw new Error("Only educators can create courses");
      }

      if (
        !title ||
        !description ||
        price === undefined ||
        !duration ||
        !category
      ) {
        throw new Error("Missing required course information");
      }

      const course = await CourseService.createCourse(userId, {
        title,
        description,
        price: Number(price),
        duration: Number(duration),
        level,
        category,
        thumbnail,
        published: published || false,
      });

      res.status(201).json({
        message: "Course created successfully",
        course,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "Failed to create course",
      });
    }
  }

  static async getCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.params;

      const course = await CourseService.getCourse(courseId);

      return res.status(200).json({ course });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || "Course not found",
      });
    }
  }

  static async updateCourse(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { courseId } = req.params;
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const course = await CourseService.updateCourse(
        courseId,
        userId,
        updates
      );

      return res.status(200).json({
        message: "Course updated successfully",
        course,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to update course",
      });
    }
  }

  static async deleteCourse(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { courseId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      await CourseService.deleteCourse(courseId, userId);

      return res.status(200).json({
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to delete course",
      });
    }
  }

  static async listCourses(req: Request, res: Response) {
    try {
      const { category, level, educatorId, published, priceMin, priceMax } =
        req.query;

      const filters: any = {};
      if (category) filters.category = category as string;
      if (level) filters.level = level;
      if (educatorId) filters.educatorId = educatorId as string;
      if (published !== undefined) filters.published = published === "true";
      if (priceMin) filters.priceMin = Number(priceMin);
      if (priceMax) filters.priceMax = Number(priceMax);

      const courses = await CourseService.listCourses(filters);

      return res.status(200).json({ courses });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to retrieve courses",
      });
    }
  }
}
