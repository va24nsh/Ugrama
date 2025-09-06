import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorizeRoles";
const router = Router();

// Student profile routes
router.post("/student", authenticate, authorizeRoles(["STUDENT"]), ProfileController.createStudentProfile);
router.put("/student", authenticate, authorizeRoles(["STUDENT"]), ProfileController.updateStudentProfile);

// Educator profile routes
router.post("/educator", authenticate, authorizeRoles(["EDUCATOR"]), ProfileController.createEducatorProfile);
router.put("/educator", authenticate, authorizeRoles(["EDUCATOR"]), ProfileController.updateEducatorProfile);

// Get user profile with both student and educator information if available
router.get("/", authenticate, ProfileController.getProfile);

export default router;
