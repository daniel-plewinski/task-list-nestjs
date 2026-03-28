# Task List API

<p>
  <img src="https://img.shields.io/badge/TypeScript-5.1-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/NestJS-11-red" alt="NestJS">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

A RESTful Task List API demonstrating **Clean Architecture** with pluggable storage backends.

## What This Project Shows

This isn't just a CRUD app - it's a demonstration of software architecture skills:

| Pattern                   | Implementation                                   |
| ------------------------- | ------------------------------------------------ |
| **Dependency Inversion**  | Domain layer has zero external dependencies      |
| **Repository Pattern**    | 3 swappable implementations (SQLite, JSON, File) |
| **Interface Segregation** | Clean contracts between layers                   |
| **Dependency Injection**  | NestJS with `@Inject()` and string tokens        |

## The Architecture

```
Domain Layer     → Pure business logic (Task entity, exceptions, factories)
       ↑
Application Layer → Use cases (CreateTask, UpdateTask, DeleteTask) - depends only on interfaces
       ↑
Infrastructure Layer → Implementations (SQLite, JSON, File repos) - injected at runtime
       ↑
Presentation Layer → NestJS controllers with validated DTOs
```

**Key insight**: Switch storage from SQLite to JSON without touching a single line of business logic.

## Quick Start

```bash
yarn install
cp .env.example .env
yarn start:dev
```

## Key Files

| Path                                                      | Purpose            |
| --------------------------------------------------------- | ------------------ |
| `src/domain/entities/task.entity.ts`                      | Core domain entity |
| `src/application/interfaces/task-repository.interface.ts` | Storage contract   |
| `src/infrastructure/repositories/*.ts`                    | 3 implementations  |
| `src/application/use-cases/create-task.use-case.ts`       | Business logic     |

## Why This Matters

- **Testability**: Mock any repository interface - use cases have zero dependencies
- **Maintainability**: Change storage without touching business logic
- **Extensibility**: Add new storage (Redis, PostgreSQL) by implementing interface

## Tech Stack

NestJS 11.x • TypeScript 5.x • better-sqlite3 • class-validator • Jest

## License

MIT
