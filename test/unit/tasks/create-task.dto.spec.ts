import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from '../../../src/tasks/dto/create-task.dto';

describe('CreateTaskDto', () => {
  it('should validate a valid CreateTaskDto', async () => {
    const dto = plainToInstance(CreateTaskDto, { description: 'Test task' });
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should reject empty description', async () => {
    const dto = plainToInstance(CreateTaskDto, { description: '' });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should reject missing description', async () => {
    const dto = plainToInstance(CreateTaskDto, {});
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('description');
  });

  it('should reject non-string description', async () => {
    const dto = plainToInstance(CreateTaskDto, { description: 123 });
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should accept description with special characters', async () => {
    const dto = plainToInstance(CreateTaskDto, { description: 'Task @#$%' });
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should accept long description', async () => {
    const longDescription = 'A'.repeat(1000);
    const dto = plainToInstance(CreateTaskDto, {
      description: longDescription,
    });
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
