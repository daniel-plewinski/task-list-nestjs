# Agent Guidelines for task-list

This is a NestJS task-list application.

## Commands

### Build & Run

- `yarn build` - Compile TypeScript to JavaScript
- `yarn start` - Start the application
- `yarn start:dev` - Start with hot reload (watch mode)
- `yarn start:prod` - Run production build

### Linting & Formatting

- `yarn lint` - Run ESLint with auto-fix
- `yarn format` - Format code with Prettier

### Testing

- `yarn test` - Run all unit tests
- `yarn test --testPathPattern=<pattern>` - Run single test file
- `yarn test --testNamePattern=<name>` - Run tests matching name
- `yarn test:watch` - Run tests in watch mode
- `yarn test:cov` - Run tests with coverage report
- `yarn test:e2e` - Run end-to-end tests

## Architecture

The project follows Clean Architecture with these layers:

```
src/
├── domain/           # Business entities, exceptions, factories
├── application/     # Use cases and interfaces
├── infrastructure/  # Repositories, managers, providers
└── tasks/           # NestJS controller, DTOs, module
```

Use path aliases: `@domain/*`, `@application/*`, `@infrastructure/*`

## Code Style

### TypeScript

- Use explicit types for function parameters and return types
- Interfaces prefixed with `I` (e.g., `ICreateTaskUseCase`)
- Strict mode disabled - `strictNullChecks: false`, `noImplicitAny: false`

### Naming Conventions

- **Files**: kebab-case with dots for use-cases/interfaces
  - `create-task.use-case.ts`, `task-repository.interface.ts`
- **Classes**: PascalCase (`TaskController`, `CreateTaskUseCase`)
- **Interfaces**: PascalCase with `I` prefix
- **Variables/functions**: camelCase

### Imports

- Group imports in this order:
  1. External libraries (`@nestjs/common`, `class-validator`)
  2. Relative imports from other layers (`../application/...`, `./dto/...`)
- Use path aliases for cross-layer imports

### Formatting

- Single quotes for strings
- Trailing commas on all properties
- 2-space indentation

### Error Handling

- Use domain exceptions (e.g., `EntityNotFoundException`)
- Controllers catch exceptions and convert to HTTP errors with `HttpException`
- Use `instanceof` to check exception types

### NestJS Patterns

- Use `@Inject()` decorator for dependency injection with string tokens
- DTOs use `class-validator` decorators (`@IsString()`, `@IsNotEmpty()`)
- Use DTOs for request/response transformation (e.g., `TaskDto.fromEntity(task)`)

## Testing

- Test files follow pattern: `*.spec.ts` in same directory as source
- Use Jest (configured in `package.json`)
- Tests are located in `test/` directory mirroring `src/` structure
- E2E tests in `test/e2e/` with separate jest config

## Directory Structure

### Domain Layer (`src/domain/`)

Contains core business logic:

- `entities/` - Business entities (e.g., `Task`)
- `exceptions/` - Domain exceptions (e.g., `EntityNotFoundException`)
- `factories/` - Factory interfaces and implementations for creating entities

### Application Layer (`src/application/`)

Contains use cases and interfaces:

- `interfaces/` - Repository and manager interfaces (e.g., `ITaskRepository`, `ITaskManager`)
- `use-cases/` - Use case implementations (e.g., `CreateTaskUseCase`)

### Infrastructure Layer (`src/infrastructure/`)

Contains implementations:

- `repositories/` - Repository implementations (SQLite, JSON, file-based)
- `managers/` - Manager implementations for data persistence
- `providers/` - Additional providers (e.g., file indexing)

### Tasks Module (`src/tasks/`)

NestJS-specific code:

- `tasks.controller.ts` - HTTP controller
- `tasks.module.ts` - NestJS module
- `dto/` - Data Transfer Objects with validation decorators
- `index.ts` - Module exports

## Common Patterns

### Creating a New Use Case

1. Create interface in `src/application/interfaces/<name>.use-case.interface.ts`
2. Implement in `src/application/use-cases/<name>.use-case.ts`
3. Register in module with `@Inject()` decorator using string token
4. Add controller endpoint to handle HTTP requests

### Creating a New Repository

1. Create interface in `src/application/interfaces/task-repository.interface.ts`
2. Implement in `src/infrastructure/repositories/<name>.task-repository.ts`
3. Register in appropriate module

### Exception Handling Flow

1. Domain layer throws domain exception (e.g., `EntityNotFoundException`)
2. Use case or repository catches and re-throws
3. Controller catches exception, checks with `instanceof`
4. Converts to `HttpException` with appropriate status code

## ESLint Configuration

The project uses TypeScript ESLint with these rules:

- Interface name prefix disabled
- Explicit function return type disabled
- Explicit module boundary types disabled
- No explicit any disabled

## Prettier Configuration

- Single quotes for strings
- Trailing commas on all properties

## Dependencies

Key dependencies:

- `@nestjs/common` - NestJS core
- `@nestjs/core` - NestJS core
- `@nestjs/platform-express` - Express adapter
- `@nestjs/config` - Configuration
- `better-sqlite3` - SQLite database
- `class-validator` - DTO validation
- `class-transformer` - DTO transformation
