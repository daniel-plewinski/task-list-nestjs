import { Task } from '../../domain/entities/task.entity';
import { ITaskManager } from '../interfaces/task-manager.interface';
import { IUpdateTaskUseCase } from '../interfaces/update-task.use-case.interface';
import { ITaskRepository } from '../interfaces/task-repository.interface';

export class UpdateTaskUseCase implements IUpdateTaskUseCase {
  constructor(
    private readonly taskManager: ITaskManager,
    private readonly taskRepository: ITaskRepository,
  ) {}

  update(id: number, description: string): void {
    const task: Task = this.taskRepository.findById(id);
    task.description = description;
    this.taskManager.update(task);
  }
}
