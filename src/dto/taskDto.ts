import { z } from "zod";

// Zod schemas
export const taskSchema = z.object({
  id: z.number(),
  description: z.string().nullable(),
  is_completed: z.boolean(),
  position: z.number(),
  user_id: z.string(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export const createTaskSchema = z.object({
  description: z.string().min(1, "Description is required"),
  position: z.number().optional(),
});

export const updateTaskSchema = z.object({
  description: z.string().min(1).optional(),
  is_completed: z.boolean().optional(),
  position: z.number().optional(),
});

// Types derived from Zod schemas
export type TaskDto = z.infer<typeof taskSchema>;
export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
