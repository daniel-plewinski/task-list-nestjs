import { TaskFactory } from '../../../src/domain/factories/task-factory';
import { Task } from '../../../src/domain/entities/task.entity';

describe('TaskFactory', () => {
  let taskFactory: TaskFactory;

  beforeEach(() => {
    taskFactory = new TaskFactory();
  });

  it('should create a task with id 0 and provided description', () => {
    const task = taskFactory.create('Test task');
    expect(task).toBeInstanceOf(Task);
    expect(task.id).toBe(0);
    expect(task.description).toBe('Test task');
  });

  it('should create different instances', () => {
    const task1 = taskFactory.create('Task 1');
    const task2 = taskFactory.create('Task 2');
    expect(task1).not.toBe(task2);
    expect(task1.description).not.toBe(task2.description);
  });
});
