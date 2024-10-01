import { NotionAPI } from '../utils/api';
import { DatabaseProperties } from '../types/database';

export async function create_database(
  apiKey: string,
  parentPageId: string,
  title: string,
  properties: DatabaseProperties,
) {
  const api = new NotionAPI(apiKey);
  const data = {
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: title } }],
    properties,
  };
  return api.request('POST', '/databases', data);
}