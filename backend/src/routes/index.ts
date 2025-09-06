import { Router } from "express";
import userRouter from "./user.auth";
import enrollmentRoutes from "./enrollment";
import courseRoutes from "./course";
import profileRoutes from "./profile";

const router = Router();

// health check api
router.get("/healthCheck", async (req, res) => {
  console.log("Health check api hit");
  res.status(200).json({
    message: "Working fine!",
  });
});

// User Operations
router.use("/user", userRouter);
router.use("/enrollments", enrollmentRoutes);
router.use("/courses", courseRoutes);
router.use("/profiles", profileRoutes);

export default router;
