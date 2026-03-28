import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateTaskDto } from '../../../src/tasks/dto/update-task.dto';

describe('UpdateTaskDto', () => {
  it('should validate a valid UpdateTaskDto', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      id: 1,
      description: 'Updated task',
    });
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should reject empty description', async () => {
    const dto = plainToInstance(UpdateTaskDto, { id: 1, description: '' });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should reject missing description', async () => {
    const dto = plainToInstance(UpdateTaskDto, { id: 1 });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should reject missing id', async () => {
    const dto = plainToInstance(UpdateTaskDto, { description: 'Test' });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('id');
  });

  it('should reject non-number id', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      id: '1',
      description: 'Test',
    });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should accept negative id', async () => {
    const dto = plainToInstance(UpdateTaskDto, { id: -1, description: 'Test' });
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should accept zero id', async () => {
    const dto = plainToInstance(UpdateTaskDto, { id: 0, description: 'Test' });
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should accept description with special characters', async () => {
    const dto = plainToInstance(UpdateTaskDto, {
      id: 1,
      description: 'Updated @#$%',
    });
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
