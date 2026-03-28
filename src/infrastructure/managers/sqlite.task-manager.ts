import Database from 'better-sqlite3';
import { Task } from '../../domain/entities/task.entity';
import { ITaskManager } from '../../application/interfaces/task-manager.interface';
import { ITaskRepository } from '../repositories/task-repository.interface';

export class SqliteTaskManager implements ITaskManager {
  constructor(
    private readonly db: Database.Database,
    private readonly repository: ITaskRepository,
  ) {}

  add(task: Task): void {
    this.db
      .prepare('INSERT INTO task (description) VALUES (?)')
      .run(task.description);
  }

  remove(task: Task): void {
    this.db.prepare('DELETE FROM task WHERE id = ?').run(task.id);
  }

  update(task: Task): void {
    this.db
      .prepare('UPDATE task SET description = ? WHERE id = ?')
      .run(task.description, task.id);
  }
}
