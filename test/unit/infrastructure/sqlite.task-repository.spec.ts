import Database from 'better-sqlite3';
import { SqliteTaskRepository } from '../../../src/infrastructure/repositories/sqlite.task-repository';
import { EntityNotFoundException } from '../../../src/domain/exceptions/entity-not-found.exception';
import * as fs from 'fs';
import * as path from 'path';

describe('SqliteTaskRepository', () => {
  let repository: SqliteTaskRepository;
  let db: Database.Database;
  const dbPath = path.join(__dirname, 'test-sqlite-repository.db');

  beforeEach(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
    db = new Database(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS task (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL
      )
    `);
    repository = new SqliteTaskRepository(db);
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  it('should find a task by id', () => {
    db.prepare('INSERT INTO task (description) VALUES (?)').run('Test task');
    const task = repository.findById(1);
    expect(task.id).toBe(1);
    expect(task.description).toBe('Test task');
  });

  it('should throw EntityNotFoundException when task does not exist', () => {
    expect(() => repository.findById(999)).toThrow(EntityNotFoundException);
  });

  it('should return empty array when no tasks exist', () => {
    const tasks = repository.findAll();
    expect(tasks).toEqual([]);
  });

  it('should find all tasks', () => {
    db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 1');
    db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 2');
    db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 3');

    const tasks = repository.findAll();
    expect(tasks.length).toBe(3);
    expect(tasks[0].description).toBe('Task 1');
    expect(tasks[1].description).toBe('Task 2');
    expect(tasks[2].description).toBe('Task 3');
  });

  it('should return tasks in correct order', () => {
    db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 1');
    db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 2');
    db.prepare('INSERT INTO task (description) VALUES (?)').run('Task 3');

    const tasks = repository.findAll();
    expect(tasks[0].id).toBe(1);
    expect(tasks[1].id).toBe(2);
    expect(tasks[2].id).toBe(3);
  });
});
