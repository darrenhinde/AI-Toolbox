import { z } from 'zod';
import { createContentDatabase, addContentPage, updateContentPage, ContentDatabaseSchema } from '../tools/notion-content-tools';
import { contentWriter } from '../single-agents/content-writer';
import { getModel } from '../models';
import dotenv from 'dotenv';
import { NotionClient, DatabaseAPI, PageAPI } from '../../../notion/src/notion';
import type { BlockContent, RichText } from '../../../notion/src/notion/page-api';

dotenv.config();

// Define the schema for content plan
const ContentPlanSchema = z.object({
  title: z.string(),
  objective: z.string(),
  keyMessage: z.string(),
  platform: z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram']),
  scheduledDate: z.date(),
});

// Define the schema for content details
const ContentDetailsSchema = z.object({
  contentPlan: ContentPlanSchema,
  contentDraft: z.string(),
});

export async function workflow1(userInput: {
  parentPageId: string;
  contentIdea: string;
  platform: 'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram';
}) {
  console.log('Starting workflow1 with input:', JSON.stringify(userInput));

  // Step 1: Create a content database
  console.log('Step 1: Creating content database');
  const databaseId = await createContentDatabase(userInput.parentPageId, "Content Workflow Database");
  console.log('Content database created with ID:', databaseId);

  // Step 2: Generate content plan and draft
  console.log('Step 2: Generating content plan and draft');
  const contentPlan = ContentPlanSchema.parse({
    title: `${userInput.contentIdea} for ${userInput.platform}`,
    objective: 'Engage audience and increase brand awareness',
    keyMessage: userInput.contentIdea,
    platform: userInput.platform,
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
  });
  console.log("Content plan created, scheduled date is", contentPlan.scheduledDate);
  const contentDraft = await contentWriter({
    contentPlan,
    styleGuideline: "Use a professional tone suitable for the platform.",
    template: "[Platform] post template",
    hook: "Engaging opening line",
  });

  // Step 3: Add content page to the database
  console.log('Step 3: Adding content page to the database');
  const pageData = ContentDatabaseSchema.parse({
    Title: contentPlan.title,
    Status: 'Drafted',
    Post: contentDraft.body,
    'Created At': new Date(),
    'Scheduled Date': contentPlan.scheduledDate,
    Platform: [contentPlan.platform],
  });
  console.log('Page Data', pageData);
  const pageId = await addContentPage(databaseId, pageData);
  console.log('Content page added with ID:', pageId);

  // Step 4: Update the page with detailed content
  console.log('Step 4: Updating page with detailed content');
  const pageDetails = ContentDetailsSchema.parse({
    contentPlan,
    contentDraft: JSON.stringify(contentDraft),
  });

  // Prepare rich content to append to the page
  const blockContents: BlockContent[] = [
    {
      object: 'block',
      type: 'heading_1',
      heading_1: { rich_text: [{ type: 'text', text: { content: contentPlan.title } }] }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: `Objective: ${contentPlan.objective}` } }] }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: `Key Message: ${contentPlan.keyMessage}` } }] }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: `Platform: ${contentPlan.platform}` } }] }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: `Scheduled Date: ${contentPlan.scheduledDate.toISOString()}` } }] }
    },
    {
      object: 'block',
      type: 'divider',
      divider: {}
    },
    {
      object: 'block',
      type: 'heading_2',
      heading_2: { rich_text: [{ type: 'text', text: { content: 'Content Draft' } }] }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: contentDraft.body } }] }
    },
    {
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: [{ type: 'text', text: { content: 'Important: Review and refine the content before publishing.' } }],
        icon: { emoji: '📝' }
      }
    }
  ];

  // Use the PageAPI to append the rich content to the page
  const notionApiKey = process.env.NOTION_API_KEY;
  if (!notionApiKey) {
    throw new Error('NOTION_API_KEY environment variable is not set');
  }
  const notionClient = new NotionClient(notionApiKey);
  const pageAPI = new PageAPI(notionClient);
  await pageAPI.appendToPage(pageId, blockContents);

  console.log('Page updated successfully with detailed content');

  console.log('Workflow completed successfully');
  return { message: 'Workflow completed successfully', databaseId, pageId };
}

// Test run of the workflow
async function testWorkflow() {
  console.log('Starting test workflow');
  const testInput = {
    parentPageId: process.env.NOTION_PARENT_PAGE_ID || '',
    contentIdea: 'Working with AI and staying ahead',
    platform: 'LinkedIn' as 'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram'
  };

  try {
    console.log("Starting workflow1 test with input:", JSON.stringify(testInput));
    const result = await workflow1(testInput);
    console.log('Workflow test result:', result);
  } catch (error) {
    console.error('Workflow test error:', error);
  }
}

// Run the test
console.log('Great ways to stay ahead with reading and business');
testWorkflow();
