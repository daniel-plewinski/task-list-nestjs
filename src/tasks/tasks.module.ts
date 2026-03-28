import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksController } from './tasks.controller';
import { TaskFactory } from '../domain/factories/task-factory';
import { CreateTaskUseCase } from '../application/use-cases/create-task.use-case';
import { UpdateTaskUseCase } from '../application/use-cases/update-task.use-case';
import { DeleteTaskUseCase } from '../application/use-cases/delete-task.use-case';
import { SqliteTaskRepository } from '../infrastructure/repositories/sqlite.task-repository';
import { FileTaskRepository } from '../infrastructure/repositories/file.task-repository';
import { JsonTaskRepository } from '../infrastructure/repositories/json.task-repository';
import { SqliteTaskManager } from '../infrastructure/managers/sqlite.task-manager';
import { FileTaskManager } from '../infrastructure/managers/file.task-manager';
import { JsonTaskManager } from '../infrastructure/managers/json.task-manager';
import { FileIndexProvider } from '../infrastructure/providers/file-index.provider';
import Database from 'better-sqlite3';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [TasksController],
  providers: [
    {
      provide: 'TaskFactory',
      useClass: TaskFactory,
    },
    {
      provide: 'IndexProvider',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const indexPath =
          configService.get<string>('INDEX_FILE_PATH') || 'int.idx';
        return new FileIndexProvider(indexPath);
      },
    },
    {
      provide: 'SqliteDatabase',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbPath =
          configService.get<string>('SQLITE_DB_PATH') || 'database.sqlite';
        const db = new Database(dbPath);
        db.exec(`
          CREATE TABLE IF NOT EXISTS task (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL
          )
        `);
        return db;
      },
    },
    {
      provide: 'TaskRepository',
      inject: [ConfigService, 'SqliteDatabase'],
      useFactory: (configService: ConfigService, db: Database.Database) => {
        const storageType =
          configService.get<string>('STORAGE_TYPE') || 'sqlite';
        switch (storageType) {
          case 'file':
            const filePath =
              configService.get<string>('FILE_PATH') || 'data.txt';
            return new FileTaskRepository(filePath);
          case 'json':
            const jsonPath =
              configService.get<string>('JSON_PATH') || 'data.json';
            return new JsonTaskRepository(jsonPath);
          case 'sqlite':
          default:
            return new SqliteTaskRepository(db);
        }
      },
    },
    {
      provide: 'TaskManager',
      inject: [
        ConfigService,
        'IndexProvider',
        'TaskRepository',
        'SqliteDatabase',
      ],
      useFactory: (
        configService: ConfigService,
        indexProvider: import('../infrastructure/providers/index-provider.interface').IIndexProvider,
        taskRepository: import('../infrastructure/repositories/task-repository.interface').ITaskRepository,
        db: Database.Database,
      ) => {
        const storageType =
          configService.get<string>('STORAGE_TYPE') || 'sqlite';
        switch (storageType) {
          case 'file':
            const filePath =
              configService.get<string>('FILE_PATH') || 'data.txt';
            return new FileTaskManager(
              indexProvider,
              new FileTaskRepository(filePath),
              filePath,
            );
          case 'json':
            const jsonPath =
              configService.get<string>('JSON_PATH') || 'data.json';
            return new JsonTaskManager(
              indexProvider,
              new JsonTaskRepository(jsonPath),
              jsonPath,
            );
          case 'sqlite':
          default:
            return new SqliteTaskManager(db, new SqliteTaskRepository(db));
        }
      },
    },
    {
      provide: 'CreateTaskUseCase',
      inject: ['TaskFactory', 'TaskManager'],
      useFactory: (
        taskFactory: TaskFactory,
        taskManager: import('../application/interfaces/task-manager.interface').ITaskManager,
      ) => new CreateTaskUseCase(taskFactory, taskManager),
    },
    {
      provide: 'UpdateTaskUseCase',
      inject: ['TaskManager', 'TaskRepository'],
      useFactory: (
        taskManager: import('../application/interfaces/task-manager.interface').ITaskManager,
        taskRepository: import('../application/interfaces/task-repository.interface').ITaskRepository,
      ) => new UpdateTaskUseCase(taskManager, taskRepository),
    },
    {
      provide: 'DeleteTaskUseCase',
      inject: ['TaskManager', 'TaskRepository'],
      useFactory: (
        taskManager: import('../application/interfaces/task-manager.interface').ITaskManager,
        taskRepository: import('../application/interfaces/task-repository.interface').ITaskRepository,
      ) => new DeleteTaskUseCase(taskManager, taskRepository),
    },
    {
      provide: 'ICreateTaskUseCase',
      useExisting: 'CreateTaskUseCase',
    },
    {
      provide: 'IUpdateTaskUseCase',
      useExisting: 'UpdateTaskUseCase',
    },
    {
      provide: 'IDeleteTaskUseCase',
      useExisting: 'DeleteTaskUseCase',
    },
    {
      provide: 'ITaskRepository',
      useExisting: 'TaskRepository',
    },
  ],
  exports: [
    'TaskRepository',
    'ICreateTaskUseCase',
    'IUpdateTaskUseCase',
    'IDeleteTaskUseCase',
  ],
})
export class TasksModule {}
