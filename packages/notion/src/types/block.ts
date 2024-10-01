
export type Block = {
  object: 'block';
  id: string;
  parent: {
    type: 'page_id' | 'block_id' | 'database_id';
    page_id?: string;
    block_id?: string;
    database_id?: string;
  };
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: 'user';
    id: string;
  };
  last_edited_by: {
    object: 'user';
    id: string;
  };
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
  type: string;
  [key: string]: any;
};

export type BlockContent = {
  type: string;
  [key: string]: any;
};

export type UpdateBlockParameters = {
  block_id: string;
  [key: string]: any;
};

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
