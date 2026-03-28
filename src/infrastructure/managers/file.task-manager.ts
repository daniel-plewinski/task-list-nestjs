import * as fs from 'fs';
import { Task } from '../../domain/entities/task.entity';
import { ITaskManager } from '../../application/interfaces/task-manager.interface';
import { FileTaskRepository } from '../repositories/file.task-repository';
import { IIndexProvider } from '../providers/index-provider.interface';

export class FileTaskManager implements ITaskManager {
  constructor(
    private readonly indexProvider: IIndexProvider,
    private readonly fileTaskRepository: FileTaskRepository,
    private readonly path: string,
  ) {}

  add(task: Task): void {
    const id = this.indexProvider.nextInt();
    const line = `${id} ${task.description}\n`;

    fs.appendFileSync(this.path, line);
  }

  remove(task: Task): void {
    const tasks = this.fileTaskRepository.findAll();
    const filteredTasks = tasks.filter((t) => t.id !== task.id);

    this.writeTasksToFile(filteredTasks);
  }

  update(task: Task): void {
    const tasks = this.fileTaskRepository.findAll();
    const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));

    this.writeTasksToFile(updatedTasks);
  }

  private writeTasksToFile(tasks: Task[]): void {
    const content = tasks.map((t) => `${t.id} ${t.description}`).join('\n');
    fs.writeFileSync(this.path, content + '\n');
  }
}
