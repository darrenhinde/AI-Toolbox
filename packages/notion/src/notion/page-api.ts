import { NotionClient } from './notion-client';
import { CreatePageParameters, UpdatePageParameters, GetPageResponse, BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints';

export interface PageProperties {
  title: {
    title: Array<{
      text: { content: string }
    }>
  }
}

export interface RichText {
  type: 'text';
  text: { content: string; link?: { url: string } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red' | 'gray_background' | 'brown_background' | 'orange_background' | 'yellow_background' | 'green_background' | 'blue_background' | 'purple_background' | 'pink_background' | 'red_background';
  };
  plain_text?: string;
  href?: string | null;
}

export type BlockContent = BlockObjectRequest;

export class NotionPageAPI {
  private notionClient: NotionClient;

  constructor(notionClient: NotionClient) {
    this.notionClient = notionClient;
  }

  async createPage(parentId: string, title: string, content: string): Promise<string> {
    const response = await this.notionClient.getClient().pages.create({
      parent: { page_id: parentId },
      properties: {
        title: {
          title: [{ text: { content: title } }]
        }
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content } }]
          }
        }
      ]
    });
    return response.id;
  }

  async appendToPage(pageId: string, blocks: BlockObjectRequest[]): Promise<void> {
    await this.notionClient.getClient().blocks.children.append({
      block_id: pageId,
      children: blocks
    });
  }

  async editPage(pageId: string, newTitle: string): Promise<void> {
    await this.notionClient.getClient().pages.update({
      page_id: pageId,
      properties: {
        title: {
          title: [{ text: { content: newTitle } }]
        }
      }
    });
  }

  async getPage(pageId: string): Promise<GetPageResponse> {
    return await this.notionClient.getClient().pages.retrieve({ page_id: pageId });
  }

  async deletePage(pageId: string): Promise<GetPageResponse> {
    return await this.notionClient.getClient().pages.update({
      page_id: pageId,
      archived: true,
    });
  }
}

export { NotionPageAPI as PageAPI };
