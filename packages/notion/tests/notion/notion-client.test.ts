import { NotionClient } from '../../src/notion/notion-client';
import { Client } from '@notionhq/client';

describe('NotionClient', () => {
  const NOTION_API_KEY = process.env.NOTION_API_KEY || '';

  it('should create a NotionClient instance', () => {
    const notionClient = new NotionClient(NOTION_API_KEY);
    expect(notionClient).toBeInstanceOf(NotionClient);
  });

  it('should return a Client instance', () => {
    const notionClient = new NotionClient(NOTION_API_KEY);
    const client = notionClient.getClient();
    expect(client).toBeInstanceOf(Client);
  });
});
