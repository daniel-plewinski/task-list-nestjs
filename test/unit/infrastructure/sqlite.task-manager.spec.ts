import Database from 'better-sqlite3';
import { SqliteTaskManager } from '../../../src/infrastructure/managers/sqlite.task-manager';
import { SqliteTaskRepository } from '../../../src/infrastructure/repositories/sqlite.task-repository';
import { Task } from '../../../src/domain/entities/task.entity';

describe('SqliteTaskManager', () => {
  let db: Database.Database;
  let manager: SqliteTaskManager;
  let repository: SqliteTaskRepository;

  beforeEach(() => {
    db = new Database(':memory:');
    db.exec(
      'CREATE TABLE task (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT)',
    );

    repository = new SqliteTaskRepository(db);
    manager = new SqliteTaskManager(db, repository);
  });

  afterEach(() => {
    db.close();
  });

  describe('add', () => {
    it('should insert a task into the database', () => {
      const task = new Task(0, 'New task');
      manager.add(task);

      const result = db.prepare('SELECT * FROM task').all() as any[];
      expect(result.length).toBe(1);
      expect(result[0].description).toBe('New task');
    });

    it('should auto-generate id', () => {
      const task1 = new Task(0, 'Task 1');
      const task2 = new Task(0, 'Task 2');
      manager.add(task1);
      manager.add(task2);

      const result = db
        .prepare('SELECT * FROM task ORDER BY id')
        .all() as any[];
      expect(result.length).toBe(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });

  describe('remove', () => {
    it('should delete a task from the database', () => {
      db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 1');
      db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 2');

      const task = new Task(1, 'Task 1');
      manager.remove(task);

      const result = db.prepare('SELECT * FROM task').all() as any[];
      expect(result.length).toBe(1);
      expect(result[0].description).toBe('Task 2');
    });

    it('should handle removing non-existent task', () => {
      db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 1');

      const task = new Task(999, 'Non-existent');
      manager.remove(task);

      const result = db.prepare('SELECT * FROM task').all() as any[];
      expect(result.length).toBe(1);
    });
  });

  describe('update', () => {
    it('should update a task in the database', () => {
      db.prepare('INSERT INTO task (description) VALUES (?)').run('Original');
      db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 2');

      const task = new Task(1, 'Updated');
      manager.update(task);

      const result = db.prepare('SELECT * FROM task WHERE id = 1').get() as any;
      expect(result.description).toBe('Updated');
    });

    it('should preserve other tasks when updating', () => {
      db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 1');
      db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 2');

      const task = new Task(1, 'Updated Task 1');
      manager.update(task);

      const result = db.prepare('SELECT * FROM task WHERE id = 2').get() as any;
      expect(result.description).toBe('Task 2');
    });
  });
});
