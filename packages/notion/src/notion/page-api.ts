import { NotionClient } from "./notion-client";
import { CreatePageParameters, UpdatePageParameters } from "@notionhq/client/build/src/api-endpoints";

export class PageAPI {
  private notionClient: NotionClient;

  constructor(notionClient: NotionClient) {
    this.notionClient = notionClient;
  }

  async createPage(params: CreatePageParameters) {
    try {
      const response = await this.notionClient.getClient().pages.create(params);
      return response;
    } catch (error) {
      console.error("Error creating page:", error);
      throw error;
    }
  }

  async getPage(pageId: string) {
    try {
      const response = await this.notionClient.getClient().pages.retrieve({ page_id: pageId });
      return response;
    } catch (error) {
      console.error("Error retrieving page:", error);
      throw error;
    }
  }

  async updatePage(pageId: string, params: UpdatePageParameters) {
    try {
      const response = await this.notionClient.getClient().pages.update({
        page_id: pageId,
        ...params,
      });
      return response;
    } catch (error) {
      console.error("Error updating page:", error);
      throw error;
    }
  }

  async archivePage(pageId: string) {
    try {
      const response = await this.notionClient.getClient().pages.update({
        page_id: pageId,
        archived: true,
      });
      return response;
    } catch (error) {
      console.error("Error archiving page:", error);
      throw error;
    }
  }

  async deletePage(pageId: string) {
    return this.archivePage(pageId);
  }
}
