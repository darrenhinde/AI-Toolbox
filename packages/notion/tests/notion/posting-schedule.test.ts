import { NotionClient } from '../../src/notion/notion-client';
import { DatabaseAPI } from '../../src/notion/database-api';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('PostingScheduleDatabase', () => {
  const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
  const TEST_PAGE_ID = process.env.TEST_PAGE_ID || '';
  let databaseAPI: DatabaseAPI;
  let testPageId: string;

  beforeAll(() => {
    const notionClient = new NotionClient(NOTION_API_KEY);
    databaseAPI = new DatabaseAPI(notionClient);
  });

  it('should create a posting schedule inline database', async () => {
    const page = await databaseAPI.createPostingScheduleDatabase(TEST_PAGE_ID, 'Posting Schedule');
    expect(page).toBeDefined();
    expect(page.id).toBeDefined();
    testPageId = page.id;

    // Fetch the created page to check its content
    const createdPage = await databaseAPI.notionClient.getClient().pages.retrieve({ page_id: testPageId });
    expect(createdPage).toBeDefined();

    // Check if the page has children (the inline table)
    const { results: blocks } = await databaseAPI.notionClient.getClient().blocks.children.list({ block_id: testPageId });
    expect(blocks.length).toBeGreaterThan(0);

    const tableBlock = blocks.find(block => block.type === 'table');
    expect(tableBlock).toBeDefined();
    expect(tableBlock?.type).toBe('table');
    if (tableBlock?.type === 'table') {
      expect(tableBlock.table.table_width).toBe(5);
      expect(tableBlock.table.has_column_header).toBe(true);
    }
  });

  afterAll(async () => {
    // Clean up: archive the test page
    if (testPageId) {
      await databaseAPI.notionClient.getClient().pages.update({
        page_id: testPageId,
        archived: true
      });
    }
  });
});
