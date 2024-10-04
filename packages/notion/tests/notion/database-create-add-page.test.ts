import { describe, test, expect, beforeAll } from "bun:test";
import { NotionClient } from '../../src/notion/notion-client';
import { DatabaseAPI } from '../../src/notion/database-api';
import { PageAPI } from '../../src/notion/page-api';
import { UpdateDatabaseParameters, QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import { BlockContent, RichText } from '../../src/notion/page-api';

describe('DatabaseAPI', () => {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const TEST_PAGE_ID = process.env.TEST_PAGE_ID;

  if (!NOTION_API_KEY || !TEST_PAGE_ID) {
    throw new Error('NOTION_API_KEY and TEST_PAGE_ID must be set in the environment');
  }

  let databaseAPI: DatabaseAPI;
  let pageAPI: PageAPI;
  let testDatabaseId: string;

  beforeAll(() => {
    const notionClient = new NotionClient(NOTION_API_KEY);
    databaseAPI = new DatabaseAPI(notionClient);
    pageAPI = new PageAPI(notionClient);
  });

  test('should create an inline database with four properties', async () => {
    // Create a new database with Name, Status, Priority, and Description properties
    const newDatabase = await databaseAPI.createDatabase({
      parent: { page_id: TEST_PAGE_ID },
      title: [
        {
          type: 'text',
          text: {
            content: 'Test Content',
          },
        },
      ],
      is_inline: true,
      properties: {
        Name: {
          title: {},
        },
        Status: {
          select: {
            options: [
              { name: 'To Do', color: 'red' },
              { name: 'In Progress', color: 'yellow' },
              { name: 'Done', color: 'green' },
            ],
          },
        },
        Priority: {
          number: {
            format: 'number',
          },
        },
        Description: {
          rich_text: {},
        },
      },
    });

    expect(newDatabase).toBeDefined();
    expect(newDatabase.id).toBeDefined();
    testDatabaseId = newDatabase.id;
  });

  test('should add four different pages to the inline database', async () => {
    // Define pages with more detailed content
    const pages = [
      {
        Name: 'Task 1',
        Status: 'To Do',
        Priority: 1,
        Description: 'This is the first task to be completed.',
      },
      {
        Name: 'Task 2',
        Status: 'In Progress',
        Priority: 2,
        Description: 'This task is currently being worked on.',
      },
      {
        Name: 'Task 3',
        Status: 'Done',
        Priority: 3,
        Description: 'This task has been completed successfully.',
      },
      {
        Name: 'Task 4',
        Status: 'To Do',
        Priority: 4,
        Description: 'This is a high priority task that needs attention.',
      },
    ];

    // Add each page to the database
    for (const page of pages) {
      const newPage = await databaseAPI.createDatabaseItem(testDatabaseId, {
        parent: { database_id: testDatabaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: page.Name,
                },
              },
            ],
          },
          Status: {
            select: {
              name: page.Status,
            },
          },
          Priority: {
            number: page.Priority,
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: page.Description,
                },
              },
            ],
          },
        },
      });

      expect(newPage).toBeDefined();
      expect(newPage.id).toBeDefined();
    }
  });

  test('should query the inline database and return four pages', async () => {
    // Query the database to retrieve all pages
    const queryParams: QueryDatabaseParameters = {
      database_id: testDatabaseId,
      page_size: 10,
    };
    const queryResult = await databaseAPI.queryDatabase(testDatabaseId, queryParams);

    expect(queryResult).toBeDefined();
    expect(Array.isArray(queryResult.results)).toBe(true);
    expect(queryResult.results.length).toBe(4);
  });

  test('should add a page with details to the database and append rich content', async () => {
    // Create a new page with detailed content
    const newPageWithDetails = await databaseAPI.createDatabaseItem(testDatabaseId, {
      parent: { database_id: testDatabaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: 'Detailed Task',
              },
            },
          ],
        },
        Status: {
          select: {
            name: 'In Progress',
          },
        },
        Priority: {
          number: 5,
        },
        Description: {
          rich_text: [
            {
              text: {
                content: 'This is a detailed task with specific requirements and steps to follow.',
              },
            },
          ],
        },
      },
    });

    expect(newPageWithDetails).toBeDefined();
    expect(newPageWithDetails.id).toBeDefined();

    // Prepare rich content to append to the page
    const coloredText: RichText = {
      type: 'text',
      text: { content: 'This text is blue and bold' },
      annotations: { bold: true, color: 'blue' }
    };

    const backgroundColoredText: RichText = {
      type: 'text',
      text: { content: 'This text has a yellow background' },
      annotations: { color: 'yellow_background' }
    };

    const blockContents: BlockContent[] = [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: [{ type: 'text', text: { content: 'Task Details' } }] }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content: 'This task requires careful attention to the following steps:' } }] }
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: [{ type: 'text', text: { content: 'Analyze requirements' } }] }
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: [{ type: 'text', text: { content: 'Design solution' } }] }
      },
      {
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: [{ type: 'text', text: { content: 'Implement and test' } }] }
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [{ type: 'text', text: { content: 'Important Note: Ensure all steps are completed before marking as Done.' } }],
          icon: { emoji: '⚠️' }
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [coloredText] }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [backgroundColoredText] }
      },
      {
        object: 'block',
        type: 'code',
        code: {
          rich_text: [{ type: 'text', text: { content: 'function completeTask() {\n  console.log("Task completed!");\n}' } }],
          language: 'javascript'
        }
      }
    ];

    // Append rich content to the page
    await pageAPI.appendToPage(newPageWithDetails.id, blockContents);

    // Verify the newly added page and its content
    const pageContent = await pageAPI.getPage(newPageWithDetails.id);
    expect(pageContent).toBeDefined();
    expect(pageContent.id).toBe(newPageWithDetails.id);

    // Note: To verify the appended content, you would need to use the blocks.children.list endpoint
    // This test doesn't include that verification, but in a real scenario, you might want to add it
  });

  // ... (keep the other existing tests)
});