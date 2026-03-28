import { FileTaskRepository } from '../../../src/infrastructure/repositories/file.task-repository';
import { EntityNotFoundException } from '../../../src/domain/exceptions/entity-not-found.exception';
import * as fs from 'fs';
import * as path from 'path';

describe('FileTaskRepository', () => {
  let repository: FileTaskRepository;
  const filePath = path.join(__dirname, 'test-file-repository.txt');

  beforeEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    repository = new FileTaskRepository(filePath);
  });

  afterEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  it('should find a task by id', () => {
    fs.writeFileSync(filePath, '1 Test task\n2 Another task\n');
    const task = repository.findById(1);
    expect(task.id).toBe(1);
    expect(task.description).toBe('Test task');
  });

  it('should throw EntityNotFoundException when task does not exist', () => {
    fs.writeFileSync(filePath, '1 Test task\n');
    expect(() => repository.findById(999)).toThrow(EntityNotFoundException);
  });

  it('should return empty array when file is empty', () => {
    fs.writeFileSync(filePath, '');
    const tasks = repository.findAll();
    expect(tasks).toEqual([]);
  });

  it('should find all tasks', () => {
    fs.writeFileSync(filePath, '1 Task 1\n2 Task 2\n3 Task 3\n');
    const tasks = repository.findAll();
    expect(tasks.length).toBe(3);
    expect(tasks[0].description).toBe('Task 1');
    expect(tasks[1].description).toBe('Task 2');
    expect(tasks[2].description).toBe('Task 3');
  });

  it('should handle tasks with spaces in description', () => {
    fs.writeFileSync(filePath, '1 This is a long task description\n');
    const tasks = repository.findAll();
    expect(tasks.length).toBe(1);
    expect(tasks[0].description).toBe('This is a long task description');
  });

  it('should skip empty lines', () => {
    fs.writeFileSync(filePath, '1 Task 1\n\n2 Task 2\n');
    const tasks = repository.findAll();
    expect(tasks.length).toBe(2);
  });
});
