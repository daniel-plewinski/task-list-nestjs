import * as fs from 'fs';
import * as path from 'path';
import { JsonTaskManager } from '../../../src/infrastructure/managers/json.task-manager';
import { Task } from '../../../src/domain/entities/task.entity';
import { JsonTaskRepository } from '../../../src/infrastructure/repositories/json.task-repository';

describe('JsonTaskManager', () => {
  let tempFilePath: string;
  let manager: JsonTaskManager;
  let indexProvider: any;
  let repository: JsonTaskRepository;

  beforeEach(() => {
    tempFilePath = path.join(__dirname, `temp-test-${Date.now()}.json`);
    fs.writeFileSync(tempFilePath, '[]');

    indexProvider = {
      nextInt: jest.fn().mockReturnValue(1),
    };

    repository = new JsonTaskRepository(tempFilePath);
    manager = new JsonTaskManager(indexProvider, repository, tempFilePath);
  });

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  });

  describe('add', () => {
    it('should add a task to the JSON file', () => {
      const task = new Task(0, 'New task');
      manager.add(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      const data = JSON.parse(content);

      expect(data.length).toBe(1);
      expect(data[0].description).toBe('New task');
    });

    it('should use indexProvider to generate id', () => {
      indexProvider.nextInt.mockReturnValue(5);
      const task = new Task(0, 'New task');
      manager.add(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      const data = JSON.parse(content);

      expect(data[0].id).toBe(5);
      expect(indexProvider.nextInt).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a task from the JSON file', () => {
      fs.writeFileSync(
        tempFilePath,
        JSON.stringify([
          { id: 1, description: 'Task 1' },
          { id: 2, description: 'Task 2' },
        ]),
      );

      const task = new Task(1, 'Task 1');
      manager.remove(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      const data = JSON.parse(content);

      expect(data.length).toBe(1);
      expect(data[0].id).toBe(2);
    });

    it('should handle removing non-existent task', () => {
      fs.writeFileSync(
        tempFilePath,
        JSON.stringify([{ id: 1, description: 'Task 1' }]),
      );

      const task = new Task(999, 'Non-existent');
      manager.remove(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      const data = JSON.parse(content);

      expect(data.length).toBe(1);
    });
  });

  describe('update', () => {
    it('should update a task in the JSON file', () => {
      fs.writeFileSync(
        tempFilePath,
        JSON.stringify([
          { id: 1, description: 'Original' },
          { id: 2, description: 'Task 2' },
        ]),
      );

      const task = new Task(1, 'Updated');
      manager.update(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      const data = JSON.parse(content);

      expect(data.length).toBe(2);
      expect(data.find((d: any) => d.id === 1).description).toBe('Updated');
    });

    it('should not modify file when updating non-existent task', () => {
      fs.writeFileSync(
        tempFilePath,
        JSON.stringify([{ id: 1, description: 'Task 1' }]),
      );

      const task = new Task(999, 'Updated');
      manager.update(task);

      const content = fs.readFileSync(tempFilePath, 'utf-8');
      const data = JSON.parse(content);

      expect(data[0].description).toBe('Task 1');
    });
  });
});
