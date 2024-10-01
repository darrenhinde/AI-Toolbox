# Notion API Package Project Plan

## Project Overview
Create a comprehensive TypeScript package for interacting with the Notion API, designed to be used as a powerful tool by AI agents and developers. This package will support CRUD operations for blocks, databases, database items, and pages, including advanced features like finding and extracting information from nested pages, managing database properties, and providing utility functions for common tasks.

## Key Features
- CRUD operations for blocks, databases, pages, and database items
- Advanced search functionality, including nested page discovery
- Database property management and type definitions
- Utility functions for common Notion API tasks
- Flexible and extensible architecture for custom function additions

## Directory Structure
```
notion-api-package/
├── src/
│   ├── types/
│   │   ├── index.ts
│   │   ├── block.ts
│   │   ├── database.ts
│   │   ├── page.ts
│   │   ├── properties.ts
│   │   └── common.ts
│   ├── operations/
│   │   ├── block.ts
│   │   ├── database.ts
│   │   ├── page.ts
│   │   ├── search.ts
│   │   └── properties.ts
│   ├── utils/
│   │   ├── api.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   ├── custom/
│   │   └── index.ts
│   └── index.ts
├── tests/
│   ├── block.test.ts
│   ├── database.test.ts
│   ├── page.test.ts
│   ├── search.test.ts
│   └── properties.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Implementation Steps

1. **Project Setup**
   - Initialize a new TypeScript project
   - Install necessary dependencies (axios, dotenv, etc.)
   - Configure TypeScript (tsconfig.json)

2. **Type Definitions (src/types/)**
   - Create separate type definition files for blocks, databases, pages, properties, and common types
   - Ensure all types are exported in index.ts for easy import by LLMs
   - Add comprehensive type definitions for all Notion property types

3. **API Utilities (src/utils/api.ts)**
   - Create a base API client for making requests to the Notion API
   - Implement error handling, rate limiting, and pagination support

4. **CRUD Operations**
   - Implement create, read, update, and delete functions for blocks, databases, and pages
   - Ensure each function is self-contained and exported

5. **Search Functionality (src/operations/search.ts)**
   - Create functions to search for pages, including nested pages
   - Implement functionality to extract information from found pages

6. **Database Property Management (src/operations/properties.ts)**
   - Implement functions to manage database properties
   - Create utility functions for common property operations

7. **Utility Functions (src/utils/helpers.ts)**
   - Implement function to list all databases
   - Add helper functions for common tasks (e.g., formatting dates, handling rich text)

8. **Custom Functions (src/custom/index.ts)**
   - Create a module for custom, reusable functions
   - Implement function to create a set of properties with specified types

9. **Main Entry Point (src/index.ts)**
   - Export all functions and types for easy access

10. **Testing**
    - Write unit tests for each operation and utility function
    - Implement integration tests to ensure proper interaction with the Notion API

11. **Documentation**
    - Write a comprehensive README.md with usage examples
    - Add JSDoc comments to all functions and types

12. **Package and Publish**
    - Configure package.json for publishing
    - Publish the package to npm

## Detailed Function Descriptions

### Blocks (src/operations/block.ts)
- `createBlock(pageId: string, blockContent: BlockContent): Promise<Block>`
- `readBlock(blockId: string): Promise<Block>`
- `updateBlock(blockId: string, updates: Partial<BlockContent>): Promise<Block>`
- `deleteBlock(blockId: string): Promise<void>`

### Databases (src/operations/database.ts)
- `createDatabase(parentPageId: string, databaseProperties: DatabaseProperties): Promise<Database>`
- `readDatabase(databaseId: string): Promise<Database>`
- `updateDatabase(databaseId: string, updates: Partial<DatabaseProperties>): Promise<Database>`
- `deleteDatabase(databaseId: string): Promise<void>`
- `queryDatabase(databaseId: string, query: DatabaseQuery): Promise<DatabaseQueryResult>`
- `listAllDatabases(): Promise<Database[]>`

### Pages (src/operations/page.ts)
- `createPage(parentId: string, properties: PageProperties): Promise<Page>`
- `readPage(pageId: string): Promise<Page>`
- `updatePage(pageId: string, updates: Partial<PageProperties>): Promise<Page>`
- `deletePage(pageId: string): Promise<void>`

### Search (src/operations/search.ts)
- `searchPages(query: string, options?: SearchOptions): Promise<SearchResult[]>`
- `findNestedPages(parentPageId: string): Promise<Page[]>`
- `extractPageContent(pageId: string): Promise<PageContent>`

### Properties (src/operations/properties.ts)
- `addPropertyToDatabase(databaseId: string, property: DatabaseProperty): Promise<Database>`
- `updateDatabaseProperty(databaseId: string, propertyId: string, updates: Partial<DatabaseProperty>): Promise<Database>`
- `deletePropertyFromDatabase(databaseId: string, propertyId: string): Promise<void>`
- `listDatabaseProperties(databaseId: string): Promise<DatabaseProperty[]>`

### Custom Functions (src/custom/index.ts)
- `createPropertySet(properties: PropertySet): DatabaseProperties`
- `applyPropertySetToDatabase(databaseId: string, propertySet: PropertySet): Promise<Database>`

## Usage Guide

1. **Installation**
   ```
   npm install your-notion-api-package
   ```

2. **Authentication**
   Set up your Notion API key as an environment variable or pass it to the package's initialization function.

3. **Basic Usage**
   ```typescript
   import { NotionAPI } from 'your-notion-api-package';

   const notion = new NotionAPI('your-api-key');

   // Example: Create a new page
   const newPage = await notion.createPage('parent-page-id', {
     title: [{ text: { content: 'New Page Title' } }],
     // ... other properties
   });
   ```

4. **Working with Databases**
   ```typescript
   // List all databases
   const databases = await notion.listAllDatabases();

   // Create a new database with custom properties
   const properties = notion.createPropertySet({
     'Task Name': { type: 'title', name: 'Task Name' },
     'Due Date': { type: 'date', name: 'Due Date' },
     'Status': { type: 'select', name: 'Status', options: ['To Do', 'In Progress', 'Done'] }
   });

   const newDatabase = await notion.createDatabase('parent-page-id', properties);
   ```

5. **Advanced Search**
   ```typescript
   // Search for pages and extract content
   const searchResults = await notion.searchPages('project ideas');
   for (const result of searchResults) {
     const content = await notion.extractPageContent(result.id);
     console.log(content);
   }
   ```

This expanded project plan provides a more comprehensive framework for building a robust Notion API package. It includes new utility functions like `listAllDatabases()`, and introduces a custom functions module for reusable operations like creating property sets. The usage guide gives developers a quick start on how to use the package effectively.

Remember to implement error handling, rate limiting, and pagination support throughout the package to ensure reliable interaction with the Notion API. As you develop, you may identify additional utility functions or custom operations that would be valuable to include.