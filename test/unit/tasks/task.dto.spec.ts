import { TaskDto } from '../../../src/tasks/dto/task.dto';
import { Task } from '../../../src/domain/entities/task.entity';

describe('TaskDto', () => {
  it('should create a TaskDto with correct properties', () => {
    const dto = new TaskDto(1, 'Test description');

    expect(dto.id).toBe(1);
    expect(dto.description).toBe('Test description');
  });

  it('should convert Task entity to TaskDto', () => {
    const task = new Task(5, 'Entity description');
    const dto = TaskDto.fromEntity(task);

    expect(dto.id).toBe(5);
    expect(dto.description).toBe('Entity description');
  });

  it('should handle task with empty description', () => {
    const task = new Task(1, '');
    const dto = TaskDto.fromEntity(task);

    expect(dto.id).toBe(1);
    expect(dto.description).toBe('');
  });

  it('should handle task with special characters', () => {
    const task = new Task(1, 'Task with special chars: @#$%^&*()');
    const dto = TaskDto.fromEntity(task);

    expect(dto.id).toBe(1);
    expect(dto.description).toBe('Task with special chars: @#$%^&*()');
  });
});
