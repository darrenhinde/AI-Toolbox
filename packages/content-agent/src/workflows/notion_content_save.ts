import { z } from 'zod';
import { createContentDatabase, addContentPage, updateContentPage, ContentDatabaseSchema } from '../tools/notion-content-tools';
import dotenv from 'dotenv';

dotenv.config();

// Define the schema for content plan
const ContentPlanSchema = z.object({
  title: z.string(),
  objectives: z.array(z.string()),
  keyMessages: z.array(z.string()),
});

// Define the schema for content details
const ContentDetailsSchema = z.object({
  contentPlan: ContentPlanSchema,
  contentDraft: z.string(),
});

export async function notionContentSaveWorkflow() {
  console.log('Starting notionContentSaveWorkflow');

  // Step 1: Create a content database
  const parentPageId = process.env.NOTION_PARENT_PAGE_ID || ''; // Use environment variable
  console.log('Step 1: Creating content database');
  const databaseId = await createContentDatabase(parentPageId , "TESTIN NEW DATABSAE WORKFLOW");
  console.log('Content database created with ID:', databaseId);

  // Step 2: Add first content page
  console.log('Step 2: Adding first content page');
  const scheduledDate = new Date().toISOString(); // 1 week from now 
  console.log('Scheduled Date for first page:', scheduledDate);
  
  const firstPageData = ContentDatabaseSchema.parse({
    Title: 'First Content Page',
    Status: 'Drafted',
    Post: "SOMETHING AWESOME!!",
    'Created At': new Date(),
    'Scheduled Date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    Platform: ['LinkedIn', 'Twitter'],
  });
  console.log('First page data:', firstPageData);
  
  const firstPageId = await addContentPage(databaseId, firstPageData);
  console.log('First content page added with ID:', firstPageId);

  // Step 3: Update first content page with pretty content
  console.log('Step 3: Updating first content page');
  const firstPageDetails = ContentDetailsSchema.parse({
    contentPlan: {
      title: 'First Content Plan',
      objectives: ['Increase engagement', 'Promote new product'],
      keyMessages: ['Our product is amazing', 'Limited time offer'],
    },
    contentDraft: `
      <h1>First Content Plan</h1>
      <h2>Objectives</h2>
      <ul>
        <li>Increase engagement</li>
        <li>Promote new product</li>
      </ul>
      <h2>Key Messages</h2>
      <ul>
        <li>Our product is amazing</li>
        <li>Limited time offer</li>
      </ul>
      <p>This is the draft content for the first page. It will be expanded later.</p>
    `,
  });
  await updateContentPage(firstPageId, firstPageDetails);
  console.log('First content page updated successfully');

  // Step 4: Add second content page
  console.log('Step 4: Adding second content page');
  const secondScheduledDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 2 weeks from now
  console.log('Scheduled Date for second page:', secondScheduledDate);
  
  const secondPageData = ContentDatabaseSchema.parse({
    Title: 'Second Content Page',
    Status: 'Planned',
    'Created At': new Date(),
    Post: "SOMETHING 2!!",
    'Scheduled Date': secondScheduledDate,
    Platform: ['Facebook', 'Instagram'],
  });
  console.log('Second page data:', secondPageData);
  
  const secondPageId = await addContentPage(databaseId, secondPageData);
  console.log('Second content page added with ID:', secondPageId);

  // Step 5: Update second content page with pretty content
  console.log('Step 5: Updating second content page');
  const secondPageDetails = ContentDetailsSchema.parse({
    contentPlan: {
      title: 'Second Content Plan',
      objectives: ['Boost brand awareness', 'Drive website traffic'],
      keyMessages: ['Join our community', 'Exclusive content available'],
    },
    contentDraft: `
      <h1>Second Content Plan</h1>
      <h2>Objectives</h2>
      <ul>
        <li>Boost brand awareness</li>
        <li>Drive website traffic</li>
      </ul>
      <h2>Key Messages</h2>
      <ul>
        <li>Join our community</li>
        <li>Exclusive content available</li>
      </ul>
      <p>This is the draft content for the second page. It will be refined before publishing.</p>
    `,
  });
  await updateContentPage(secondPageId, secondPageDetails);
  console.log('Second content page updated successfully');

  console.log('notionContentSaveWorkflow completed successfully');
  return { message: 'Workflow completed successfully', databaseId, firstPageId, secondPageId };
}

// Uncomment the following lines to run the workflow
console.log("starting...")
notionContentSaveWorkflow().then(result => {
  console.log('Workflow result:', result);
}).catch(error => {
  console.error('Workflow error:', error);
});
