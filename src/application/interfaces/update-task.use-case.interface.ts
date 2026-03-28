export interface IUpdateTaskUseCase {
  update(id: number, description: string): void;
}
