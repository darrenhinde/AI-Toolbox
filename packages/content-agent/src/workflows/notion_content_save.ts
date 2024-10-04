import { z } from 'zod';
import { createContentDatabase, addContentPage, updateContentPage, ContentDatabaseSchema } from '../tools/notion-content-tools';

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
  const parentPageId = 'your-parent-page-id-here'; // Replace with actual parent page ID
  console.log('Step 1: Creating content database');
  const databaseId = await createContentDatabase(parentPageId);
  console.log('Content database created with ID:', databaseId);

  // Step 2: Add first content page
  console.log('Step 2: Adding first content page');
  const firstPageData = ContentDatabaseSchema.parse({
    Title: 'First Content Page',
    Status: 'Drafted',
    'Created At': new Date(),
    'Scheduled Date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    Platform: ['LinkedIn', 'Twitter'],
  });
  const firstPageId = await addContentPage(databaseId, firstPageData);
  console.log('First content page added with ID:', firstPageId);

  // Step 3: Update first content page
  console.log('Step 3: Updating first content page');
  const firstPageDetails = ContentDetailsSchema.parse({
    contentPlan: {
      title: 'First Content Plan',
      objectives: ['Increase engagement', 'Promote new product'],
      keyMessages: ['Our product is amazing', 'Limited time offer'],
    },
    contentDraft: 'This is the draft content for the first page. It will be expanded later.',
  });
  await updateContentPage(firstPageId, firstPageDetails);
  console.log('First content page updated successfully');

  // Step 4: Add second content page
  console.log('Step 4: Adding second content page');
  const secondPageData = ContentDatabaseSchema.parse({
    Title: 'Second Content Page',
    Status: 'Planned',
    'Created At': new Date(),
    'Scheduled Date': new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    Platform: ['Facebook', 'Instagram'],
  });
  const secondPageId = await addContentPage(databaseId, secondPageData);
  console.log('Second content page added with ID:', secondPageId);

  // Step 5: Update second content page
  console.log('Step 5: Updating second content page');
  const secondPageDetails = ContentDetailsSchema.parse({
    contentPlan: {
      title: 'Second Content Plan',
      objectives: ['Boost brand awareness', 'Drive website traffic'],
      keyMessages: ['Join our community', 'Exclusive content available'],
    },
    contentDraft: 'This is the draft content for the second page. It will be refined before publishing.',
  });
  await updateContentPage(secondPageId, secondPageDetails);
  console.log('Second content page updated successfully');

  console.log('notionContentSaveWorkflow completed successfully');
  return { message: 'Workflow completed successfully', databaseId, firstPageId, secondPageId };
}

// Uncomment the following lines to run the workflow
// notionContentSaveWorkflow().then(result => {
//   console.log('Workflow result:', result);
// }).catch(error => {
//   console.error('Workflow error:', error);
// });
