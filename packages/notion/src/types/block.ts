import { Client } from '@notionhq/client';

export type Block = Awaited<ReturnType<Client['blocks']['retrieve']>>;
export type BlockContent = Parameters<Client['blocks']['children']['append']>[0]['children'][0];
export type UpdateBlockParameters = Parameters<Client['blocks']['update']>[0];
export type BlockId = string;

// Add a type for the API response
export type ApiResponse<T> = {
  object: 'list';
  results: T[];
  next_cursor: string | null;
  has_more: boolean;
  type: 'block' | 'comment' | 'database' | 'page' | 'page_or_database' | 'property_item' | 'user';
  [key: string]: unknown;
};

// Add types for pagination parameters
export type PaginationParameters = {
  start_cursor?: string;
  page_size?: number;
};

// Add a type for block deletion response
export type BlockDeletionResponse = {
  id: string;
  object: 'block';
  deleted: boolean;
};
