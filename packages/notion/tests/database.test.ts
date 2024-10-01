import { expect, test } from "bun:test";
import { create_database } from '../src/operations/database';
import { setupEnvironment } from './tests-setup';

setupEnvironment();

test('create_database', async () => {
  const apiKey = process.env.NOTION_API_KEY;
  const parentPageId = process.env.TEST_PAGE_ID;
  const title = 'Test Database';
  const properties = {
    "Post Content": { rich_text: {} },
    "Author": { people: {} },
    "Likes": { number: {} },
    "Comments": { number: {} },
    "Published Date": { date: {} },
  };

  if (!apiKey || !parentPageId) {
    throw new Error('NOTION_API_KEY or TEST_PAGE_ID environment variable is not set');
  }

  const result = await create_database(apiKey, parentPageId, title, properties, true);

  expect(result).toBeDefined();
  expect(result.title[0].text.content).toBe(title);
  expect(result.properties).toHaveProperty('Post Content');
  expect(result.properties).toHaveProperty('Author');
  expect(result.properties).toHaveProperty('Likes');
  expect(result.properties).toHaveProperty('Comments');
  expect(result.properties).toHaveProperty('Published Date');
  expect(result.is_inline).toBe(true);
});
