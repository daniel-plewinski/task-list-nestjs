import { Task } from '../../domain/entities/task.entity';

export interface ITaskRepository {
  findById(id: number): Task;
  findAll(): Task[];
}
