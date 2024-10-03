# Working with the Notion API Using `@notionhq/client`

This guide provides key instructions on how to use the Notion API with the `@notionhq/client` library, focusing on working with pages, blocks, and rich text content.

## 1. Understanding Pages and Blocks

- **Pages**: Primary content containers in Notion where users write notes, documents, etc.
- **Blocks**: Fundamental units of content within pages. Each block represents a piece of content, such as text, headings, lists, images, and more.

## 2. Page Content vs. Properties

- **Page Properties**: Structured data like titles, dates, categories, or relationships. Best used for capturing structured information.
- **Page Content**: Free-form content where users compose their thoughts. Best for less structured or narrative content.

## 3. Working with Block Objects

### 3.1 Block Object Structure

A **block object** represents a piece of content within Notion. Blocks are used to build up the content of a page.

- **Common Block Fields**:

  ```javascript
  {
    object: 'block',
    id: 'block-id',
    parent: { /* parent information */ },
    type: 'block-type',
    created_time: '',
    last_edited_time: '',
    created_by: { /* user object */ },
    last_edited_by: { /* user object */ },
    has_children: false,
    archived: false,
    type_specific_property: { /* varies by block type */ }
  }
  ```

- **Important Fields**:
  - `object`: Always `'block'`.
  - `id`: Unique identifier for the block.
  - `parent`: Information about the block's parent (e.g., page or another block).
  - `type`: Type of block (e.g., `'paragraph'`, `'heading_1'`, `'image'`).
  - `has_children`: Indicates if the block contains nested blocks.
  - `archived`: Indicates if the block is archived.
  - `type_specific_property`: Contains properties specific to the block's type.

### 3.2 Supported Block Types

Common block types include:

- **Text Blocks**: `paragraph`, `heading_1`, `heading_2`, `heading_3`, `bulleted_list_item`, `numbered_list_item`, `to_do`, `toggle`, `quote`, `callout`.
- **Media Blocks**: `image`, `video`, `file`, `pdf`, `embed`.
- **Structural Blocks**: `divider`, `table_of_contents`, `column_list`, `column`, `table`, `table_row`.
- **Special Blocks**: `code`, `equation`, `bookmark`, `synced_block`, `child_page`, `child_database`.

### 3.3 Example of a Block Object

```javascript
{
  object: 'block',
  id: 'c02fc1d3-db8b-45c5-a222-27595b15aea7',
  parent: {
    type: 'page_id',
    page_id: '59833787-2cf9-4fdf-8782-e53db20768a5'
  },
  created_time: '2022-03-01T19:05:00.000Z',
  last_edited_time: '2022-07-06T19:41:00.000Z',
  created_by: {
    object: 'user',
    id: 'ee5f0f84-409a-440f-983a-a5315961c6e4'
  },
  last_edited_by: {
    object: 'user',
    id: 'ee5f0f84-409a-440f-983a-a5315961c6e4'
  },
  has_children: false,
  archived: false,
  type: 'heading_2',
  heading_2: {
    rich_text: [
      {
        type: 'text',
        text: {
          content: 'Lacinato kale',
          link: null
        },
        annotations: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
          color: 'green'
        },
        plain_text: 'Lacinato kale',
        href: null
      }
    ],
    color: 'default',
    is_toggleable: false
  }
}
```

### 3.4 Blocks with Children

Some block types can contain nested blocks (children):

- **Supported Parent Blocks**: `paragraph`, `bulleted_list_item`, `numbered_list_item`, `toggle`, `to_do`, `heading_1` (when `is_toggleable` is `true`), `heading_2` (when `is_toggleable` is `true`), `heading_3` (when `is_toggleable` is `true`), `quote`, `callout`, `synced_block`, `template`, `column`, `column_list`, `table`, `table_row`.

### 3.5 Block Type Specific Properties

Each block type has its own set of properties under the key corresponding to its `type`. For example:

- **Paragraph Block**:

  ```javascript
  {
    type: 'paragraph',
    paragraph: {
      rich_text: [/* rich text objects */],
      color: 'default',
      children: [/* child blocks if any */]
    }
  }
  ```

- **Heading Block**:

  ```javascript
  {
    type: 'heading_1',
    heading_1: {
      rich_text: [/* rich text objects */],
      color: 'default',
      is_toggleable: false
    }
  }
  ```

