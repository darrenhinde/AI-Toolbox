import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { NotionClient } from '../../src/notion/notion-client';
import { PageAPI } from '../../src/notion/page-api';
import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';

const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
const TEST_PAGE_ID = process.env.TEST_PAGE_ID || '';
let pageAPI: PageAPI;

describe('PageAPI', () => {
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
    const newPage = await pageAPI.createPage(TEST_PAGE_ID, 'Test Page', 'This is a test page.');
    expect(newPage).toBeDefined();

    // Clean up: delete the created page
    await pageAPI.deletePage(newPage);
  });

  // Add other test cases here...
});

const apiKey = process.env.NOTION_API_KEY;
const parentPageId = process.env.NOTION_PARENT_PAGE_ID;

if (!apiKey || !parentPageId) {
  console.error('NOTION_API_KEY and NOTION_PARENT_PAGE_ID must be set in .env file');
  process.exit(1);
}

describe('PageAPI', () => {
  let pageAPI: PageAPI;
  let createdPageId: string;

  beforeAll(() => {
    const notionClient = new NotionClient(NOTION_API_KEY);
    pageAPI = new PageAPI(notionClient);
  });

  afterAll(async () => {
    if (createdPageId) {
      await pageAPI.deletePage(createdPageId);
    }
  });

  test('create, append, edit, and get page', async () => {
    try {
      // Create a new page
      createdPageId = await pageAPI.createPage(
        parentPageId,
        'Test Page',
        'This is a test page created by the API.'
      );
      expect(createdPageId).toBeTruthy();

      // Append content to the page
      await pageAPI.appendToPage(
        createdPageId,
        'This content was appended to the page.'
      );

      // Edit the page title
      await pageAPI.editPage(createdPageId, 'Updated Test Page Title');

      // Get the page and verify its title
      const updatedPage = await pageAPI.getPage(createdPageId);
      
      if ('properties' in updatedPage && 'title' in updatedPage.properties) {
        const titleProperty = updatedPage.properties.title;
        if ('title' in titleProperty) {
          expect(titleProperty.title[0].plain_text).toBe('Updated Test Page Title');
        } else {
          throw new Error('Expected title property structure not found');
        }
      } else {
        throw new Error('Expected properties or title not found');
      }

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
