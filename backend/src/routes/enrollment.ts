import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollment.controller";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

// Authentication required for all enrollment routes
router.use(authenticate);

// Enrollment routes
router.post("/", EnrollmentController.enrollInCourse);
router.get("/my-courses", EnrollmentController.getStudentEnrollments);
router.get("/:enrollmentId", EnrollmentController.getEnrollment);
router.post("/:enrollmentId/complete", EnrollmentController.completeEnrollment);
router.post(
  "/:enrollmentId/lessons/:lessonId/progress",
  EnrollmentController.trackLessonProgress
);

export default router;
