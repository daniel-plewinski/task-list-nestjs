import { DeleteTaskUseCase } from '../../../src/application/use-cases/delete-task.use-case';
import { Task } from '../../../src/domain/entities/task.entity';
import { EntityNotFoundException } from '../../../src/domain/exceptions/entity-not-found.exception';

describe('DeleteTaskUseCase', () => {
  let deleteTaskUseCase: DeleteTaskUseCase;
  let taskManager: any;
  let taskRepository: any;

  beforeEach(() => {
    taskManager = {
      remove: jest.fn(),
    };
    taskRepository = {
      findById: jest.fn(),
    };
    deleteTaskUseCase = new DeleteTaskUseCase(taskManager, taskRepository);
  });

  it('should delete a task successfully', () => {
    const task = new Task(1, 'Test task');
    taskRepository.findById.mockReturnValue(task);

    deleteTaskUseCase.remove(1);

    expect(taskRepository.findById).toHaveBeenCalledWith(1);
    expect(taskManager.remove).toHaveBeenCalledWith(task);
  });

  it('should throw EntityNotFoundException when task does not exist', () => {
    taskRepository.findById.mockImplementation(() => {
      throw new EntityNotFoundException();
    });

    expect(() => deleteTaskUseCase.remove(999)).toThrow(
      EntityNotFoundException,
    );
  });

  it('should call remove with the correct task', () => {
    const task = new Task(1, 'Test task');
    taskRepository.findById.mockReturnValue(task);

    deleteTaskUseCase.remove(1);

    expect(taskManager.remove).toHaveBeenCalledTimes(1);
    expect(taskManager.remove).toHaveBeenCalledWith(task);
  });
});
