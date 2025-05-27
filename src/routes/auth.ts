import { Router } from "express";
import { login, logout, register } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { loginRequestSchema, registerRequestSchema } from "../dto/userDto";

const router = Router();

router.post("/register", validate(registerRequestSchema), register);
router.post("/login", validate(loginRequestSchema), login);
router.post("/logout", authenticate, logout);

export default router;
