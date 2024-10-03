import {
  contentResearcher,
  contentStrategist,
  contentWriter,
  contentEditor,
  graphicDesigner,
  socialMediaManager,
  communityManager,
  dataAnalyst,
  contentArchivist
} from '../single-agents';

import { createContentDatabase, addContentPage, updateContentPage } from '../tools/notion-tools';

export async function runContentWorkflow(initialInput: any) {
  // Step 1: Content Researcher
  const contentIdeas = await contentResearcher(initialInput);

  // Step 2: Content Strategist
  const contentPlan = await contentStrategist({
    contentIdeas,
    campaignGoals: initialInput.campaignGoals,
    targetPlatforms: initialInput.targetPlatforms,
  });

  // Create Notion Database
  const parentPageId = initialInput.parentPageId; // Assuming this is provided
  const notionDatabaseId = await createContentDatabase(parentPageId);

  // For each content plan item, process the rest of the workflow
  for (const planItem of contentPlan) {
    // Step 3: Content Writer
    const contentDrafts = await contentWriter({
      contentPlan: [planItem],
      styleGuidelines: initialInput.styleGuidelines,
      templates: initialInput.templates,
      hooks: initialInput.hooks,
    });

    const contentDraft = contentDrafts[0];

    // Step 4: Content Editor
    const finalContents = await contentEditor({
      contentDrafts: [contentDraft],
      styleGuidelines: initialInput.styleGuidelines,
    });

    const finalContent = finalContents[0];

    // Step 5: Graphic Designer
    const visualAssets = await graphicDesigner({
      finalContents: finalContents,
      brandGuidelines: initialInput.brandGuidelines,
      platformSpecifications: initialInput.platformSpecifications,
    });

    const visualAsset = visualAssets[0];

    // Step 6: Social Media Manager
    const scheduledPosts = await socialMediaManager({
      finalContents: finalContents,
      visualAssets: visualAssets,
      postingSchedule: initialInput.postingSchedule,
    });

    const scheduledPost = scheduledPosts[0];

    // Save data to Notion
    const pageId = await addContentPage(notionDatabaseId, {
      title: finalContent.title,
      scheduledDate: scheduledPost.scheduledAt,
      platforms: planItem.platforms,
    });

    await updateContentPage(pageId, {
      contentPlan: planItem,
      contentDraft: contentDraft.body,
      finalContent: finalContent.body,
      visualAssetUrl: visualAsset.assetUrl,
      scheduledPostUrl: scheduledPost.postUrl,
      // Add other details as needed
    });
  }

  // Step 7: Community Manager
  const engagementActivities = await communityManager({
    scheduledPosts,
    audienceData: initialInput.audienceData,
  });

  // Step 8: Data Analyst
  const performanceReports = await dataAnalyst({
    engagementActivities,
    scheduledPosts,
    KPIs: initialInput.KPIs,
  });

  // Step 9: Content Archivist
  const archivedContents = await contentArchivist({
    finalContents: finalContents,
    visualAssets: visualAssets,
    performanceReports: performanceReports,
  });

  return {
    contentIdeas,
    contentPlan,
    contentDrafts,
    finalContents,
    visualAssets,
    scheduledPosts,
    engagementActivities,
    performanceReports,
    archivedContents,
  };
}