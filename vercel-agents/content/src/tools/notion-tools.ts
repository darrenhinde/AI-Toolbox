import { z } from 'zod';
import { tool } from 'ai';
import { NotionClient, DatabaseAPI, PageAPI } from '@ai-toolbox/notion';

const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
const notionClient = new NotionClient(NOTION_API_KEY);
const databaseAPI = new DatabaseAPI(notionClient);
const pageAPI = new PageAPI(notionClient);

export const CreateDatabaseTool = tool({
  name: 'createDatabase',
  description: 'Creates a new Notion database with specified properties',
  parameters: z.object({
    parentPageId: z.string().describe('The ID of the parent page where the database will be created'),
    title: z.string().describe('The title of the new database'),
    properties: z.record(z.object({
      type: z.enum(['title', 'rich_text', 'number', 'select', 'multi_select', 'date', 'people', 'files', 'checkbox', 'url', 'email', 'phone_number', 'formula', 'relation', 'rollup', 'created_time', 'created_by', 'last_edited_time', 'last_edited_by']),
      description: z.string().optional(),
      options: z.array(z.object({ name: z.string(), color: z.string() })).optional(),
    })).describe('An object defining the properties of the database'),
    isInline: z.boolean().optional().describe('Whether the database should be inline or not'),
  }),
  execute: async ({ parentPageId, title, properties, isInline }) => {
    try {
      const newDatabase = await databaseAPI.createDatabase({
        parent: { page_id: parentPageId },
        title: [{ type: 'text', text: { content: title } }],
        is_inline: isInline,
        properties: properties,
      });
      return { databaseId: newDatabase.id, message: `Database "${title}" created successfully` };
    } catch (error) {
      throw new Error(`Failed to create database: ${error.message}`);
    }
  },
});

export const AddPageToDatabaseTool = tool({
  name: 'addPageToDatabase',
  description: 'Adds a new page to a Notion database',
  parameters: z.object({
    databaseId: z.string().describe('The ID of the database to add the page to'),
    properties: z.record(z.any()).describe('The properties of the new page'),
  }),
  execute: async ({ databaseId, properties }) => {
    try {
      const newPage = await pageAPI.createPage({
        parent: { database_id: databaseId },
        properties: properties,
      });
      return { pageId: newPage.id, message: 'Page added successfully to the database' };
    } catch (error) {
      throw new Error(`Failed to add page to database: ${error.message}`);
    }
  },
});

export const QueryDatabaseTool = tool({
  name: 'queryDatabase',
  description: 'Queries a Notion database',
  parameters: z.object({
    databaseId: z.string().describe('The ID of the database to query'),
    filter: z.object({}).optional().describe('An optional filter to apply to the query'),
    sorts: z.array(z.object({
      property: z.string(),
      direction: z.enum(['ascending', 'descending'])
    })).optional().describe('An optional array of sort objects to order the results'),
    pageSize: z.number().optional().describe('The maximum number of results to return'),
  }),
  execute: async ({ databaseId, filter, sorts, pageSize }) => {
    try {
      const queryResult = await databaseAPI.queryDatabase(databaseId, { filter, sorts, page_size: pageSize });
      return { results: queryResult.results, message: `Successfully queried database ${databaseId}` };
    } catch (error) {
      throw new Error(`Failed to query database: ${error.message}`);
    }
  },
});