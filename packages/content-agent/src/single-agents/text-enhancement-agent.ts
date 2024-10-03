import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const textEnhancementAgent = {
  async rewordText(text: string): Promise<string> {
    const prompt = `Reword the following text to improve clarity while keeping the original meaning:\n\n${text}`;
    const { text: rewordedText } = await generateText({
      model: openai('gpt-4'),
      prompt,
      maxTokens: 1000,
      temperature: 0.7,
    });
    return rewordedText;
  },

  async rewriteText(text: string, style: string, intent: string): Promise<string> {
    const prompt = `Rewrite the following text according to the specified style and intent:
Text: ${text}
Style: ${style}
Intent: ${intent}`;
    const { text: rewrittenText } = await generateText({
      model: openai('gpt-4'),
      prompt,
      maxTokens: 1000,
      temperature: 0.7,
    });
    return rewrittenText;
  },
};