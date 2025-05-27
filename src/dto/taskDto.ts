export interface TaskDto {
  id: number;
  description: string | null;
  is_completed: boolean;
  position: number;
  user_id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CreateTaskDto {
  description: string;
  position?: number;
}

export interface UpdateTaskDto {
  description?: string;
  is_completed?: boolean;
  position?: number;
}
