import { z } from 'zod';
import { tool } from 'ai';
import { PageAPI, NotionClient } from '../notion';
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

export const FindPageTool = tool({
    description: 'Finds a Notion page by its ID. Use this to retrieve details about a specific page.',
    parameters: z.object({
      pageId: z.string().describe('The ID of the page to find'),
    }),
    execute: async ({ pageId }) => {
      try {
        const notionClient = new NotionClient(process.env.NOTION_API_KEY || '');
        const pageAPI = new PageAPI(notionClient);
        const page = await pageAPI.getPage(pageId);
        return { page, message: `Successfully retrieved page ${pageId}` };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to find page: ${error.message}`);
        } else {
          throw new Error('An unknown error occurred while finding the page');
        }
      }
    },
  });