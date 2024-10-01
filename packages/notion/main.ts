import dotenv from 'dotenv';
import { NotionAPI } from './src/utils/api';

dotenv.config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const TEST_PAGE_ID = process.env.TEST_PAGE_ID;

if (!NOTION_API_KEY || !TEST_PAGE_ID) {
  console.error('Error: NOTION_API_KEY or TEST_PAGE_ID is not set in the environment');
  process.exit(1);
}

async function main() {
  const notionAPI = new NotionAPI(NOTION_API_KEY);

  try {
    console.log('Testing Notion API...');
    const page = await notionAPI.makeRequest('get', `/pages/${TEST_PAGE_ID}`);
    console.log('Page retrieved:', page.id);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
