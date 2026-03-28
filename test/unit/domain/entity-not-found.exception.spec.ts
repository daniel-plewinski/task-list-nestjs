import { EntityNotFoundException } from '../../../src/domain/exceptions/entity-not-found.exception';

describe('EntityNotFoundException', () => {
  it('should create exception with default message', () => {
    const exception = new EntityNotFoundException();
    expect(exception.message).toBe('Entity not found');
    expect(exception.name).toBe('EntityNotFoundException');
  });

  it('should create exception with custom message', () => {
    const exception = new EntityNotFoundException('Custom error');
    expect(exception.message).toBe('Custom error');
    expect(exception.name).toBe('EntityNotFoundException');
  });

  it('should be an instance of Error', () => {
    const exception = new EntityNotFoundException();
    expect(exception).toBeInstanceOf(Error);
    expect(exception).toBeInstanceOf(EntityNotFoundException);
  });
});
