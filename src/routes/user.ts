import { Router } from "express";
import { editUser, getProfile } from "../controllers/userController";
import { validate } from "../middleware/validationMiddleware";
import { userUpdateSchema } from "../dto/userDto";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Route for getting user profile
router.get("/profile",  getProfile);

// Route for editing user
router.post("/edit",  validate(userUpdateSchema), editUser);

export default router;
