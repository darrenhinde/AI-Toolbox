import { NotionAPI } from '../utils/api';
import { PageProperties } from '../types/page';

export async function create_page(
    apiKey: string,
  parentId: string,
  properties: PageProperties,
) {
  const api = new NotionAPI(apiKey);
  const data = {
    parent: { database_id: parentId },
    properties,
  };
  return api.request('POST', '/pages', data);
}