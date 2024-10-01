import { expect, test } from "bun:test";
import { create_page } from '../src/operations/page';
import { setupEnvironment } from './tests-setup';

setupEnvironment();
test('create_page', async () => {
  const apiKey = process.env.NOTION_API_KEY;
  const parentId = process.env.TEST_DATABASE_ID;
  const properties = {
    Name: { title: [{ text: { content: 'Test Page' } }] },
    Description: { rich_text: [{ text: { content: 'This is a test page' } }] },
  };
  
  if (!apiKey || !parentId) {
    throw new Error('NOTION_API_KEY or TEST_DATABASE_ID environment variable is not set');
  }
  const result = await create_page(apiKey, parentId, properties);

  expect(result).toBeDefined();
  expect(result.properties).toHaveProperty('Name');
  expect(result.properties).toHaveProperty('Description');
});