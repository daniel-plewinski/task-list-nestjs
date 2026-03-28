import { Task } from '../../domain/entities/task.entity';

export interface ITaskManager {
  add(task: Task): void;
  remove(task: Task): void;
  update(task: Task): void;
}
