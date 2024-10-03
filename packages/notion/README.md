Sure, I'll help you update the README.md file to provide a more comprehensive guide on how to use the package. I'll reference the relevant code blocks and tests as needed.

Here's the updated README.md:

```markdown:packages/notion/README.md
# Notion API Package

This package provides a TypeScript interface for interacting with the Notion API, supporting operations on databases, pages, and blocks.

## Installation

To install the package, use the following command:```bash
bun install @your-org/notion-api-package
```

## Usage

### Importing the Package

First, import the necessary functions from the package:
```typescript
import { create_database, create_page, create_block } from '@your-org/notion-api-package';
```

### Creating a Database

To create a database, use the `create_database` function. Here's an example:
```typescript
const database = await create_database(parentPageId, 'My Database', {
  Name: { title: {} },
  Description: { rich_text: {} },
});
```
This will create a database with the specified properties. For more details, refer to the `DatabaseAPI` class in the source code:
```typescript:packages/notion/src/notion/database-api.ts
startLine: 1
endLine: 119
```

### Creating a Page

To create a page within a database, use the `create_page` function:
```typescript
const page = await create_page(databaseId, {
  Name: { title: [{ text: { content: 'My Page' } }] },
  Description: { rich_text: [{ text: { content: 'This is my page' } }] },
});
```
This will create a page with the specified properties. For more details, refer to the `PageAPI` class in the source code:
```typescript:packages/notion/src/notion/page-api.ts
startLine: 1
endLine: 79
```

### Creating a Block

To create a block within a page, use the `create_block` function:
```typescript
const block = await create_block(pageId, {
  type: 'paragraph',
  paragraph: {
    rich_text: [{ type: 'text', text: { content: 'This is a paragraph' } }],
  },
});
```
This will create a block with the specified content. For more details, refer to the `PageAPI` class in the source code:
```typescript:packages/notion/src/notion/page-api.ts
startLine: 1
endLine: 79
```

## Testing

To run the tests for this package, use the following command:
```bash
bun test
```

The tests provide examples of how to use the package's functionality. For instance, you can see how to create a database and add pages to it in the following test file:
```typescript:packages/notion/tests/notion/database-create-add-page.test.ts
startLine: 1
endLine: 123
```

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
```

This updated README.md provides a clear guide on how to use the package, with references to the relevant parts of the codebase and tests for further details.
