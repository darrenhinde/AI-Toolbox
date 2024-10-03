import { generateText, tool } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
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

// Tool to generate responses
const generateResponseTool = tool({
  description: 'Generate a personalized response to audience interactions.',
  parameters: z.object({
    interactionType: z.enum(['Comment', 'Message', 'Like', 'ProfileView']),
    userName: z.string(),
    content: z.string().optional(),
  }),
  execute: async ({ interactionType, userName, content }) => {
    return audienceInteractionAgent.generatePersonalizedResponse(interactionType, userName, content);
  },
});

export const communityManager = async (input: z.infer<typeof CommunityManagerInput>): Promise<z.infer<typeof EngagementActivitiesOutput>> => {
  const { scheduledPosts, audienceData } = input;

  const systemPrompt = `
You are a Community Manager responsible for engaging with the audience. Your tasks include responding to comments and messages, leaving comments on other users' posts, and sending appreciation messages.

Key Objectives:
- Respond to interactions promptly.
- Personalize responses to foster engagement.
- Keep track of all engagement activities.

You have access to the following tool:
- generateResponse: To create personalized responses.

Use this tool to craft appropriate messages.
`;

  const userPrompt = `Audience Data: ${JSON.stringify(audienceData)}

Generate engagement activities based on the audience interactions.
`;

  // Multi-step process with tools
  const { text } = await generateText({
    model: openai('gpt-4'),
    prompt: systemPrompt + '\n' + userPrompt,
    tools: { generateResponseTool },
    maxSteps: 10,
    maxTokens: 2000,
    temperature: 0.7,
  });

  // Parse the response and validate it against the EngagementActivitiesOutput schema
  const activities = JSON.parse(text);
  const parsedActivities = EngagementActivitiesOutput.parse(activities);

  return parsedActivities;
};