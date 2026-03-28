import * as fs from 'fs';
import * as path from 'path';
import { FileTaskManager } from '../../../src/infrastructure/managers/file.task-manager';
import { FileTaskRepository } from '../../../src/infrastructure/repositories/file.task-repository';
import { Task } from '../../../src/domain/entities/task.entity';

describe('FileTaskManager', () => {
  let tempFilePath: string;
  let manager: FileTaskManager;
  let indexProvider: any;
  let repository: FileTaskRepository;

  beforeEach(() => {
    tempFilePath = path.join(__dirname, `temp-test-${Date.now()}.txt`);
    fs.writeFileSync(tempFilePath, '');

    indexProvider = {
      nextInt: jest.fn().mockReturnValue(1),
    };

    repository = new FileTaskRepository(tempFilePath);
    manager = new FileTaskManager(indexProvider, repository, tempFilePath);
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });

  describe('add', () => {
    it('should append a task to the file', () => {
      const task = new Task(0, 'New task');
      manager.add(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      const lines = content.trim().split('\n');

      expect(lines.length).toBe(1);
      expect(lines[0]).toContain('New task');
    });

    it('should use indexProvider to generate id', () => {
      indexProvider.nextInt.mockReturnValue(5);
      const task = new Task(0, 'New task');
      manager.add(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      expect(content).toContain('5 ');
      expect(indexProvider.nextInt).toHaveBeenCalled();
    });

    it('should append multiple tasks on separate lines', () => {
      manager.add(new Task(0, 'Task 1'));
      manager.add(new Task(0, 'Task 2'));

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      const lines = content.trim().split('\n');

      expect(lines.length).toBe(2);
    });
  });

  describe('remove', () => {
    it('should remove a task from the file', () => {
      fs.writeFileSync(tempFilePath, '1 Task 1\n2 Task 2\n');

      const task = new Task(1, 'Task 1');
      manager.remove(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      expect(content).not.toContain('Task 1');
      expect(content).toContain('Task 2');
    });

    it('should handle removing non-existent task', () => {
      fs.writeFileSync(tempFilePath, '1 Task 1\n');

      const task = new Task(999, 'Non-existent');
      manager.remove(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      expect(content).toContain('Task 1');
    });
  });

  describe('update', () => {
    it('should update a task in the file', () => {
      fs.writeFileSync(tempFilePath, '1 Original\n2 Task 2\n');

      const task = new Task(1, 'Updated');
      manager.update(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      expect(content).toContain('Updated');
      expect(content).not.toContain('Original');
    });

    it('should preserve other tasks when updating', () => {
      fs.writeFileSync(tempFilePath, '1 Task 1\n2 Task 2\n');

      const task = new Task(1, 'Updated Task 1');
      manager.update(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      expect(content).toContain('Updated Task 1');
      expect(content).toContain('Task 2');
    });
  });
});
