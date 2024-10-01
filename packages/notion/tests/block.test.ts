import { expect, test, describe } from "bun:test";
import { create_block, update_block, delete_block, retrieve_block } from '../src/operations/block';
import { setupEnvironment } from './tests-setup';
import { BlockObjectRequest, UpdateBlockParameters } from '@notionhq/client/build/src/api-endpoints';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.NOTION_API_KEY;
const pageId = process.env.TEST_PAGE_ID;

console.log( apiKey, pageId)
if (!apiKey || !pageId) {
  console.warn('Skipping block tests: NOTION_API_KEY or TEST_PAGE_ID is not set in the environment');
} else {
  describe('Block operations', () => {
    let createdBlockId: string;

    test('creates a custom block', async () => {
      const blockContent: BlockObjectRequest = {
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'This is a custom test block' } }],
        },
      };

      const result = await create_block(apiKey, pageId, blockContent);

      expect(result).toBeDefined();
      expect(result.object).toBe('block');
      expect((result as any).paragraph.rich_text[0].text.content).toBe('This is a custom test block');
      createdBlockId = result.id;
    });

    test('creates a default text block when no content is specified', async () => {
      const result = await create_block(apiKey, pageId);

      expect(result).toBeDefined();
      expect(result.object).toBe('block');
      expect((result as any).paragraph.rich_text[0].text.content).toBe('Default text block');
    });

    test('updates an existing block', async () => {
      const updateParams: UpdateBlockParameters = {
        block_id: createdBlockId,
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'This is an updated test block' } }],
        },
      };

      const result = await update_block(apiKey, createdBlockId, updateParams);

      expect(result).toBeDefined();
      expect(result.object).toBe('block');
      expect((result as any).paragraph.rich_text[0].text.content).toBe('This is an updated test block');
    });

    test('retrieves a block', async () => {
      const result = await retrieve_block(apiKey, createdBlockId);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdBlockId);
      expect(result.object).toBe('block');
    });

    test('deletes a block', async () => {
      const result = await delete_block(apiKey, createdBlockId);

      expect(result).toBeDefined();
      expect(result.id).toBe(createdBlockId);
      expect(result.object).toBe('block');
    });
  });
}
