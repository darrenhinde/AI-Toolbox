import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const languageQualityAgent = {
  async checkGrammar(text: string): Promise<string> {
    const prompt = `Check the following text for grammatical errors and suggest corrections:\n\n${text}`;
    const { text: grammarCheckedText } = await generateText({
      model: openai('gpt-4'),
      prompt,
      maxTokens: 1000,
      temperature: 0.3,
    });
    return grammarCheckedText;
  },

  async assessReadability(text: string): Promise<string> {
    const prompt = `Assess the readability of the following text and suggest improvements:\n\n${text}`;
    const { text: readabilityAssessment } = await generateText({
      model: openai('gpt-4'),
      prompt,
      maxTokens: 1000,
      temperature: 0.3,
    });
    return readabilityAssessment;
  },
};