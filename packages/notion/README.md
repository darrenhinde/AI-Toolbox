# Notion API Package

This package provides a TypeScript interface for interacting with the Notion API, supporting operations on databases, pages, and blocks.

## Installation

Now, let's update the README.md file with the new changes and instructions on how to test:
bash
bun install @your-org/notion-api-package
typescript
import { create_database, create_page, create_block } from '@your-org/notion-api-package';
// Create a database
const database = await create_database(parentPageId, 'My Database', {
Name: { title: {} },
Description: { rich_text: {} },
});
// Create a page
const page = await create_page(databaseId, {
Name: { title: [{ text: { content: 'My Page' } }] },
Description: { rich_text: [{ text: { content: 'This is my page' } }] },
});
// Create a block
const block = await create_block(pageId, {
type: 'paragraph',
paragraph: {
rich_text: [{ type: 'text', text: { content: 'This is a paragraph' } }],
},
});
bash
bun test
This project is licensed under the MIT License - see the LICENSE.md file for details.
.
