import { Task } from '../../domain/entities/task.entity';
import { ITaskManager } from '../interfaces/task-manager.interface';
import { IDeleteTaskUseCase } from '../interfaces/delete-task.use-case.interface';
import { ITaskRepository } from '../interfaces/task-repository.interface';

export class DeleteTaskUseCase implements IDeleteTaskUseCase {
  constructor(
    private readonly taskManager: ITaskManager,
    private readonly taskRepository: ITaskRepository,
  ) {}

  remove(id: number): void {
    const task: Task = this.taskRepository.findById(id);
    this.taskManager.remove(task);
  }
}
