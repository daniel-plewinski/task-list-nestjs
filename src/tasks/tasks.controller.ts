import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
  Inject,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import { ICreateTaskUseCase } from '../application/interfaces/create-task.use-case.interface';
import { IUpdateTaskUseCase } from '../application/interfaces/update-task.use-case.interface';
import { IDeleteTaskUseCase } from '../application/interfaces/delete-task.use-case.interface';
import { ITaskRepository } from '../application/interfaces/task-repository.interface';
import { EntityNotFoundException } from '../domain/exceptions/entity-not-found.exception';

@Controller('tasks')
export class TasksController {
  constructor(
    @Inject('ICreateTaskUseCase')
    private readonly createTaskUseCase: ICreateTaskUseCase,
    @Inject('IUpdateTaskUseCase')
    private readonly updateTaskUseCase: IUpdateTaskUseCase,
    @Inject('IDeleteTaskUseCase')
    private readonly deleteTaskUseCase: IDeleteTaskUseCase,
    @Inject('ITaskRepository') private readonly taskRepository: ITaskRepository,
  ) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<void> {
    this.createTaskUseCase.store(createTaskDto.description);
  }

  @Get()
  async findAll(): Promise<TaskDto[]> {
    const tasks = this.taskRepository.findAll();
    return tasks.map((task) => TaskDto.fromEntity(task));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaskDto> {
    try {
      const task = this.taskRepository.findById(parseInt(id, 10));
      return TaskDto.fromEntity(task);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Patch()
  async update(@Body() updateTaskDto: UpdateTaskDto): Promise<void> {
    try {
      this.updateTaskUseCase.update(
        updateTaskDto.id,
        updateTaskDto.description,
      );
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      this.deleteTaskUseCase.remove(parseInt(id, 10));
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }
}
