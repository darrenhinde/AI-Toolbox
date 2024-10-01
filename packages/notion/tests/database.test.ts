import { expect, test } from "bun:test";
import { create_database } from '../src/operations/database';
import { setupEnvironment } from './tests-setup';

setupEnvironment();

test('create_database', async () => {
  const apiKey = process.env.NOTION_API_KEY;
  const parentPageId = process.env.TEST_PAGE_ID;
  const title = 'Test Database';
  const properties = {
    Name: { title: {} },
    Description: { rich_text: {} },
  };

  if (!apiKey || !parentPageId) {
    throw new Error('NOTION_API_KEY or TEST_PAGE_ID environment variable is not set');
  }

  const result = await create_database(apiKey, parentPageId, title, properties);

  expect(result).toBeDefined();
  expect(result.title[0].text.content).toBe(title);
  expect(result.properties).toHaveProperty('Name');
  expect(result.properties).toHaveProperty('Description');
});