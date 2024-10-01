import { NotionAPI } from '../utils/api';
import { BlockContent, UpdateBlockParameters, BlockId, Block, BlockDeletionResponse } from '../types/block';

// Function to create a new block
export async function create_block(
  apiKey: string,
  pageId: string,
  blockContent?: Partial<BlockContent>,
): Promise<Block> {
  const api = new NotionAPI(apiKey);
  const defaultBlock: BlockContent = {
    type: 'paragraph',
    paragraph: {
      rich_text: [{ type: 'text', text: { content: 'Default text block' } }],
    },
  };

  const data = {
    parent: { page_id: pageId },
    ...(blockContent || defaultBlock),
  };

  return api.request('POST', '/blocks', data);
}

// Function to update an existing block
export async function update_block(
  apiKey: string,
  blockId: BlockId,
  updateParams: UpdateBlockParameters
): Promise<Block> {
  const api = new NotionAPI(apiKey);
  return api.request('PATCH', `/blocks/${blockId}`, updateParams);
}

// Function to delete a block
export async function delete_block(
  apiKey: string,
  blockId: BlockId
): Promise<BlockDeletionResponse> {
  const api = new NotionAPI(apiKey);
  return api.request('DELETE', `/blocks/${blockId}`);
}

// Function to retrieve a block
export async function retrieve_block(
  apiKey: string,
  blockId: BlockId
): Promise<Block> {
  const api = new NotionAPI(apiKey);
  return api.request('GET', `/blocks/${blockId}`);
}
