import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();
const protectedRouter = Router();



router.use("/auth", authRoutes);
// Pivate
protectedRouter.use("/user", userRoutes);
router.use(authenticate, protectedRouter);

;

export default router;
