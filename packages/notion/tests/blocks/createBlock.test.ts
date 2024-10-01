import { expect, test, describe } from "bun:test";
import dotenv from 'dotenv';
import path from 'path';
import { createBlock } from '../../src/operations/block';
import { BlockContent } from '../../src/types/block';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.NOTION_API_KEY;
const pageId = process.env.TEST_PAGE_ID;

if (!apiKey || !pageId) {
  console.error('Error: NOTION_API_KEY or TEST_PAGE_ID is not set in the .env.local file');
  process.exit(1);
}

describe('createBlock', () => {
  test('should create a new block', async () => {
    const blockContent: BlockContent = {
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: 'Test paragraph' } }],
      },
    };

    const result = await createBlock(apiKey, pageId, blockContent);
    expect(result).toBeDefined();
    console.log(result, result.object);

  });

});