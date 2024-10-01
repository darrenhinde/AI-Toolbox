import { NotionAPI } from '../utils/api';
import { DatabaseProperties } from '../types/database';

export async function create_database(
  apiKey: string,
  parentPageId: string,
  title: string,
  properties: DatabaseProperties,
  isInline: boolean = false,
) {
  const api = new NotionAPI(apiKey);
  const data = {
    parent: { page_id: parentPageId },
    title: [{ type: 'text', text: { content: title } }],
    properties,
    is_inline: isInline,
  };
  return api.request('POST', '/databases', data);
}
