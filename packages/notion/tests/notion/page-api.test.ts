import { NotionClient } from '../../src/notion/notion-client';
import { PageAPI } from '../../src/notion/page-api';

describe('PageAPI', () => {
  const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
  const TEST_PAGE_ID = process.env.TEST_PAGE_ID || '';
  let pageAPI: PageAPI;

  beforeAll(() => {
    const notionClient = new NotionClient(NOTION_API_KEY);
    pageAPI = new PageAPI(notionClient);
  });

  it('should retrieve a page', async () => {
    const page = await pageAPI.getPage(TEST_PAGE_ID);
    expect(page).toBeDefined();
    expect(page.id.replace(/-/g, '')).toBe(TEST_PAGE_ID.replace(/-/g, ''));
  });

  it('should create a page', async () => {
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

  it('should update a page', async () => {
    const newPage = await pageAPI.createPage({
      parent: { page_id: TEST_PAGE_ID },
      properties: {
        title: [
          {
            text: {
              content: 'Page to Update',
            },
          },
        ],
      },
    });

    const updatedPage = await pageAPI.updatePage(newPage.id, {
      properties: {
        title: [
          {
            text: {
              content: 'Updated Page',
            },
          },
        ],
      },
    });

    expect(updatedPage).toBeDefined();
    expect(updatedPage.id).toBe(newPage.id);
    expect((updatedPage.properties as any).title.title[0].text.content).toBe('Updated Page');

    // Clean up: delete the created page
    await pageAPI.deletePage(newPage.id);
  });

  it('should archive a page', async () => {
    const newPage = await pageAPI.createPage({
      parent: { page_id: TEST_PAGE_ID },
      properties: {
        title: [
          {
            text: {
              content: 'Page to Archive',
            },
          },
        ],
      },
    });

    await pageAPI.deletePage(newPage.id);

    // Retrieve the page and check if it's archived
    const archivedPage = await pageAPI.getPage(newPage.id);
    expect(archivedPage.archived).toBe(true);
  });
});
