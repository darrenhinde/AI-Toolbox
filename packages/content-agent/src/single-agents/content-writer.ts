import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../models/index';
import { textEnhancementAgent } from './text-enhancement-agent';
import { generateText, tool } from 'ai';

const ContentWriterInput = z.object({
  contentPlan: z.object({
    ideaId: z.string().uuid(),
    title: z.string(),
    objectives: z.array(z.string()),
    platforms: z.array(z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram'])),
    keyMessages: z.array(z.string()),
    scheduledDate: z.date(),
  }),
  styleGuidelines: z.string(),
  templates: z.array(z.string()),
  hooks: z.array(z.string()),
});

const ContentDraft = z.object({
  planItemId: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  hook: z.string(),
  callToAction: z.string(),
  sources: z.array(z.string().url()).optional(),
  createdAt: z.date(),
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
  const { contentPlan, styleGuidelines, templates, hooks } = input;
  const model = getModel();

  const prompt = `
You are a Content Writer with excellent writing skills. Your role is to craft compelling content based on the provided content plan. Follow the style guidelines and use the available templates and hooks.

Key Objectives:
- Use engaging one-liner hooks from the provided list.
- Write in a conversational tone, as if presenting on stage.
- Focus on one topic per post for clarity.
- Use parentheses for emphasis.
- End with a P.S. question to encourage engagement.
- Provide sources and citations where necessary.

Content Plan: ${JSON.stringify(contentPlan)}
Style Guidelines: ${styleGuidelines}
Templates: ${templates.join(', ')}
Hooks: ${hooks.join(', ')}

Create a single content draft based on the content plan.
`;

  const { object: draft } = await generateObject({
    model,
    schema: ContentDraft,
    prompt,
    maxTokens: 2000,
    temperature: 0.7,
  });

  return draft;
};