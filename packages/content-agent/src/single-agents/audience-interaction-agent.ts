import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const audienceInteractionAgent = {
  async generatePersonalizedResponse(
    interactionType: 'Comment' | 'Message' | 'Like' | 'ProfileView',
    userName: string,
    content?: string
  ): Promise<string> {
    const prompt = `Generate a personalized response for the following interaction:
Interaction Type: ${interactionType}
User Name: ${userName}
Content: ${content || 'N/A'}

The response should be friendly, engaging, and appropriate for the interaction type.`;

    const { text: personalizedResponse } = await generateText({
      model: openai('gpt-4'),
      prompt,
      maxTokens: 200,
      temperature: 0.7,
    });
    return personalizedResponse;
  },
};