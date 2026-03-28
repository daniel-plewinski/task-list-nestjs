import { Task } from '../entities/task.entity';
import { ITaskFactory } from './task-factory.interface';

export class TaskFactory implements ITaskFactory {
  create(description: string): Task {
    return new Task(0, description);
  }
}
