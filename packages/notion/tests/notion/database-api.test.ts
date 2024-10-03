import { describe, test, expect, beforeAll } from "bun:test";
import { NotionClient } from '../../src/notion/notion-client';
import { DatabaseAPI } from '../../src/notion/database-api';
import { UpdateDatabaseParameters, QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

describe('DatabaseAPI', () => {
  const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
  const TEST_PAGE_ID = process.env.TEST_PAGE_ID || '';
  let databaseAPI: DatabaseAPI;
  let testDatabaseId: string;

  beforeAll(() => {
    const notionClient = new NotionClient(NOTION_API_KEY);
    databaseAPI = new DatabaseAPI(notionClient);
  });

  test('should create a database', async () => {
    const newDatabase = await databaseAPI.createDatabase({
      parent: { page_id: TEST_PAGE_ID },
      title: [
        {
          type: 'text',
          text: {
            content: 'Test Database',
          },
        },
      ],
      properties: {
        Name: {
          title: {},
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

  test('should retrieve a database', async () => {
    const database = await databaseAPI.getDatabase(testDatabaseId);
    expect(database).toBeDefined();
    expect(database.id).toBe(testDatabaseId);
  });

  test('should update a database', async () => {
    const updateParams: UpdateDatabaseParameters = {
      database_id: testDatabaseId,
      title: [
        {
          type: 'text',
          text: {
            content: 'Updated Test Database',
          },
        },
      ],
    };
    const updatedDatabase = await databaseAPI.updateDatabase(testDatabaseId, updateParams);

    expect(updatedDatabase).toBeDefined();
    expect(updatedDatabase.id).toBe(testDatabaseId);
  });

  test('should query a database', async () => {
    const queryParams: QueryDatabaseParameters = {
      database_id: testDatabaseId,
      page_size: 10,
    };
    const queryResult = await databaseAPI.queryDatabase(testDatabaseId, queryParams);

    expect(queryResult).toBeDefined();
    expect(Array.isArray(queryResult.results)).toBe(true);
  });

  test('should archive a database', async () => {
    await databaseAPI.deleteDatabase(testDatabaseId);

    // Retrieve the database and check if it's archived
    const archivedDatabase = await databaseAPI.getDatabase(testDatabaseId);
    expect((archivedDatabase as any).archived).toBe(true);
  });
});
