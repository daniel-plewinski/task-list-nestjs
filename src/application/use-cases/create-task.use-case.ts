import { TaskFactory } from '../../domain/factories/task-factory';
import { Task } from '../../domain/entities/task.entity';
import { ITaskManager } from '../interfaces/task-manager.interface';
import { ICreateTaskUseCase } from '../interfaces/create-task.use-case.interface';

export class CreateTaskUseCase implements ICreateTaskUseCase {
  constructor(
    private readonly taskFactory: TaskFactory,
    private readonly taskManager: ITaskManager,
  ) {}

  store(description: string): void {
    const task: Task = this.taskFactory.create(description);
    this.taskManager.add(task);
  }
}
