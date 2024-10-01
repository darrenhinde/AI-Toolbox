export type SearchOptions = {
  filter?: {
    property: string;
    value: string;
  };
  sort?: {
    direction: 'ascending' | 'descending';
    timestamp: 'created_time' | 'last_edited_time';
  };
};

export type SearchResult = {
  id: string;
  title: string;
  url: string;
};

export type PageContent = {
  id: string;
  title: string;
  properties: Record<string, any>;
  content: string;
};
