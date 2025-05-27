import { Request, Response } from "express";
import { sendResponse } from "../utils/responseHelper";
import { TaskService } from "../services/taskService";
import { CreateTaskDto, UpdateTaskDto } from "../dto/taskDto";

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
    sendResponse(res, 200, "Tasks retrieved successfully", tasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
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
      sendResponse(res, 404, "Task not found");
      return;
    }

    sendResponse(res, 200, "Task retrieved successfully", task);
  } catch (error) {
    console.error("Error retrieving task:", error);
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
    sendResponse(res, 201, "Task created successfully", newTask);
  } catch (error) {
    console.error("Error creating task:", error);
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
      sendResponse(res, 404, "Task not found");
      return;
    }

    sendResponse(res, 200, "Task updated successfully", updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
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
      sendResponse(res, 404, "Task not found");
      return;
    }

    sendResponse(res, 200, "Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
