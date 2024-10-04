import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../models/index';

const ContentStrategistInput = z.object({
  contentIdeas: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    relevanceScore: z.number().min(0).max(1),
    createdAt: z.date(),
  })),
  campaignGoals: z.array(z.string()),
  targetPlatforms: z.array(z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram'])),
});

const ContentPlanItem = z.object({
  ideaId: z.string().uuid(),
  title: z.string(),
  objectives: z.array(z.string()),
  platforms: z.array(z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram'])),
  keyMessages: z.array(z.string()),
  scheduledDate: z.date(),
});

const ContentPlanOutput = z.array(ContentPlanItem);

export const contentStrategist = async (input: z.infer<typeof ContentStrategistInput>): Promise<z.infer<typeof ContentPlanOutput>> => {
  const { contentIdeas, campaignGoals, targetPlatforms } = input;
  const model = getModel();

  const prompt = `
You are a Content Strategist. Your task is to refine the given content ideas and develop a strategic content plan. The plan should align with the following campaign goals: ${campaignGoals.join(', ')}. The target platforms are: ${targetPlatforms.join(', ')}.

For each content idea, create a plan with:
- ideaId: Corresponding to the content idea.
- title: The title of the content.
- objectives: Objectives that this content aims to achieve.
- platforms: The platforms best suited for this content.
- keyMessages: Key messages to convey.
- scheduledDate: Proposed date for publishing.

Ensure that the plan maximizes relevance and impact.

Content Ideas: ${JSON.stringify(contentIdeas)}
`;

  const { object: plan } = await generateObject({
    model,
    schema: ContentPlanOutput,
    prompt,
    maxTokens: 1500,
    temperature: 0.7,
  });

  return plan;
};