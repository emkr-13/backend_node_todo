import { TaskRepository } from "../repositories/taskRepository";
import { CreateTaskDto, TaskDto, UpdateTaskDto } from "../dto/taskDto";

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getAllTasks(userId: string): Promise<TaskDto[]> {
    try {
      return await this.taskRepository.findAll(userId);
    } catch (error) {
      console.error("Error in TaskService.getAllTasks:", error);
      throw error;
    }
  }

  async getTaskById(taskId: number, userId: string): Promise<TaskDto | null> {
    try {
      const task = await this.taskRepository.findById(taskId, userId);
      return task || null;
    } catch (error) {
      console.error("Error in TaskService.getTaskById:", error);
      throw error;
    }
  }

  async createTask(taskData: CreateTaskDto, userId: string): Promise<TaskDto> {
    try {
      return await this.taskRepository.create(taskData, userId);
    } catch (error) {
      console.error("Error in TaskService.createTask:", error);
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
      console.error("Error in TaskService.updateTask:", error);
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
      console.error("Error in TaskService.deleteTask:", error);
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
      console.error("Error in TaskService.toggleTaskCompletion:", error);
      throw error;
    }
  }
}
