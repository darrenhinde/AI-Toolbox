import { createContentDatabase, addContentPage, updateContentPage } from '../tools/notion-content-tools';
import { contentWriter } from '../single-agents/content-writer';

export async function workflow1(userInput: {
  parentPageId: string;
  contentIdea: string;
  platforms: Array<'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram'>;
}) {
  console.log('Starting workflow1 with input:', JSON.stringify(userInput));

  // Step 1: Create a content database
  console.log('Step 1: Creating content database');
  const databaseId = await createContentDatabase(userInput.parentPageId);
  console.log('Content database created with ID:', databaseId);

  // Step 2: Generate content plans
  console.log('Step 2: Generating content plans');
  let ideaCounter = 1;
  const contentPlans = userInput.platforms.map(platform => ({
    ideaId: `idea-${ideaCounter++}`,
    title: `${userInput.contentIdea} for ${platform}`,
    objectives: ['Engage audience', 'Increase brand awareness'],
    platforms: [platform],
    keyMessages: [userInput.contentIdea],
    scheduledDate: new Date(),
  }));
  console.log('Content plans generated:', JSON.stringify(contentPlans));

  // Step 3: Add each content plan as a page to the database
  console.log('Step 3: Adding content plans as pages to the database');
  for (const contentPlan of contentPlans) {
    console.log('Adding content page for plan:', contentPlan.title);
    const pageId = await addContentPage(databaseId, {
      Title: contentPlan.title,
      Status: 'Drafted',
      'Created At': new Date(),
      'Scheduled Date': contentPlan.scheduledDate,
      Platform: contentPlan.platforms,
    });
    console.log('Content page added with ID:', pageId);

    // Step 4: Append the content plan to the page
    console.log('Appending content plan to page');
    await updateContentPage(pageId, {
      contentPlan,
    });
    console.log('Page updated successfully with content plan');
  }

  console.log('Workflow completed successfully');
  return { message: 'Workflow completed successfully', databaseId };
}

// Test run of the workflow
async function testWorkflow() {
  console.log('Starting test workflow');
  const testInput = {
    parentPageId: process.env.NOTION_PARENT_PAGE_ID || '',
    contentIdea: 'The benefits of regular exercise',
    platforms: ['LinkedIn', 'Twitter', 'Facebook'] as Array<'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram'>
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
console.log('Initiating test workflow');
testWorkflow();
