import { Request, Response } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  reorderTask,
} from "../../src/controllers/taskController";
import { TaskService } from "../../src/services/taskService";
import { sendResponse } from "../../src/utils/responseHelper";
import logger from "../../src/utils/logger";

// Mock dependencies
jest.mock("../../src/services/taskService");
jest.mock("../../src/utils/responseHelper");
jest.mock("../../src/utils/logger");

describe("Task Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockTaskService: jest.Mocked<TaskService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request and response mocks
    mockRequest = {
      body: {},
      params: {},
    };

    // Mock user in request (added by auth middleware)
    (mockRequest as any).user = { id: 123 };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Setup TaskService mock
    mockTaskService = new TaskService() as jest.Mocked<TaskService>;
    (TaskService as jest.Mock).mockImplementation(() => mockTaskService);
  });

  describe("getAllTasks", () => {
    it("should get all tasks successfully", async () => {
      // Arrange
      const mockTasks = [
        {
          id: 1,
          description: "Task 1",
          is_completed: false,
          position: 1,
          user_id: "123",
          createdAt: new Date(),
          updatedAt: null,
        },
        {
          id: 2,
          description: "Task 2",
          is_completed: true,
          position: 2,
          user_id: "123",
          createdAt: new Date(),
          updatedAt: null,
        },
      ];
      mockTaskService.getAllTasks.mockResolvedValue(mockTasks);

      // Act
      await getAllTasks(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.getAllTasks).toHaveBeenCalledWith(123);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        200,
        "Tasks retrieved successfully",
        mockTasks
      );
    });

    it("should return 400 if user is not authenticated", async () => {
      // Arrange
      (mockRequest as any).user = {};

      // Act
      await getAllTasks(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Unauthorized"
      );
      expect(mockTaskService.getAllTasks).not.toHaveBeenCalled();
    });

    it("should handle errors when getting tasks", async () => {
      // Arrange
      const error = new Error("Database error");
      mockTaskService.getAllTasks.mockRejectedValue(error);

      // Act
      await getAllTasks(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.getAllTasks).toHaveBeenCalledWith(123);
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Internal server error"
      );
    });
  });

  describe("getTaskById", () => {
    it("should get task by id successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      const mockTask = {
        id: 1,
        description: "Task 1",
        is_completed: false,
        position: 1,
        user_id: "123",
        createdAt: new Date(),
        updatedAt: null,
      };
      mockTaskService.getTaskById.mockResolvedValue(mockTask);

      // Act
      await getTaskById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(1, 123);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        200,
        "Task retrieved successfully",
        mockTask
      );
    });

    it("should return 400 if user is not authenticated", async () => {
      // Arrange
      (mockRequest as any).user = {};
      mockRequest.params = { id: "1" };

      // Act
      await getTaskById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Unauthorized"
      );
      expect(mockTaskService.getTaskById).not.toHaveBeenCalled();
    });

    it("should return 404 if task not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockTaskService.getTaskById.mockResolvedValue(null);

      // Act
      await getTaskById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(999, 123);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        404,
        "Task not found"
      );
    });

    it("should handle errors when getting task by id", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      const error = new Error("Database error");
      mockTaskService.getTaskById.mockRejectedValue(error);

      // Act
      await getTaskById(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(1, 123);
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Internal server error"
      );
    });
  });

  describe("createTask", () => {
    it("should create task successfully", async () => {
      // Arrange
      mockRequest.body = {
        description: "New Task",
        dueDate: "2023-12-31",
      };

      const mockNewTask = {
        id: 1,
        description: "New Task",
        is_completed: false,
        position: 1,
        user_id: "123",
        createdAt: new Date(),
        updatedAt: null,
      };

      mockTaskService.createTask.mockResolvedValue(mockNewTask);

      // Act
      await createTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.createTask).toHaveBeenCalledWith(
        mockRequest.body,
        123
      );
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        201,
        "Task created successfully",
        mockNewTask
      );
    });

    it("should return 400 if user is not authenticated", async () => {
      // Arrange
      (mockRequest as any).user = {};
      mockRequest.body = { description: "New Task" };

      // Act
      await createTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Unauthorized"
      );
      expect(mockTaskService.createTask).not.toHaveBeenCalled();
    });

    it("should handle errors when creating task", async () => {
      // Arrange
      mockRequest.body = { description: "New Task" };
      const error = new Error("Database error");
      mockTaskService.createTask.mockRejectedValue(error);

      // Act
      await createTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.createTask).toHaveBeenCalledWith(
        mockRequest.body,
        123
      );
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Internal server error"
      );
    });
  });

  describe("updateTask", () => {
    it("should update task successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = {
        description: "Updated Task",
        is_completed: true,
      };

      const mockUpdatedTask = {
        id: 1,
        description: "Updated Task",
        is_completed: true,
        position: 1,
        user_id: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskService.updateTask.mockResolvedValue(mockUpdatedTask);

      // Act
      await updateTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(
        1,
        123,
        mockRequest.body
      );
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        200,
        "Task updated successfully",
        mockUpdatedTask
      );
    });

    it("should return 400 if user is not authenticated", async () => {
      // Arrange
      (mockRequest as any).user = {};
      mockRequest.params = { id: "1" };
      mockRequest.body = { description: "Updated Task" };

      // Act
      await updateTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Unauthorized"
      );
      expect(mockTaskService.updateTask).not.toHaveBeenCalled();
    });

    it("should return 400 if no update data provided", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = {};

      // Act
      await updateTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "No update data provided"
      );
      expect(mockTaskService.updateTask).not.toHaveBeenCalled();
    });

    it("should return 404 if task not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockRequest.body = { description: "Updated Task" };
      mockTaskService.updateTask.mockResolvedValue(null);

      // Act
      await updateTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(
        999,
        123,
        mockRequest.body
      );
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        404,
        "Task not found"
      );
    });

    it("should handle errors when updating task", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = { description: "Updated Task" };
      const error = new Error("Database error");
      mockTaskService.updateTask.mockRejectedValue(error);

      // Act
      await updateTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(
        1,
        123,
        mockRequest.body
      );
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Internal server error"
      );
    });
  });

  describe("deleteTask", () => {
    it("should delete task successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockTaskService.deleteTask.mockResolvedValue(true);

      // Act
      await deleteTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1, 123);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        200,
        "Task deleted successfully"
      );
    });

    it("should return 400 if user is not authenticated", async () => {
      // Arrange
      (mockRequest as any).user = {};
      mockRequest.params = { id: "1" };

      // Act
      await deleteTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Unauthorized"
      );
      expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
    });

    it("should return 404 if task not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockTaskService.deleteTask.mockResolvedValue(false);

      // Act
      await deleteTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(999, 123);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        404,
        "Task not found"
      );
    });

    it("should handle errors when deleting task", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      const error = new Error("Database error");
      mockTaskService.deleteTask.mockRejectedValue(error);

      // Act
      await deleteTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1, 123);
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Internal server error"
      );
    });
  });

  describe("reorderTask", () => {
    it("should reorder task successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = { newPosition: 2 };

      const mockUpdatedTasks = [
        {
          id: 2,
          description: "Task 2",
          is_completed: false,
          position: 1,
          user_id: "123",
          createdAt: new Date(),
          updatedAt: null,
        },
        {
          id: 1,
          description: "Task 1",
          is_completed: false,
          position: 2,
          user_id: "123",
          createdAt: new Date(),
          updatedAt: null,
        },
        {
          id: 3,
          description: "Task 3",
          is_completed: false,
          position: 3,
          user_id: "123",
          createdAt: new Date(),
          updatedAt: null,
        },
      ];

      mockTaskService.reorderTasks.mockResolvedValue(mockUpdatedTasks);

      // Act
      await reorderTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.reorderTasks).toHaveBeenCalledWith(123, 1, 2);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        200,
        "Task reordered successfully",
        mockUpdatedTasks
      );
    });

    it("should return 400 if user is not authenticated", async () => {
      // Arrange
      (mockRequest as any).user = {};
      mockRequest.params = { id: "1" };
      mockRequest.body = { newPosition: 2 };

      // Act
      await reorderTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Unauthorized"
      );
      expect(mockTaskService.reorderTasks).not.toHaveBeenCalled();
    });

    it("should return 400 if task id is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "invalid" };
      mockRequest.body = { newPosition: 2 };

      // Act
      await reorderTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Invalid task ID"
      );
      expect(mockTaskService.reorderTasks).not.toHaveBeenCalled();
    });

    it("should return 400 if newPosition is invalid", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = { newPosition: -1 };

      // Act
      await reorderTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        400,
        "Valid newPosition is required"
      );
      expect(mockTaskService.reorderTasks).not.toHaveBeenCalled();
    });

    it("should return 404 if task not found", async () => {
      // Arrange
      mockRequest.params = { id: "999" };
      mockRequest.body = { newPosition: 2 };
      mockTaskService.reorderTasks.mockResolvedValue(null);

      // Act
      await reorderTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.reorderTasks).toHaveBeenCalledWith(123, 999, 2);
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        404,
        "Task not found"
      );
    });

    it("should handle errors when reordering task", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = { newPosition: 2 };
      const error = new Error("Database error");
      mockTaskService.reorderTasks.mockRejectedValue(error);

      // Act
      await reorderTask(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockTaskService.reorderTasks).toHaveBeenCalledWith(123, 1, 2);
      expect(logger.error).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        500,
        "Internal server error"
      );
    });
  });
});
