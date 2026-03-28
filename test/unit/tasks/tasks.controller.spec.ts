import { TasksController } from '../../../src/tasks/tasks.controller';
import { CreateTaskDto } from '../../../src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../../../src/tasks/dto/update-task.dto';
import { ICreateTaskUseCase } from '../../../src/application/interfaces/create-task.use-case.interface';
import { IUpdateTaskUseCase } from '../../../src/application/interfaces/update-task.use-case.interface';
import { IDeleteTaskUseCase } from '../../../src/application/interfaces/delete-task.use-case.interface';
import { ITaskRepository } from '../../../src/application/interfaces/task-repository.interface';
import { EntityNotFoundException } from '../../../src/domain/exceptions/entity-not-found.exception';
import { Task } from '../../../src/domain/entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let createTaskUseCase: ICreateTaskUseCase;
  let updateTaskUseCase: IUpdateTaskUseCase;
  let deleteTaskUseCase: IDeleteTaskUseCase;
  let taskRepository: ITaskRepository;

  beforeEach(() => {
    createTaskUseCase = {
      store: jest.fn(),
    } as unknown as ICreateTaskUseCase;

    updateTaskUseCase = {
      update: jest.fn(),
    } as unknown as IUpdateTaskUseCase;

    deleteTaskUseCase = {
      remove: jest.fn(),
    } as unknown as IDeleteTaskUseCase;

    taskRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    } as unknown as ITaskRepository;

    controller = new TasksController(
      createTaskUseCase,
      updateTaskUseCase,
      deleteTaskUseCase,
      taskRepository,
    );
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = { description: 'New task' };

      await controller.create(createTaskDto);

      expect((createTaskUseCase.store as jest.Mock).mock.calls.length).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const tasks = [new Task(1, 'Task 1'), new Task(2, 'Task 2')];
      (taskRepository.findAll as jest.Mock).mockReturnValue(tasks);

      const result = await controller.findAll();

      expect(taskRepository.findAll).toHaveBeenCalled();
      expect(result.length).toBe(2);
    });

    it('should return empty array when no tasks', async () => {
      (taskRepository.findAll as jest.Mock).mockReturnValue([]);

      const result = await controller.findAll();

      expect(result.length).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const task = new Task(1, 'Test task');
      (taskRepository.findById as jest.Mock).mockReturnValue(task);

      const result = await controller.findOne('1');

      expect(taskRepository.findById).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
      expect(result.description).toBe('Test task');
    });

    it('should throw 404 when task not found', async () => {
      (taskRepository.findById as jest.Mock).mockImplementation(() => {
        throw new EntityNotFoundException();
      });

      await expect(controller.findOne('999')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = { id: 1, description: 'Updated' };

      await controller.update(updateTaskDto);

      expect(updateTaskUseCase.update).toHaveBeenCalledWith(1, 'Updated');
    });

    it('should throw 404 when task not found', async () => {
      const updateTaskDto: UpdateTaskDto = { id: 999, description: 'Updated' };
      (updateTaskUseCase.update as jest.Mock).mockImplementation(() => {
        throw new EntityNotFoundException();
      });

      await expect(controller.update(updateTaskDto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      await controller.remove('1');

      expect(deleteTaskUseCase.remove).toHaveBeenCalledWith(1);
    });

    it('should throw 404 when task not found', async () => {
      (deleteTaskUseCase.remove as jest.Mock).mockImplementation(() => {
        throw new EntityNotFoundException();
      });

      await expect(controller.remove('999')).rejects.toThrow();
    });
  });
});
