import { describe, test, expect, beforeAll } from "bun:test";
import { NotionClient } from '../../src/notion/notion-client';
import { Client } from '@notionhq/client';

describe('NotionClient', () => {
  const NOTION_API_KEY = process.env.NOTION_API_KEY || '';

  test('should create a NotionClient instance', () => {
    const notionClient = new NotionClient(NOTION_API_KEY);
    expect(notionClient).toBeInstanceOf(NotionClient);
  });

  test('should return a Client instance', () => {
    const notionClient = new NotionClient(NOTION_API_KEY);
    const client = notionClient.getClient();
    expect(client).toBeInstanceOf(Client);
  });
});
