import { Request, Response } from "express";
import { EnrollmentService } from "../services/enrollment.service";

export class EnrollmentController {
  static async enrollInCourse(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { courseId } = req.body;

      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      if (!courseId) {
        res.status(400).json({ message: "Course ID is required" });
        return;
      }

      const enrollment = await EnrollmentService.enrollInCourse(
        userId,
        courseId
      );

      res.status(201).json({
        message: "Successfully enrolled in course",
        enrollment,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || "Failed to enroll in course",
      });
    }
  }

  static async getEnrollment(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params;

      if (!enrollmentId) {
        return res.status(400).json({ message: "Enrollment ID is required" });
      }

      const enrollment = await EnrollmentService.getEnrollment(enrollmentId);

      return res.status(200).json({
        enrollment,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || "Enrollment not found",
      });
    }
  }

  static async trackLessonProgress(req: Request, res: Response) {
    try {
      const { enrollmentId, lessonId } = req.params;
      const { completed } = req.body;

      if (completed === undefined) {
        return res
          .status(400)
          .json({ message: "Completed status is required" });
      }

      const progress = await EnrollmentService.trackProgress(
        enrollmentId,
        lessonId,
        completed
      );

      return res.status(200).json({
        message: completed
          ? "Lesson marked as completed"
          : "Lesson marked as incomplete",
        progress,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to update lesson progress",
      });
    }
  }

  static async completeEnrollment(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params;

      const enrollment = await EnrollmentService.completeEnrollment(
        enrollmentId
      );

      return res.status(200).json({
        message: "Course marked as completed",
        enrollment,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Failed to complete course",
      });
    }
  }

  static async getStudentEnrollments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const enrollments = await EnrollmentService.getStudentEnrollments(userId);

      return res.status(200).json({
        enrollments,
      });
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || "Failed to retrieve enrollments",
      });
    }
  }
}
