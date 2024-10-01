import { NotionClient } from "./notion-client";
import { CreateDatabaseParameters, UpdateDatabaseParameters, QueryDatabaseParameters, CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";

export class DatabaseAPI {
  private notionClient: NotionClient;

  constructor(notionClient: NotionClient) {
    this.notionClient = notionClient;
  }

  async createPostingScheduleDatabase(parentPageId: string, title: string) {
    try {
      const database = await this.createDatabase({
        parent: { page_id: parentPageId },
        title: [{ type: "text", text: { content: title } }],
        properties: {
          Date: { title: {} },
          Name: { rich_text: {} },
          Platform: { select: {} },
          Time: { rich_text: {} },
          "Post Description": { rich_text: {} },
        },
      });

      const dates = [
        new Date().toISOString().split('T')[0],
        new Date(Date.now() + 86400000).toISOString().split('T')[0],
        new Date(Date.now() + 172800000).toISOString().split('T')[0],
      ];

      for (const date of dates) {
        await this.createDatabaseItem(database.id, {
          parent: { database_id: database.id },
          properties: {
            Date: { title: [{ text: { content: date } }] },
            Name: { rich_text: [{ text: { content: "Sample Post" } }] },
            Platform: { select: { name: "Twitter" } },
            Time: { rich_text: [{ text: { content: "12:00 PM" } }] },
            "Post Description": { rich_text: [{ text: { content: "This is a sample post description." } }] },
          },
        });
      }

      return database;
    } catch (error) {
      console.error("Error creating posting schedule database:", error);
      throw error;
    }
  }

  async createDatabaseItem(databaseId: string, params: CreatePageParameters) {
    try {
      const response = await this.notionClient.getClient().pages.create(params);
      return response;
    } catch (error) {
      console.error("Error creating database item:", error);
      throw error;
    }
  }

  async createDatabase(params: CreateDatabaseParameters) {
    try {
      const response = await this.notionClient.getClient().databases.create(params);
      return response;
    } catch (error) {
      console.error("Error creating database:", error);
      throw error;
    }
  }

  async getDatabase(databaseId: string) {
    try {
      const response = await this.notionClient.getClient().databases.retrieve({ database_id: databaseId });
      return response;
    } catch (error) {
      console.error("Error retrieving database:", error);
      throw error;
    }
  }

  async updateDatabase(databaseId: string, params: UpdateDatabaseParameters) {
    try {
      const response = await this.notionClient.getClient().databases.update({
        ...params,
        database_id: databaseId,
      });
      return response;
    } catch (error) {
      console.error("Error updating database:", error);
      throw error;
    }
  }

  async deleteDatabase(databaseId: string) {
    try {
      const response = await this.notionClient.getClient().databases.update({
        database_id: databaseId,
        archived: true,
      });
      return response;
    } catch (error) {
      console.error("Error deleting database:", error);
      throw error;
    }
  }

  async queryDatabase(databaseId: string, params: QueryDatabaseParameters) {
    try {
      const response = await this.notionClient.getClient().databases.query({
        ...params,
        database_id: databaseId,
      });
      return response;
    } catch (error) {
      console.error("Error querying database:", error);
      throw error;
    }
  }
}
