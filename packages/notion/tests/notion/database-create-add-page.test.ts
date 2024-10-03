import { describe, test, expect, beforeAll } from "bun:test";
import { NotionClient } from '../../src/notion/notion-client';
import { DatabaseAPI } from '../../src/notion/database-api';
import { PageAPI } from '../../src/notion/page-api';
import { UpdateDatabaseParameters, QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

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

  test('should create an inline database with three properties', async () => {
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
      },
    });

    expect(newDatabase).toBeDefined();
    expect(newDatabase.id).toBeDefined();
    testDatabaseId = newDatabase.id;
  });

  test('should add three different pages to the inline database', async () => {
    const pages = [
      {
        Name: 'Task 1',
        Status: 'To Do',
        Priority: 1,
      },
      {
        Name: 'Task 2',
        Status: 'In Progress',
        Priority: 2,
      },
      {
        Name: 'Task 3',
        Status: 'Done',
        Priority: 3,
      },
    ];

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
        },
      });

      expect(newPage).toBeDefined();
      expect(newPage.id).toBeDefined();
    }
  });
    


  test('should query the inline database and return three pages', async () => {
    const queryParams: QueryDatabaseParameters = {
      database_id: testDatabaseId,
      page_size: 10,
    };
    const queryResult = await databaseAPI.queryDatabase(testDatabaseId, queryParams);

    expect(queryResult).toBeDefined();
    expect(Array.isArray(queryResult.results)).toBe(true);
    expect(queryResult.results.length).toBe(3);
  });

  // ... (keep the other existing tests)
});