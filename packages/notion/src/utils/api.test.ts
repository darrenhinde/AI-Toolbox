import { NotionAPI } from './api';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.NOTION_API_KEY;
const testPageId = process.env.TEST_PAGE_ID;

if (!apiKey || !testPageId) {
  console.warn('Skipping NotionAPI tests: NOTION_API_KEY or TEST_PAGE_ID is not set in the environment');
} else {
  describe('NotionAPI', () => {
    let notionAPI: NotionAPI;

    beforeAll(() => {
      notionAPI = new NotionAPI(apiKey);
    });

    test('request should retrieve a page', async () => {
      try {
        const page = await notionAPI.request('GET', `/pages/${testPageId}`);
        expect(page).toBeDefined();
        expect(page.id.replace(/-/g, '')).toEqual(testPageId.replace(/-/g, ''));
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          console.error('Authentication failed. Please check your Notion API key.');
        } else {
          console.error('Error:', error.message);
        }
        throw error;
      }
    });

    // Add more tests for other API methods as they are implemented
  });
}
