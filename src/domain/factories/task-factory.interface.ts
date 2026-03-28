import { Task } from '../entities/task.entity';

export interface ITaskFactory {
  create(description: string): Task;
}
