import Database from 'better-sqlite3';
import { Task } from '../../domain/entities/task.entity';
import { EntityNotFoundException } from '../../domain/exceptions/entity-not-found.exception';
import { ITaskRepository } from './task-repository.interface';

export class SqliteTaskRepository implements ITaskRepository {
  constructor(private readonly db: Database.Database) {}

  findById(id: number): Task {
    const row = this.db.prepare('SELECT * FROM task WHERE id = ?').get(id) as
      | { id: number; description: string }
      | undefined;

    if (!row) {
      throw new EntityNotFoundException();
    }

    return new Task(row.id, row.description);
  }

  findAll(): Task[] {
    const rows = this.db.prepare('SELECT * FROM task').all() as Array<{
      id: number;
      description: string;
    }>;

    return rows.map((row) => new Task(row.id, row.description));
  }
}
