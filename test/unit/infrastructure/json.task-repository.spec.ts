import { JsonTaskRepository } from '../../../src/infrastructure/repositories/json.task-repository';
import { EntityNotFoundException } from '../../../src/domain/exceptions/entity-not-found.exception';
import * as fs from 'fs';
import * as path from 'path';

describe('JsonTaskRepository', () => {
  let repository: JsonTaskRepository;
  const filePath = path.join(__dirname, 'test-json-repository.json');

  beforeEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    repository = new JsonTaskRepository(filePath);
  });

  afterEach(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  it('should find a task by id', () => {
    const data = [
      { id: 1, description: 'Task 1' },
      { id: 2, description: 'Task 2' },
    ];
    fs.writeFileSync(filePath, JSON.stringify(data));
    const task = repository.findById(1);
    expect(task.id).toBe(1);
    expect(task.description).toBe('Task 1');
  });

  it('should throw EntityNotFoundException when task does not exist', () => {
    const data = [{ id: 1, description: 'Task 1' }];
    fs.writeFileSync(filePath, JSON.stringify(data));
    expect(() => repository.findById(999)).toThrow(EntityNotFoundException);
  });

  it('should return empty array when file is empty', () => {
    fs.writeFileSync(filePath, '[]');
    const tasks = repository.findAll();
    expect(tasks).toEqual([]);
  });

  it('should find all tasks', () => {
    const data = [
      { id: 1, description: 'Task 1' },
      { id: 2, description: 'Task 2' },
      { id: 3, description: 'Task 3' },
    ];
    fs.writeFileSync(filePath, JSON.stringify(data));
    const tasks = repository.findAll();
    expect(tasks.length).toBe(3);
    expect(tasks[0].description).toBe('Task 1');
    expect(tasks[1].description).toBe('Task 2');
    expect(tasks[2].description).toBe('Task 3');
  });

  it('should handle pretty-printed JSON', () => {
    const data = [
      { id: 1, description: 'Task 1' },
      { id: 2, description: 'Task 2' },
    ];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    const tasks = repository.findAll();
    expect(tasks.length).toBe(2);
  });
});
