import { z } from 'zod';
import { tool } from 'ai';
import { NotionClient, DatabaseAPI } from '../notion';
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";


/**
 * Schema for creating a new Notion database
 */
export const CreateDatabaseParameters = z.object({
  parentPageId: z.string().describe('The ID of the parent page where the database will be created'),
  title: z.string().describe('The title of the new database'),
  properties: z.record(z.object({
    type: z.enum(['title', 'rich_text', 'number', 'select', 'multi_select', 'date', 'people', 'files', 'checkbox', 'url', 'email', 'phone_number', 'formula', 'relation', 'rollup', 'created_time', 'created_by', 'last_edited_time', 'last_edited_by']),
    description: z.string().optional(),
    options: z.array(z.object({ name: z.string(), color: z.string() })).optional(),
  })).describe('An object defining the properties of the database. Each key is the property name, and the value is an object with "type", optional "description", and optional "options" for select/multi_select'),
  isInline: z.boolean().optional().describe('Whether the database should be inline or not'),
});

/**
 * Tool for creating a new Notion database
 * 
 * This tool allows you to create a new database in Notion with specified properties.
 * It's useful for setting up structured data within Notion programmatically.
 */
export const CreateNotionDBTool = tool({
  description: 'Creates a new Notion database with specified properties. Use this to set up structured data in Notion.',
  parameters: CreateDatabaseParameters,
  execute: async ({ parentPageId, title, properties, isInline }) => {
    try {
      const databaseAPI = new DatabaseAPI(new NotionClient(process.env.NOTION_API_KEY || ''));
      
      if (!process.env.NOTION_API_KEY) {
        throw new Error('NOTION_API_KEY is not set in the environment variables');
      }

      // Prepare the parameters for creating the database
      const createParams = {
        parent: { page_id: parentPageId },
        title: [
          {
            type: 'text' as const,
            text: {
              content: title,
            },
          },
        ],
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

      // Create the database using the Notion API
      const newDatabase = await databaseAPI.createDatabase(createParams);

      // Return the ID of the newly created database and a success message
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



export const QueryNotionDBTool = tool({
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
  
        const databaseAPI = new DatabaseAPI(new NotionClient(process.env.NOTION_API_KEY || ''));
      
        const results = await databaseAPI.queryDatabase(databaseId, queryParams);
        return { results: results.results, message: `Successfully queried database ${databaseId}` };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to query database: ${error.message}`);
        } else {
          throw new Error('An unknown error occurred while querying the database');
        }
      }
    },
  });