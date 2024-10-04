import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../models/index';
import { audienceInteractionAgent } from './audience-interaction-agent';

const CommunityManagerInput = z.object({
  scheduledPosts: z.array(z.object({
    contentId: z.string().uuid(),
    platform: z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram']),
    scheduledAt: z.date(),
    postedAt: z.date().optional(),
    postUrl: z.string().url().optional(),
  })),
  audienceData: z.array(z.object({
    userId: z.string(),
    userName: z.string(),
    interactionType: z.enum(['Comment', 'Like', 'ProfileView']),
  })),
});

const EngagementActivity = z.object({
  date: z.date(),
  platform: z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram']),
  interactions: z.array(
    z.object({
      userId: z.string(),
      interactionType: z.enum(['Comment', 'Message', 'Like', 'Share']),
      content: z.string().optional(),
    })
  ),
});

const EngagementActivitiesOutput = z.array(EngagementActivity);

export const communityManager = async (input: z.infer<typeof CommunityManagerInput>): Promise<z.infer<typeof EngagementActivitiesOutput>> => {
  const { scheduledPosts, audienceData } = input;
  const model = getModel();

  const prompt = `
You are a Community Manager responsible for engaging with the audience. Your tasks include responding to comments and messages, leaving comments on other users' posts, and sending appreciation messages.

Key Objectives:
- Respond to interactions promptly.
- Personalize responses to foster engagement.
- Keep track of all engagement activities.

Audience Data: ${JSON.stringify(audienceData)}

Generate engagement activities based on the audience interactions.
`;

  const { object: activities } = await generateObject({
    model,
    schema: EngagementActivitiesOutput,
    prompt,
    maxTokens: 2000,
    temperature: 0.7,
  });

  return activities;
};