import { NotionClient } from './notion-client';
import { CreatePageParameters, UpdatePageParameters, GetPageResponse } from '@notionhq/client/build/src/api-endpoints';

export interface PageProperties {
  title: {
    title: Array<{
      text: { content: string }
    }>
  }
}

export interface BlockContent {
  object: 'block';
  type: 'paragraph';
  paragraph: {
    rich_text: Array<{
      type: 'text';
      text: { content: string }
    }>
  }
}

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
    } as CreatePageParameters);
    return response.id;
  }

  async appendToPage(pageId: string, content: string): Promise<void> {
    await this.notionClient.getClient().blocks.children.append({
      block_id: pageId,
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
  }

  async editPage(pageId: string, newTitle: string): Promise<void> {
    await this.notionClient.getClient().pages.update({
      page_id: pageId,
      properties: {
        title: {
          title: [{ text: { content: newTitle } }]
        }
      }
    } as UpdatePageParameters);
  }

  async getPage(pageId: string): Promise<GetPageResponse> {
    return await this.notionClient.getClient().pages.retrieve({ page_id: pageId });
  }

  async deletePage(pageId: string): Promise<GetPageResponse> {
    return await this.notionClient.getClient().pages.update({
      page_id: pageId,
      archived: true,
    } as UpdatePageParameters);
  }
}

export { NotionPageAPI as PageAPI };
