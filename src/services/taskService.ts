import { TaskRepository } from "../repositories/taskRepository";
import { CreateTaskDto, TaskDto, UpdateTaskDto } from "../dto/taskDto";
import logger from "../utils/logger";

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getAllTasks(userId: string): Promise<TaskDto[]> {
    try {
      return await this.taskRepository.findAll(userId);
    } catch (error) {
      logger.error({ error, userId }, "Error in TaskService.getAllTasks");
      throw error;
    }
  }

  async getTaskById(taskId: number, userId: string): Promise<TaskDto | null> {
    try {
      const task = await this.taskRepository.findById(taskId, userId);
      return task || null;
    } catch (error) {
      logger.error(
        { error, taskId, userId },
        "Error in TaskService.getTaskById"
      );
      throw error;
    }
  }

  async createTask(taskData: CreateTaskDto, userId: string): Promise<TaskDto> {
    try {
      return await this.taskRepository.create(taskData, userId);
    } catch (error) {
      logger.error(
        { error, userId, taskData },
        "Error in TaskService.createTask"
      );
      throw error;
    }
  }

  async updateTask(
    taskId: number,
    userId: string,
    taskData: UpdateTaskDto
  ): Promise<TaskDto | null> {
    try {
      const task = await this.taskRepository.findById(taskId, userId);
      if (!task) {
        return null;
      }

      return await this.taskRepository.update(taskId, userId, taskData);
    } catch (error) {
      logger.error(
        { error, taskId, userId, taskData },
        "Error in TaskService.updateTask"
      );
      throw error;
    }
  }

  async deleteTask(taskId: number, userId: string): Promise<boolean> {
    try {
      const task = await this.taskRepository.findById(taskId, userId);
      if (!task) {
        return false;
      }

      return await this.taskRepository.delete(taskId, userId);
    } catch (error) {
      logger.error(
        { error, taskId, userId },
        "Error in TaskService.deleteTask"
      );
      throw error;
    }
  }

  async toggleTaskCompletion(
    taskId: number,
    userId: string
  ): Promise<TaskDto | null> {
    try {
      const task = await this.taskRepository.findById(taskId, userId);
      if (!task) {
        return null;
      }

      return await this.taskRepository.update(taskId, userId, {
        is_completed: !task.is_completed,
      });
    } catch (error) {
      logger.error(
        { error, taskId, userId },
        "Error in TaskService.toggleTaskCompletion"
      );
      throw error;
    }
  }
}
