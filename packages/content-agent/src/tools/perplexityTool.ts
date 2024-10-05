import { z } from 'zod';
import { tool, generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const PerplexityTool = tool({
  description: 'Fetches data from the Perplexity API.',
  parameters: z.object({
    prompt: z.string().describe('The prompt to send to the Perplexity API.'),
  }),
  execute: async ({ prompt }) => {
    try {


const perplexity = createOpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY ?? '',
    baseURL: 'https://api.perplexity.ai/',
  });
  
      const { text } = await generateText({
        model: perplexity('llama-3.1-sonar-small-128k-online'),
        prompt: prompt,
      });

      return { data: text };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch data from Perplexity API: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while fetching data from the Perplexity API');
      }
    }
  },
});