import { z } from 'zod';
import { tool } from 'ai';
import { NotionClient, DatabaseAPI, PageAPI } from '../../../notion/src/notion';
import type { QueryDatabaseParameters, CreatePageParameters, BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";

const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
const notionClient = new NotionClient(NOTION_API_KEY);
const databaseAPI = new DatabaseAPI(notionClient);
const pageAPI = new PageAPI(notionClient);

/**
 * Schema for creating a new Notion database
 */
const CreateDatabaseParameters = z.object({
  parentPageId: z.string().describe('The ID of the parent page where the database will be created'),
  title: z.string().describe('The title of the new database'),
  properties: z.record(z.object({
    type: z.enum(['title', 'rich_text', 'number', 'select', 'multi_select', 'date', 'people', 'files', 'checkbox', 'url', 'email', 'phone_number', 'formula', 'relation', 'rollup', 'created_time', 'created_by', 'last_edited_time', 'last_edited_by']),
    description: z.string().optional(),
    options: z.array(z.object({ name: z.string(), color: z.string() })).optional(),
  })).describe('An object defining the properties of the database'),
  isInline: z.boolean().optional().describe('Whether the database should be inline or not'),
});

/**
 * Tool for creating a new Notion database
 * @description Creates a new Notion database with specified properties. Use this to set up structured data in Notion for content management, task tracking, or any other organizational needs.
 */
export const CreateDatabaseTool = tool({
  description: 'Creates a new Notion database with specified properties. Useful for setting up structured data for content management, task tracking, or other organizational needs.',
  parameters: CreateDatabaseParameters,
  execute: async ({ parentPageId, title, properties, isInline }) => {
    try {
      if (!NOTION_API_KEY) {
        throw new Error('NOTION_API_KEY is not set in the environment variables');
      }

      const createParams = {
        parent: { page_id: parentPageId },
        title: [{ type: 'text' as const, text: { content: title } }],
        is_inline: isInline,
        properties: Object.entries(properties).reduce((acc, [key, value]) => {
          if (value.type === 'select' || value.type === 'multi_select') {
            acc[key] = {
              [value.type]: {
                options: value.options || [],
              },
            };
          } else if (value.type === 'number') {
            acc[key] = {
              [value.type]: {
                format: 'number',
              },
            };
          } else if (value.type === 'title') {
            acc[key] = {
              title: {},
            };
          } else {
            acc[key] = { [value.type]: {} };
          }
          return acc;
        }, {} as Record<string, any>),
      };

      const newDatabase = await databaseAPI.createDatabase(createParams);
      return { databaseId: newDatabase.id, message: `Database "${title}" created successfully` };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create database: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while creating the database');
      }
    }
  },
});

/**
 * Tool for adding a new page to a Notion database
 * @description Adds a new page to a specified Notion database with the given properties. Use this to create new entries in your content management system, task list, or any other structured database.
 */
export const AddPageToDatabaseTool = tool({
  description: 'Adds a new page to a Notion database with specified properties. Useful for creating new entries in content management systems, task lists, or any structured database.',
  parameters: z.object({
    databaseId: z.string().describe('The ID of the database to add the page to'),
    properties: z.record(z.any()).describe('The properties of the new page'),
  }),
  execute: async ({ databaseId, properties }) => {
    try {
      const createPageParams: CreatePageParameters = {
        parent: { database_id: databaseId },
        properties: properties,
      };
      const newPage = await pageAPI.createPage(databaseId, 'New Page', JSON.stringify(properties));
      return { pageId: newPage, message: 'Page added successfully to the database' };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add page to database: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while adding the page to the database');
      }
    }
  },
});

/**
 * Tool for querying a Notion database
 * @description Queries a Notion database with specified filters and sorts. Use this to retrieve data from your Notion databases for analysis, reporting, or display purposes.
 */
export const QueryDatabaseTool = tool({
  description: 'Queries a Notion database with specified filters and sorts. Useful for retrieving data from Notion databases for analysis, reporting, or display purposes.',
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
      const queryParams: QueryDatabaseParameters = {
        database_id: databaseId,
        filter: filter as QueryDatabaseParameters['filter'],
        sorts: sorts as QueryDatabaseParameters['sorts'],
        page_size: pageSize,
      };

      const queryResult = await databaseAPI.queryDatabase(databaseId, queryParams);
      return { results: queryResult.results, message: `Successfully queried database ${databaseId}` };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to query database: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while querying the database');
      }
    }
  },
});
