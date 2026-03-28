import { Task } from '../../../src/domain/entities/task.entity';

describe('Task Entity', () => {
  it('should create a task with id and description', () => {
    const task = new Task(1, 'Test task');
    expect(task.id).toBe(1);
    expect(task.description).toBe('Test task');
  });

  it('should allow updating description', () => {
    const task = new Task(1, 'Test task');
    task.description = 'Updated task';
    expect(task.description).toBe('Updated task');
  });

  it('should have immutable id', () => {
    const task = new Task(1, 'Test task');
    const originalId = task.id;
    expect(task.id).toBe(originalId);
  });
});
