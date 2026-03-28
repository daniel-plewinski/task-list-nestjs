import { CreateTaskUseCase } from '../../../src/application/use-cases/create-task.use-case';
import { TaskFactory } from '../../../src/domain/factories/task-factory';
import { Task } from '../../../src/domain/entities/task.entity';

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;
  let taskFactory: TaskFactory;
  let taskManager: any;

  beforeEach(() => {
    taskFactory = new TaskFactory();
    taskManager = {
      add: jest.fn(),
    };
    createTaskUseCase = new CreateTaskUseCase(taskFactory, taskManager);
  });

  it('should create a task and add it to the manager', () => {
    createTaskUseCase.store('Test task');
    expect(taskManager.add).toHaveBeenCalledTimes(1);
    expect(taskManager.add).toHaveBeenCalledWith(expect.any(Task));
  });

  it('should pass the correct description to the task', () => {
    createTaskUseCase.store('Test task');
    const addedTask = (taskManager.add as jest.Mock).mock.calls[0][0] as Task;
    expect(addedTask.description).toBe('Test task');
  });

  it('should create a task with id 0', () => {
    createTaskUseCase.store('Test task');
    const addedTask = (taskManager.add as jest.Mock).mock.calls[0][0] as Task;
    expect(addedTask.id).toBe(0);
  });
});
