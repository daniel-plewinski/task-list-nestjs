import * as fs from 'fs';
import { Task } from '../../domain/entities/task.entity';
import { EntityNotFoundException } from '../../domain/exceptions/entity-not-found.exception';
import { ITaskRepository } from './task-repository.interface';

export class FileTaskRepository implements ITaskRepository {
  constructor(private readonly path: string) {}

  findById(id: number): Task {
    const content = fs.readFileSync(this.path, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      const parsed = this.parseLine(line);
      if (parsed.id === id) {
        return new Task(id, parsed.description);
      }
    }

    throw new EntityNotFoundException();
  }

  findAll(): Task[] {
    const content = fs.readFileSync(this.path, 'utf-8');
    const lines = content.split('\n');

    return lines
      .filter((line) => line.trim())
      .map((line) => {
        const parsed = this.parseLine(line);
        return new Task(parsed.id, parsed.description);
      });
  }

  private parseLine(line: string): { id: number; description: string } {
    const match = line.match(/^(\d+)\s+(.+)$/);
    if (!match) {
      throw new Error(`Invalid line format: ${line}`);
    }
    return {
      id: parseInt(match[1], 10),
      description: match[2],
    };
  }
}
