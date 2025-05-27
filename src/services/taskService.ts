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

  async reorderTasks(
    userId: string,
    taskId: number,
    newPosition: number
  ): Promise<TaskDto[] | null> {
    try {
      // Check if task exists
      const task = await this.taskRepository.findById(taskId, userId);
      if (!task) {
        return null;
      }

      // Get all tasks
      const allTasks = await this.taskRepository.findAll(userId);

      // Update positions for all affected tasks
      for (const t of allTasks) {
        if (t.id === taskId) {
          // The task to be moved
          await this.taskRepository.update(t.id, userId, {
            position: newPosition,
          });
        } else if (task.position < newPosition) {
          // Tasks that need to move up (decrease position)
          if (t.position > task.position && t.position <= newPosition) {
            await this.taskRepository.update(t.id, userId, {
              position: t.position - 1,
            });
          }
        } else if (task.position > newPosition) {
          // Tasks that need to move down (increase position)
          if (t.position >= newPosition && t.position < task.position) {
            await this.taskRepository.update(t.id, userId, {
              position: t.position + 1,
            });
          }
        }
      }

      // Return updated tasks
      return await this.taskRepository.findAll(userId);
    } catch (error) {
      logger.error(
        { error, userId, taskId },
        "Error in TaskService.reorderTasks"
      );
      throw error;
    }
  }
}
