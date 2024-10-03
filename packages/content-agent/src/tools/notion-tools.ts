import { z } from 'zod';
import { tool } from 'ai';
import { NotionClient, DatabaseAPI, PageAPI } from '../../../notion/src/notion';
import type { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

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

export const CreateDatabaseTool = tool({
  description: 'Creates a new Notion database with specified properties. Use this to set up structured data in Notion.',
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

export const AddPageToDatabaseTool = tool({
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
      if (error instanceof Error) {
        throw new Error(`Failed to add page to database: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while adding the page to the database');
      }
    }
  },
});

export const QueryDatabaseTool = tool({
  description: 'Queries a Notion database with specified filters and sorts. Use this to retrieve data from a Notion database.',
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

/**
 * Function to create a content database in Notion
 */
export async function createContentDatabase(parentPageId: string): Promise<string> {
  const title = 'Content Workflow Database';
  const properties = {
    'Title': { title: {} },
    'Status': { select: { options: [{ name: 'Idea' }, { name: 'Planned' }, { name: 'Drafted' }, { name: 'Finalized' }, { name: 'Scheduled' }, { name: 'Published' }] } },
    'Created At': { date: {} },
    'Scheduled Date': { date: {} },
    'Platform': { multi_select: { options: [{ name: 'LinkedIn' }, { name: 'Twitter' }, { name: 'Facebook' }, { name: 'Instagram' }] } },
    // Add more properties as needed
  };

  const createParams = {
    parent: { page_id: parentPageId },
    title: [{ type: 'text' as const, text: { content: title } }],
    properties: properties,
  };

  try {
    const newDatabase = await databaseAPI.createDatabase(createParams);
    return newDatabase.id;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create database: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while creating the database');
    }
  }
}

/**
 * Function to add a content page to the database
 */
export async function addContentPage(databaseId: string, contentData: any): Promise<string> {
  const properties = {
    'Title': {
      title: [{ text: { content: contentData.title } }],
    },
    'Status': {
      select: { name: 'Idea' },
    },
    'Created At': {
      date: { start: new Date().toISOString() },
    },
    'Scheduled Date': {
      date: { start: contentData.scheduledDate },
    },
    'Platform': {
      multi_select: contentData.platforms.map((platform: string) => ({ name: platform })),
    },
  };

  try {
    const newPage = await pageAPI.createPage({
      parent: { database_id: databaseId },
      properties: properties,
    });
    return newPage.id;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to add page to database: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while adding the page to the database');
    }
  }
}

/**
 * Function to update a content page with detailed information
 */
export async function updateContentPage(pageId: string, contentDetails: any): Promise<void> {
  const blocks = [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        text: [{ type: 'text', text: { content: 'Content Plan' } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        text: [{ type: 'text', text: { content: JSON.stringify(contentDetails.contentPlan, null, 2) } }],
      },
    },
    // Add more blocks for each agent's output
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        text: [{ type: 'text', text: { content: 'Content Draft' } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        text: [{ type: 'text', text: { content: contentDetails.contentDraft } }],
      },
    },
    // Continue with other sections
  ];

  try {
    await pageAPI.appendBlockChildren(pageId, blocks);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update page: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while updating the page');
    }
  }
}