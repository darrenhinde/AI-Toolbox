import { NotionAPI } from '../utils/api';
import { BlockContent, UpdateBlockParameters, BlockId, Block, BlockDeletionResponse, PaginationParameters, ApiResponse } from '../types/block';

// Function to create a new block
export async function createBlock(
  apiKey: string,
  pageId: string,
  blockContent: BlockContent
): Promise<Block> {
  const api = new NotionAPI(apiKey);
  const data = {
    children: [blockContent],
  };
  return api.request('PATCH', `/blocks/${pageId}/children`, data);
}

// Function to retrieve a block
export async function retrieveBlock(
  apiKey: string,
  blockId: BlockId
): Promise<Block> {
  const api = new NotionAPI(apiKey);
  return api.request('GET', `/blocks/${blockId}`);
}

// Function to update an existing block
export async function updateBlock(
  apiKey: string,
  blockId: BlockId,
  updateParams: UpdateBlockParameters
): Promise<Block> {
  const api = new NotionAPI(apiKey);
  return api.request('PATCH', `/blocks/${blockId}`, updateParams);
}

// Function to delete a block
export async function deleteBlock(
  apiKey: string,
  blockId: BlockId
): Promise<BlockDeletionResponse> {
  const api = new NotionAPI(apiKey);
  return api.request('DELETE', `/blocks/${blockId}`);
}

// Function to list child blocks
export async function listChildBlocks(
  apiKey: string,
  blockId: BlockId,
  paginationParams?: PaginationParameters
): Promise<ApiResponse<Block>> {
  const api = new NotionAPI(apiKey);
  const queryParams = new URLSearchParams(paginationParams as Record<string, string>).toString();
  return api.request('GET', `/blocks/${blockId}/children${queryParams ? `?${queryParams}` : ''}`);
}
