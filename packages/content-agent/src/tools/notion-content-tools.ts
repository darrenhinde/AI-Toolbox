import { z } from 'zod';
import { tool } from 'ai';
import { NotionClient, DatabaseAPI, PageAPI } from '../../../notion/src/notion';
import type { QueryDatabaseParameters, CreatePageParameters, BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";


function initializeNotionClient(apiType: 'database' | 'page' | 'both') {
  const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
  const notionClient = new NotionClient(NOTION_API_KEY);
  
  if (apiType === 'database') {
    return { databaseAPI: new DatabaseAPI(notionClient) };
  } else if (apiType === 'page') {
    return { pageAPI: new PageAPI(notionClient) };
  } else {
    return {
      databaseAPI: new DatabaseAPI(notionClient),
      pageAPI: new PageAPI(notionClient)
    };
  }
}

// Define the schema for content database properties
export const ContentDatabaseSchema = z.object({
  Title: z.string(),
  Status: z.enum(['Idea', 'Planned', 'Drafted', 'Finalized', 'Scheduled', 'Published']),
  'Created At': z.date(),
  'Scheduled Date': z.date().optional(),
  Post: z.string(),
  Platform: z.array(z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram'])),
});

export type ContentDatabaseProperties = z.infer<typeof ContentDatabaseSchema>;

// Function to generate Notion database properties from the schema
export function generateNotionDatabaseProperties(schema: typeof ContentDatabaseSchema) {
  const properties: Record<string, any> = {};

  for (const [key, value] of Object.entries(schema.shape)) {
    if (value instanceof z.ZodString) {
      if (key === 'Title') {
        properties[key] = { title: {} };
      } else {
        properties[key] = { rich_text: {} };
      }
    } else if (value instanceof z.ZodEnum) {
      properties[key] = { 
        select: { 
          options: value.options.map(option => ({ name: option }))
        } 
      };
    } else if (value instanceof z.ZodDate || (value instanceof z.ZodOptional && value._def.innerType instanceof z.ZodDate)) {
      properties[key] = { date: {} };
    } else if (value instanceof z.ZodArray && value.element instanceof z.ZodEnum) {
      properties[key] = { 
        multi_select: { 
          options: value.element.options.map(option => ({ name: option }))
        } 
      };
    } else {
      console.warn(`Unsupported Zod type for key: ${key}. Skipping this property.`);
    }
  }

  return properties;
}

export function generateNotionDatabasePropertiesStrings(schema: typeof ContentDatabaseSchema) {
  return (data: ContentDatabaseProperties): CreatePageParameters['properties'] => {
    const properties: CreatePageParameters['properties'] = {};

    for (const [key, value] of Object.entries(schema.shape)) {
      if (value instanceof z.ZodString) {
        if (key === 'Title') {
          properties[key] = { title: [{ text: { content: data[key as keyof ContentDatabaseProperties] as string } }] };
        } else {
          properties[key] = { rich_text: [{ text: { content: data[key as keyof ContentDatabaseProperties] as string } }] };
        }
      } else if (value instanceof z.ZodEnum) {
        properties[key] = { select: { name: data[key as keyof ContentDatabaseProperties] as string } };
      } else if (value instanceof z.ZodDate) {
        properties[key] = { date: { start: (data[key as keyof ContentDatabaseProperties] as Date).toISOString() } };
      } else if (value instanceof z.ZodArray && value.element instanceof z.ZodEnum) {
        properties[key] = { multi_select: (data[key as keyof ContentDatabaseProperties] as string[]).map(item => ({ name: item })) };
      }
    }

    return properties;
  };
}

export const NotionDatabaseProperties = generateNotionDatabaseProperties(ContentDatabaseSchema);

/**
 * Creates a content database in Notion
 * @param parentPageId The ID of the parent page where the database will be created
 * @param title The title of the database
 * @returns The ID of the newly created database
 */
export async function createContentDatabase(parentPageId: string, title: string): Promise<string> {
  const { databaseAPI } = initializeNotionClient('database');
  const properties = NotionDatabaseProperties;

  const createParams = {
    parent: { page_id: parentPageId },
    title: [{ type: 'text' as const, text: { content: title } }],
    properties: properties,
    is_inline: true
  };

  try {
    if (!databaseAPI) {
      throw new Error('Database API not initialized');
    }
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
 * Adds a content page to the specified database
 * @param databaseId The ID of the database to add the page to
 * @param contentData The data for the new content page
 * @returns The ID of the newly created page
 */
export async function addContentPage(databaseId: string, contentData: ContentDatabaseProperties): Promise<string> {
  const { databaseAPI } = initializeNotionClient('database');
  const validatedData = ContentDatabaseSchema.parse(contentData);
  
  const createProperties = generateNotionDatabasePropertiesStrings(ContentDatabaseSchema);
  const properties = createProperties(validatedData);

  try {
    if (!databaseAPI) {
      throw new Error('Database API not initialized');
    }
    const newPage = await databaseAPI.createDatabaseItem(databaseId, {
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
 * Updates a content page with detailed information
 * @param pageId The ID of the page to update
 * @param contentDetails The detailed content to add to the page
 */
export async function updateContentPage(pageId: string, contentDetails: { contentPlan: Record<string, unknown>, contentDraft: string }): Promise<void> {
  const { pageAPI } = initializeNotionClient('page');
  
  let contentPlanString: string;
  try {
    contentPlanString = JSON.stringify(contentDetails.contentPlan, null, 2);
  } catch (error) {
    throw new Error(`Failed to stringify contentPlan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const blocks: BlockObjectRequest[] = [
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: 'Content Plan' } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: contentPlanString } }],
      },
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: 'Content Draft' } }],
      },
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: contentDetails.contentDraft } }],
      },
    },
  ];

  try {
    if (!pageAPI) {
      throw new Error('Page API not initialized');
    }
    await pageAPI.appendToPage(pageId, blocks);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update page: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred while updating the page');
    }
  }
}

/**
 * Tool for appending content to an existing Notion page
 * @description Appends new content blocks to an existing Notion page. Use this to add structured content, such as sections, paragraphs, or lists, to your content pages.
 */
export const AppendToPageTool = tool({
  description: 'Appends new content blocks to an existing Notion page. Useful for adding structured content like sections, paragraphs, or lists to content pages.',
  parameters: z.object({
    pageId: z.string().describe('The ID of the page to append content to'),
    blocks: z.array(z.any()).describe('An array of block objects to append to the page'),
  }),
  execute: async ({ pageId, blocks }) => {
    const { pageAPI } = initializeNotionClient('page');
    try {
      if (!pageAPI) {
        throw new Error('Page API not initialized');
      }
      await pageAPI.appendToPage(pageId, blocks);
      return { message: 'Content appended successfully to the page' };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to append content to page: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while appending content to the page');
      }
    }
  },
});
