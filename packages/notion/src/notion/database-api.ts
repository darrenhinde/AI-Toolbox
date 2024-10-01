import { NotionClient } from "./notion-client";
import { CreateDatabaseParameters, UpdateDatabaseParameters, QueryDatabaseParameters, CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";

export class DatabaseAPI {
  private notionClient: NotionClient;

  constructor(notionClient: NotionClient) {
    this.notionClient = notionClient;
  }

  async createPostingScheduleDatabase(parentPageId: string, title: string) {
    try {
      const response = await this.notionClient.getClient().pages.create({
        parent: { page_id: parentPageId },
        properties: {},
        children: [
          {
            object: 'block',
            type: 'table',
            table: {
              table_width: 5,
              has_column_header: true,
              has_row_header: false,
              children: [
                {
                  type: 'table_row',
                  table_row: {
                    cells: [
                      [{ type: 'text', text: { content: 'Date' } }],
                      [{ type: 'text', text: { content: 'Name' } }],
                      [{ type: 'text', text: { content: 'Platform' } }],
                      [{ type: 'text', text: { content: 'Time' } }],
                      [{ type: 'text', text: { content: 'Post Description' } }]
                    ]
                  }
                },
                ...this.generateSampleRows()
              ]
            }
          }
        ]
      });

      return response;
    } catch (error) {
      console.error("Error creating posting schedule database:", error);
      throw error;
    }
  }

  private generateSampleRows() {
    const dates = [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 86400000).toISOString().split('T')[0],
      new Date(Date.now() + 172800000).toISOString().split('T')[0],
    ];

    return dates.map(date => ({
      type: 'table_row',
      table_row: {
        cells: [
          [{ type: 'text', text: { content: date } }],
          [{ type: 'text', text: { content: 'Sample Post' } }],
          [{ type: 'text', text: { content: 'Twitter' } }],
          [{ type: 'text', text: { content: '12:00 PM' } }],
          [{ type: 'text', text: { content: 'This is a sample post description.' } }]
        ]
      }
    }));
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
