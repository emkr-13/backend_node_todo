import { db } from "../config/db";
import { task } from "../models/task";
import { eq, and, desc, asc } from "drizzle-orm";
import { CreateTaskDto, UpdateTaskDto } from "../dto/taskDto";

export class TaskRepository {
  async findAll(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(task)
      .where(eq(task.user_id, userId))
      .orderBy(asc(task.position));
  }

  async findById(taskId: number, userId: string): Promise<any> {
    const [taskItem] = await db
      .select()
      .from(task)
      .where(and(eq(task.id, taskId), eq(task.user_id, userId)));
    return taskItem;
  }

  async create(taskData: CreateTaskDto, userId: string): Promise<any> {
    const [newTask] = await db
      .insert(task)
      .values({
        description: taskData.description,
        position: taskData.position || 0,
        user_id: userId,
      })
      .returning();
    return newTask;
  }

  async update(
    taskId: number,
    userId: string,
    taskData: UpdateTaskDto
  ): Promise<any> {
    const [updatedTask] = await db
      .update(task)
      .set({
        ...taskData,
        updatedAt: new Date(),
      })
      .where(and(eq(task.id, taskId), eq(task.user_id, userId)))
      .returning();
    return updatedTask;
  }

  async delete(taskId: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(task)
      .where(and(eq(task.id, taskId), eq(task.user_id, userId)));
    return !!result;
  }
}