- **Image Block**:

  ```javascript
  {
    type: 'image',
    image: {
      type: 'external',
      external: {
        url: 'https://website.domain/images/image.png'
      }
    }
  }
  ```

### 3.6 Rich Text within Blocks

Many block types use **rich text objects** to represent text content with annotations and formatting.

## 4. Rich Text Objects

Rich text objects allow for styling, links, and mentions within text content.

- **Rich Text Structure**:

  ```javascript
  {
    type: 'text',
    text: {
      content: 'Your content here',
      link: null
    },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default'
    },
    plain_text: 'Your content here',
    href: null
  }
  ```

- **Annotations**: Used for text styling.
- **Link and Mentions**: Rich text can include links and mentions of users, pages, or dates.

## 5. Creating a Page with Content

### 5.1 Initialize Notion Client

```javascript
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_API_KEY });
```

### 5.2 Define Parent Page

```javascript
const parent = { page_id: 'your-parent-page-id' };
```

### 5.3 Define Page Properties

At a minimum, provide a title:

```javascript
const properties = {
  Name: {
    title: [
      {
        text: { content: 'A Note from Notion' }
      }
    ]
  }
};
```

### 5.4 Define Page Content (Children)

Create an array of block objects:

```javascript
const children = [
  {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: { content: 'You made this page using the Notion API. Pretty cool, huh?' }
        }
      ]
    }
  }
];
```

### 5.5 Create the Page

```javascript
(async () => {
  const response = await notion.pages.create({
    parent,
    properties,
    children
  });
  console.log(response);
})();
```

## 6. Reading Blocks from a Page

### 6.1 Retrieve Block Children

```javascript
(async () => {
  const response = await notion.blocks.children.list({
    block_id: 'your-page-id',
    page_size: 100
  });
  console.log(response.results);
})();
```

### 6.2 Handling Nested Blocks

If a block has `has_children: true`, recursively retrieve its children:

```javascript
async function getAllBlocks(blockId) {
  const blocks = [];
  let cursor;
  do {
    const { results, next_cursor } = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor
    });
    for (const block of results) {
      blocks.push(block);
      if (block.has_children) {
        block.children = await getAllBlocks(block.id);
      }
    }
    cursor = next_cursor;
  } while (cursor);
  return blocks;
}

(async () => {
  const blocks = await getAllBlocks('your-page-id');
  console.log(blocks);
})();
```

## 7. Appending Blocks to a Page

### 7.1 Define New Blocks

```javascript
const newBlocks = [
  {
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: '– Notion API Team',
            link: { url: 'https://twitter.com/NotionAPI' }
          }
        }
      ]
    }
  }
];
```

### 7.2 Append Blocks to the Page

```javascript
(async () => {
  const response = await notion.blocks.children.append({
    block_id: 'your-page-id',
    children: newBlocks
  });
  console.log(response);
})();
```

### 7.3 Inserting After a Specific Block

Use the `after` parameter to specify the block ID after which to append:

```javascript
(async () => {
  const response = await notion.blocks.children.append({
    block_id: 'your-page-id',
    children: newBlocks,
    after: 'block-id-to-append-after'
  });
  console.log(response);
})();
```

## 8. Important Considerations

### 8.1 Permissions

- Ensure your integration has access to the page.
- Share the page with your integration via the **Add connections** option in Notion.

### 8.2 Retrieving Page IDs

- Open the page in Notion.
- Use the **Share** menu to **Copy link**.
- Extract the page ID from the URL (format it with hyphens).

### 8.3 Size Limits

- Be mindful of content size limits when creating or appending blocks.

### 8.4 Pagination

- Handle paginated responses when retrieving lists of blocks using `start_cursor` and `page_size`.

## 9. Next Steps

- **Explore Block Types**: Familiarize yourself with different block types and their properties.
- **Rich Text Formatting**: Utilize annotations for styling text (bold, italic, etc.).
- **Handle Pagination**: Implement logic to retrieve all blocks if the content exceeds one page.
- **Work with Databases**: Learn how to create pages within databases and handle database properties.

---

**Note**: Replace placeholders like `'your-page-id'` and `'your-parent-page-id'` with actual IDs from your Notion workspace.