import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const router = Router();

// GET all tasks
router.get("/", getAllTasks);

// POST routes for CRUD operations
router.post("/create", createTask);
router.post("/detail/:id", getTaskById);
router.post("/update/:id", updateTask);
router.post("/delete/:id", deleteTask);

export default router;
