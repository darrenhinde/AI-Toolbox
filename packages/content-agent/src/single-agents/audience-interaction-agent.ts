import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../models/index';

const InteractionInput = z.object({
  interactionType: z.enum(['Comment', 'Message', 'Like', 'ProfileView']),
  userName: z.string(),
  content: z.string().optional(),
});

const PersonalizedResponseOutput = z.object({
  response: z.string(),
});

export const audienceInteractionAgent = {
  async generatePersonalizedResponse(input: z.infer<typeof InteractionInput>): Promise<string> {
    const model = getModel();

    const prompt = `Generate a personalized response for the following interaction:
      Interaction Type: ${input.interactionType}
      User Name: ${input.userName}
      Content: ${input.content || 'N/A'}

      The response should be friendly, engaging, and appropriate for the interaction type.`;

    const { object: personalizedResponse } = await generateObject({
      model,
      schema: PersonalizedResponseOutput,
      prompt,
      maxTokens: 200,
      temperature: 0.7,
    });

    return personalizedResponse.response;
  },
};