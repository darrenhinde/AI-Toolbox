import { test, expect, beforeAll } from "bun:test";
import { NotionClient } from '../../src/notion/notion-client';
import { PageAPI } from '../../src/notion/page-api';

const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
const TEST_PAGE_ID = process.env.TEST_PAGE_ID || '';
let pageAPI: PageAPI;

beforeAll(() => {
  const notionClient = new NotionClient(NOTION_API_KEY);
  pageAPI = new PageAPI(notionClient);
});

test('should retrieve a page', async () => {
  const page = await pageAPI.getPage(TEST_PAGE_ID);
  expect(page).toBeDefined();
  expect(page.id.replace(/-/g, '')).toBe(TEST_PAGE_ID.replace(/-/g, ''));
});

test('should create a page', async () => {
  const newPage = await pageAPI.createPage({
    parent: { page_id: TEST_PAGE_ID },
    properties: {
      title: [
        {
          text: {
            content: 'Test Page',
          },
        },
      ],
    },
  });
  expect(newPage).toBeDefined();
  expect(newPage.id).toBeDefined();

  // Clean up: delete the created page
  await pageAPI.deletePage(newPage.id);
});

// Add other test cases here...
