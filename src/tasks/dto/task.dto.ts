export class TaskDto {
  id: number;
  description: string;

  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }

  static fromEntity(
    task: import('../../domain/entities/task.entity').Task,
  ): TaskDto {
    return new TaskDto(task.id, task.description);
  }
}
