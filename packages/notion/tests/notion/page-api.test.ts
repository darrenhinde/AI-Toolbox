import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { NotionClient } from '../../src/notion/notion-client';
import { PageAPI } from '../../src/notion/page-api';
import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import { BlockContent } from '../../src/notion/page-api';

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
    // await pageAPI.deletePage(newPage);
  });

  // Add other test cases here...
});

const apiKey = process.env.NOTION_API_KEY;
const parentPageId = process.env.NOTION_PARENT_PAGE_ID;

if (!apiKey || !parentPageId) {
  console.error('NOTION_API_KEY and NOTION_PARENT_PAGE_ID must be set in .env file');
  process.exit(1);
}

describe('PageAPI Integration, creating a rich page', () => {
  let pageAPI: PageAPI;
  let createdPageId: string;

  beforeAll(() => {
    const notionClient = new NotionClient(apiKey);
    pageAPI = new PageAPI(notionClient);
  });

  afterAll(async () => {
    if (createdPageId) {
      // await pageAPI.deletePage(createdPageId);
    }
  });

  test('create a page with various block components', async () => {
    try {
      // Create a new page
      createdPageId = await pageAPI.createPage(
        parentPageId,
        'Rich Test Page',
        'This is a test page with various block components.'
      );
      expect(createdPageId).toBeTruthy();

      // Prepare an array of block contents
      const blockContents: BlockContent[] = [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: { rich_text: [{ type: 'text', text: { content: 'Main Heading' } }] }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: { rich_text: [{ type: 'text', text: { content: 'This is a paragraph under the main heading.' } }] }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: { rich_text: [{ type: 'text', text: { content: 'Subheading' } }] }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Bullet point 1' } }] }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: { rich_text: [{ type: 'text', text: { content: 'Bullet point 2' } }] }
        },
        {
          object: 'block',
          type: 'divider',
          divider: {}
        },
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [{ type: 'text', text: { content: 'This is a callout block' } }],
            icon: { emoji: '💡' }
          }
        },
        {
          object: 'block',
          type: 'quote',
          quote: { rich_text: [{ type: 'text', text: { content: 'This is a quote block' } }] }
        }
      ];

      // Append all blocks to the page
      await pageAPI.appendToPage(createdPageId, blockContents);

      // Get the page and verify its content
      const updatedPage = await pageAPI.getPage(createdPageId);
      expect(updatedPage).toBeDefined();
      expect(updatedPage.id).toBe(createdPageId);

      // You might want to add more specific checks here to verify the content
      // However, note that `getPage` doesn't return the page content, only its properties
      // To verify the content, you'd need to use the `blocks.children.list` endpoint

    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  }, 15000); // Increase timeout to 15 seconds
});
