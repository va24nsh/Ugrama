import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { authenticate } from "../middlewares/authenticate";
const router = Router();

// Public routes
router.get("/", CourseController.listCourses);
router.get("/:courseId", CourseController.getCourse);

// Protected routes that require authentication
router.use(authenticate);
router.post("/", CourseController.createCourse);
router.put("/:courseId", CourseController.updateCourse);
router.delete("/:courseId", CourseController.deleteCourse);

export default router;
