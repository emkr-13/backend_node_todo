import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import { TaskService } from "../services/taskService";
import { CreateTaskDto, UpdateTaskDto } from "../dto/taskDto";
import logger from "../utils/logger";

const taskService = new TaskService();

export const getAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      sendResponse(res, 400, "Unauthorized");
      return;
    }

    const tasks = await taskService.getAllTasks(userId);
    logger.info({ userId }, "Tasks retrieved successfully");
    sendResponse(res, 200, "Tasks retrieved successfully", tasks);
  } catch (error) {
    logger.error({ error }, "Error retrieving tasks");
    sendResponse(res, 500, "Internal server error");
  }
};

export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const taskId = parseInt(req.params.id);

    if (!userId) {
      sendResponse(res, 400, "Unauthorized");
      return;
    }

    if (isNaN(taskId)) {
      sendResponse(res, 400, "Invalid task ID");
      return;
    }

    const task = await taskService.getTaskById(taskId, userId);

    if (!task) {
      logger.info({ taskId, userId }, "Task not found");
      sendResponse(res, 404, "Task not found");
      return;
    }

    logger.info({ taskId, userId }, "Task retrieved successfully");
    sendResponse(res, 200, "Task retrieved successfully", task);
  } catch (error) {
    logger.error({ error, taskId: req.params.id }, "Error retrieving task");
    sendResponse(res, 500, "Internal server error");
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { description, position } = req.body;

    if (!userId) {
      sendResponse(res, 400, "Unauthorized");
      return;
    }

    if (!description) {
      sendResponse(res, 400, "Description is required");
      return;
    }

    const taskData: CreateTaskDto = {
      description,
      position: position || 0,
    };

    const newTask = await taskService.createTask(taskData, userId);
    logger.info({ userId, taskData }, "Task created successfully");
    sendResponse(res, 201, "Task created successfully", newTask);
  } catch (error) {
    logger.error(
      { error, userId: (req as any)?.user?.id },
      "Error creating task"
    );
    sendResponse(res, 500, "Internal server error");
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const taskId = parseInt(req.params.id);
    const { description, is_completed, position } = req.body;

    if (!userId) {
      sendResponse(res, 400, "Unauthorized");
      return;
    }

    if (isNaN(taskId)) {
      sendResponse(res, 400, "Invalid task ID");
      return;
    }

    // At least one field should be provided for update
    if (
      description === undefined &&
      is_completed === undefined &&
      position === undefined
    ) {
      sendResponse(res, 400, "No update data provided");
      return;
    }

    const taskData: UpdateTaskDto = {};

    if (description !== undefined) taskData.description = description;
    if (is_completed !== undefined) taskData.is_completed = is_completed;
    if (position !== undefined) taskData.position = position;

    const updatedTask = await taskService.updateTask(taskId, userId, taskData);

    if (!updatedTask) {
      logger.info({ taskId, userId }, "Task not found for update");
      sendResponse(res, 404, "Task not found");
      return;
    }

    logger.info({ taskId, userId, taskData }, "Task updated successfully");
    sendResponse(res, 200, "Task updated successfully", updatedTask);
  } catch (error) {
    logger.error({ error, taskId: req.params.id }, "Error updating task");
    sendResponse(res, 500, "Internal server error");
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const taskId = parseInt(req.params.id);

    if (!userId) {
      sendResponse(res, 400, "Unauthorized");
      return;
    }

    if (isNaN(taskId)) {
      sendResponse(res, 400, "Invalid task ID");
      return;
    }

    const success = await taskService.deleteTask(taskId, userId);

    if (!success) {
      logger.info({ taskId, userId }, "Task not found for deletion");
      sendResponse(res, 404, "Task not found");
      return;
    }

    logger.info({ taskId, userId }, "Task deleted successfully");
    sendResponse(res, 200, "Task deleted successfully");
  } catch (error) {
    logger.error({ error, taskId: req.params.id }, "Error deleting task");
    sendResponse(res, 500, "Internal server error");
  }
};
