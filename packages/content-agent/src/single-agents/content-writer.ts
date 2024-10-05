import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../models/index';
import { textEnhancementAgent } from './text-enhancement-agent';
import { generateText, tool } from 'ai';

const ContentWriterInput = z.object({
  contentPlan: z.object({
    title: z.string(),
    objective: z.string(),
    platform: z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram']),
    keyMessage: z.string(),
  }),
  styleGuideline: z.string(),
  template: z.string(),
  hook: z.string(),
});

const ContentDraft = z.object({
  title: z.string().describe('The main title of the content'),
  body: z.string().describe('The main content of the post'),
  hook: z.string().describe('An engaging opening line to capture attention'),
  callToAction: z.string().describe('A prompt encouraging user engagement or action'),
});

// Tools
const rewordTool = tool({
  description: 'Reword the given text to improve clarity while keeping the original meaning.',
  parameters: z.object({
    text: z.string(),
  }),
  execute: async ({ text }) => {
    return textEnhancementAgent.rewordText(text);
  },
});

const rewriteTool = tool({
  description: 'Rewrite the given text according to the specified style and intent.',
  parameters: z.object({
    text: z.string(),
    style: z.string(),
    intent: z.string(),
  }),
  execute: async ({ text, style, intent }) => {
    return textEnhancementAgent.rewriteText(text, style, intent);
  },
});

export const contentWriter = async (input: z.infer<typeof ContentWriterInput>): Promise<z.infer<typeof ContentDraft>> => {
  const { contentPlan, styleGuideline, template, hook } = input;
  const model = getModel();

  const prompt = `
You are a Content Writer crafting compelling content based on the provided plan. Follow the style guideline and use the template and hook.

Key Objectives:
- Use the engaging one-liner hook provided.
- Write in a conversational tone, as if presenting on stage.
- Focus on one topic for clarity.
- Use parentheses for emphasis.
- End with a P.S. question to encourage engagement.
- Provide a source or citation if necessary.

Content Plan: ${JSON.stringify(contentPlan)}
Style Guideline: ${styleGuideline}
Template: ${template}
Hook: ${hook}

Create a single content draft based on the content plan.
`;

  const { object: draft } = await generateObject({
    model,
    schema: ContentDraft,
    prompt,
    maxTokens: 1000,
    temperature: 0.7,
  });

  return draft;
};