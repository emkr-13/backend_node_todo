import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  reorderTask,
} from "../controllers/taskController";
import { validate } from "../middleware/validationMiddleware";
import { createTaskSchema, updateTaskSchema } from "../dto/taskDto";

import { z } from "zod";

const router = Router();

// ID parameter validation schema
const taskIdParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Task ID must be a valid number",
  }),
});

// GET all tasks
router.get("/",  getAllTasks);

// POST routes for CRUD operations
router.post("/create",  validate(createTaskSchema), createTask);
router.post(
  "/detail/:id",

  validate(taskIdParamSchema, "params"),
  getTaskById
);
router.post(
  "/update/:id",
 
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema),
  updateTask
);
router.post(
  "/delete/:id",
 
  validate(taskIdParamSchema, "params"),
  deleteTask
);
router.post(
  "/reorder/:id",
 
  validate(taskIdParamSchema, "params"),
  validate(z.object({ newPosition: z.number() })),
  reorderTask
);

export default router;
