import { UpdateTaskUseCase } from '../../../src/application/use-cases/update-task.use-case';
import { Task } from '../../../src/domain/entities/task.entity';
import { EntityNotFoundException } from '../../../src/domain/exceptions/entity-not-found.exception';

describe('UpdateTaskUseCase', () => {
  let updateTaskUseCase: UpdateTaskUseCase;
  let taskManager: any;
  let taskRepository: any;

  beforeEach(() => {
    taskManager = {
      update: jest.fn(),
    };
    taskRepository = {
      findById: jest.fn(),
    };
    updateTaskUseCase = new UpdateTaskUseCase(taskManager, taskRepository);
  });

  it('should update a task successfully', () => {
    const task = new Task(1, 'Original description');
    taskRepository.findById.mockReturnValue(task);

    updateTaskUseCase.update(1, 'Updated description');

    expect(taskRepository.findById).toHaveBeenCalledWith(1);
    expect(task.description).toBe('Updated description');
    expect(taskManager.update).toHaveBeenCalledWith(task);
  });

  it('should throw EntityNotFoundException when task does not exist', () => {
    taskRepository.findById.mockImplementation(() => {
      throw new EntityNotFoundException();
    });

    expect(() => updateTaskUseCase.update(999, 'Updated description')).toThrow(
      EntityNotFoundException,
    );
  });

  it('should update only the description', () => {
    const task = new Task(1, 'Original description');
    taskRepository.findById.mockReturnValue(task);

    updateTaskUseCase.update(1, 'Updated description');

    expect(task.id).toBe(1);
    expect(task.description).toBe('Updated description');
  });
});
