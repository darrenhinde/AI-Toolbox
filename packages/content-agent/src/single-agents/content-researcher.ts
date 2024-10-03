import { generateText } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';

const ContentResearchInput = z.object({
  campaignGoals: z.array(z.string()),
  targetAudience: z.array(z.string()),
  industry: z.string(),
  previousContent: z.array(z.string()).optional(),
});

const ContentIdea = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  relevanceScore: z.number().min(0).max(1),
  createdAt: z.date(),
});

const ContentIdeasOutput = z.array(ContentIdea);

export const contentResearcher = async (input: z.infer<typeof ContentResearchInput>): Promise<z.infer<typeof ContentIdeasOutput>> => {
  const { campaignGoals, targetAudience, industry, previousContent } = input;

  const systemPrompt = `
You are a Content Researcher with expertise in ${industry}. Your role is to generate innovative content ideas that align with the following campaign goals: ${campaignGoals.join(', ')}. Consider the interests of the target audience: ${targetAudience.join(', ')}. Avoid repeating topics from previous content.

Provide a list of content ideas with the following structure:
- id: A unique UUID.
- title: A compelling headline for the content idea.
- description: A brief description of the content idea.
- keywords: Relevant keywords associated with the idea.
- relevanceScore: A score between 0 and 1 indicating the idea's relevance.
- createdAt: The date and time of idea creation.

Ensure that each idea is unique, relevant, and valuable to the target audience.
`;

  const userPrompt = `Generate content ideas based on the above information.`;

  const response = await generateText({
    model: openai('gpt-4'),
    prompt: systemPrompt + '\n' + userPrompt,
    maxTokens: 1500,
    temperature: 0.7,
  });

  // Parse the response and validate it against the ContentIdeasOutput schema
  const ideas = JSON.parse(response.text);
  const parsedIdeas = ContentIdeasOutput.parse(ideas);

  return parsedIdeas;
};