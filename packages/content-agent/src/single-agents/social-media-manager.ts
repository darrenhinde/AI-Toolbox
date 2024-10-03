import { z } from 'zod';

const SocialMediaManagerInput = z.object({
  finalContents: z.array(z.object({
    draftId: z.string().uuid(),
    title: z.string(),
    body: z.string(),
    hook: z.string(),
    callToAction: z.string(),
    sources: z.array(z.string().url()).optional(),
    editorComments: z.array(z.string()).optional(),
    approvedAt: z.date(),
  })),
  visualAssets: z.array(z.object({
    contentId: z.string().uuid(),
    assetType: z.enum(['Image', 'Video', 'Carousel']),
    assetUrl: z.string().url(),
    altText: z.string(),
    createdAt: z.date(),
  })),
  postingSchedule: z.array(z.object({
    platform: z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram']),
    optimalTime: z.string(),
  })),
});

const ScheduledPost = z.object({
  contentId: z.string().uuid(),
  platform: z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram']),
  scheduledAt: z.date(),
  postedAt: z.date().optional(),
  postUrl: z.string().url().optional(),
});

const ScheduledPostsOutput = z.array(ScheduledPost);

export const socialMediaManager = async (input: z.infer<typeof SocialMediaManagerInput>): Promise<z.infer<typeof ScheduledPostsOutput>> => {
  const { finalContents, visualAssets, postingSchedule } = input;

  const scheduledPosts = finalContents.map(content => {
    const platformSchedule = postingSchedule.find(ps => ps.platform === 'LinkedIn'); // Example for LinkedIn
    return {
      contentId: content.draftId,
      platform: 'LinkedIn',
      scheduledAt: platformSchedule ? new Date(platformSchedule.optimalTime) : new Date(),
    };
  });

  // Validate the output
  const parsedScheduledPosts = ScheduledPostsOutput.parse(scheduledPosts);

  return parsedScheduledPosts;
};