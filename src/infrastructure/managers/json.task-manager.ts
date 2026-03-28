import * as fs from 'fs';
import { Task } from '../../domain/entities/task.entity';
import { ITaskManager } from '../../application/interfaces/task-manager.interface';
import { JsonTaskRepository } from '../repositories/json.task-repository';
import { IIndexProvider } from '../providers/index-provider.interface';

export class JsonTaskManager implements ITaskManager {
  constructor(
    private readonly indexProvider: IIndexProvider,
    private readonly jsonTaskRepository: JsonTaskRepository,
    private readonly path: string,
  ) {}

  add(task: Task): void {
    const data = this.readJsonFile();
    data.push({
      id: this.indexProvider.nextInt(),
      description: task.description,
    });
    this.writeJsonFile(data);
  }

  remove(task: Task): void {
    const data = this.readJsonFile();
    const filteredData = data.filter((item) => item.id !== task.id);
    this.writeJsonFile(filteredData);
  }

  update(task: Task): void {
    const data = this.readJsonFile();
    const updatedData = data.map((item) =>
      item.id === task.id ? { ...item, description: task.description } : item,
    );
    this.writeJsonFile(updatedData);
  }

  private readJsonFile(): Array<{ id: number; description: string }> {
    const content = fs.readFileSync(this.path, 'utf-8');
    return JSON.parse(content);
  }

  private writeJsonFile(
    data: Array<{ id: number; description: string }>,
  ): void {
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(this.path, content);
  }
}
