export class EntityNotFoundException extends Error {
  constructor(message: string = 'Entity not found') {
    super(message);
    this.name = 'EntityNotFoundException';
  }
}
