## Conventions

Work in the 'notion'folder from route and build the following which works with Notion. 

1. Prioritize code clarity over conciseness
   a. Write simple, verbose code instead of terse, compact, or dense code
   b. Use descriptive variable and function names
   c. Include comments to explain complex logic or non-obvious decisions

Ensure comprehensive test coverage
a. Write unit tests for all functions
b. Avoid mocking in tests; use real dependencies instead
c. If a function lacks a corresponding test, explicitly mention it in a comment
Document missing tests
a. Add a comment above any function without a corresponding test
b. Include a brief explanation of why the test is missing (if applicable)
c. Create a task or TODO item to add the missing test in the future
Prioritize readability in test code
a. Write clear, descriptive test names
b. Use arrange-act-assert (AAA) pattern in test structure
c. Include comments in tests to explain complex scenarios or edge cases
Maintain consistent coding style
a. Follow established style guides for the programming language being used
b. Use consistent indentation and formatting throughout the codebase
c. Employ automated linting tools to enforce style consistency

# Notion API Package Project Plan

## Project Overview
Create a comprehensive TypeScript package for interacting with the Notion API, designed to be used as a powerful tool by AI agents and developers. This package will support CRUD operations for blocks, databases, database items, and pages, including advanced features like finding and extracting information from nested pages, managing database properties, and providing utility functions for common tasks.

## Key Features
- CRUD operations for blocks, databases, pages, and database items
- Advanced search functionality, including nested page discovery
- Database property management and type definitions
- Utility functions for common Notion API tasks
- Recursive data extraction from pages and their child elements
- Video-related services for a specific use case

## Directory Structure
```
notion-sdk/
├── src/
│   ├── notion/
│   │   ├── index.ts
│   │   ├── notion-client.ts
│   │   ├── page-api.ts
│   │   ├── database-api.ts
│   │   ├── block-api.ts
│   │   └── recursive-page-extractor.ts
│   ├── services/
│   │   ├── index.ts
│   │   ├── video-services/
│   │   │   ├── index.ts
│   │   │   ├── crud-operations.ts
│   │   │   ├── database-builder.ts
│   │   │   └── [step1-8 files].ts
│   │   └── utility-services/
│   │       ├── reference-manager.ts
│   │       └── logger.ts
│   ├── models/
│   │   ├── index.ts
│   │   ├── notion-models.ts
│   │   ├── video-models.ts
│   │   └── common-types.ts
│   └── index.ts
├── tests/
│   ├── notion/
│   │   ├── page-api.test.ts
│   │   ├── database-api.test.ts
│   │   ├── block-api.test.ts
│   │   └── recursive-page-extractor.test.ts
│   ├── services/
│   │   ├── video-services/
│   │   │   ├── crud-operations.test.ts
│   │   │   ├── database-builder.test.ts
│   │   │   └── [step1-8 test files].ts
│   │   └── utility-services/
│   │       ├── reference-manager.test.ts
│   │       └── logger.test.ts
│   └── models/
│       ├── notion-models.test.ts
│       ├── video-models.test.ts
│       └── common-types.test.ts
├── package.json
├── tsconfig.json
├── bunfig.toml
└── README.md
```

## Implementation Steps

1. **Project Setup**
   - Initialize a new TypeScript project
   - Install necessary dependencies
   - Configure TypeScript (tsconfig.json) and Bun (bunfig.toml)

2. **Implement Notion API Modules (src/notion/)**
   - Create `notion-client.ts` for initializing and configuring the Notion API client
   - Implement `page-api.ts`, `database-api.ts`, and `block-api.ts` for CRUD operations
   - Develop `recursive-page-extractor.ts` for extracting all information from a page and its child elements

3. **Develop Models (src/models/)**
   - Define types and interfaces in `notion-models.ts`, `video-models.ts`, and `common-types.ts`
   - Ensure all types are exported in `index.ts`

4. **Implement Video Services (src/services/video-services/)**
   - Create CRUD functions specific to video projects in `crud-operations.ts`
   - Implement `database-builder.ts` for creating and deleting video databases
   - Develop step1 through step8 files for each stage of the video creation process

5. **Create Utility Services (src/services/utility-services/)**
   - Implement `reference-manager.ts` for managing page references
   - Develop `logger.ts` for logging functionality

6. **Write Unit Tests**
   - Create test files for each module in the `tests/` directory
   - Ensure comprehensive test coverage for all functions

7. **Documentation**
   - Write a detailed README.md with usage examples and API documentation
   - Add JSDoc comments to all functions and types

8. **Package Configuration**
   - Set up `package.json` with appropriate scripts and dependencies
   - Configure `tsconfig.json` and `bunfig.toml` for optimal TypeScript and Bun settings

## Functional Approach and Naming Conventions

- Use pure functions without side effects to enhance testability and predictability
- Employ immutable data structures to prevent unintended mutations
- Create modular functions that serve a single purpose for better reusability
- Utilize higher-order functions where appropriate for enhanced flexibility
- Use lowercase and hyphen-separated names for functions and files
- Ensure descriptive names that convey the purpose of each function or module

## Key Functions to Implement

### Notion API (src/notion/)
- `create-page(parentId: string, properties: PageProperties): Promise<Page>`
- `read-page(pageId: string): Promise<Page>`
- `update-page(pageId: string, updates: Partial<PageProperties>): Promise<Page>`
- `delete-page(pageId: string): Promise<void>`
- `create-database(parentPageId: string, properties: DatabaseProperties): Promise<Database>`
- `query-database(databaseId: string, query: DatabaseQuery): Promise<DatabaseQueryResult>`
- `create-block(pageId: string, blockContent: BlockContent): Promise<Block>`
- `extract-page-content(pageId: string): Promise<PageContent>`

### Video Services (src/services/video-services/)
- `build-video-database(parentPageId: string): Promise<Database>`
- `delete-video-database(databaseId: string): Promise<void>`
- `create-video-project(databaseId: string, projectData: VideoProject): Promise<DatabaseItem>`
- `update-video-project(databaseId: string, itemId: string, updates: Partial<VideoProject>): Promise<DatabaseItem>`

### Utility Services (src/services/utility-services/)
- `add-page-reference(pageName: string, pageId: string): void`
- `get-page-id(pageName: string): string | undefined`
- `log-info(message: string): void`
- `log-error(message: string, error: Error): void`

This revised project plan aligns more closely with the structure and conventions you provided while maintaining the core functionality we discussed. It emphasizes a functional approach, uses the specified naming conventions, and includes the recursive page extraction feature. The plan now also incorporates the video-related services as part of the package.