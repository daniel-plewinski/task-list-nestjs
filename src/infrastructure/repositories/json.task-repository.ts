import * as fs from 'fs';
import { Task } from '../../domain/entities/task.entity';
import { EntityNotFoundException } from '../../domain/exceptions/entity-not-found.exception';
import { ITaskRepository } from './task-repository.interface';

interface TaskData {
  id: number;
  description: string;
}

export class JsonTaskRepository implements ITaskRepository {
  constructor(private readonly path: string) {}

  findById(id: number): Task {
    const tasks = this.findAll();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      throw new EntityNotFoundException();
    }

    return task;
  }

  findAll(): Task[] {
    const content = fs.readFileSync(this.path, 'utf-8');
    const data = JSON.parse(content) as TaskData[];

    return data.map((item) => new Task(item.id, item.description));
  }
}
