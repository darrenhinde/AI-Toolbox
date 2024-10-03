import { generateText, tool } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { textEnhancementAgent } from './text-enhancement-agent';

const ContentWriterInput = z.object({
  contentPlan: z.array(z.object({
    ideaId: z.string().uuid(),
    title: z.string(),
    objectives: z.array(z.string()),
    platforms: z.array(z.enum(['LinkedIn', 'Twitter', 'Facebook', 'Instagram'])),
    keyMessages: z.array(z.string()),
    scheduledDate: z.date(),
  })),
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

const ContentDraftsOutput = z.array(ContentDraft);

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

export const contentWriter = async (input: z.infer<typeof ContentWriterInput>): Promise<z.infer<typeof ContentDraftsOutput>> => {
  const { contentPlan, styleGuidelines, templates, hooks } = input;

  const systemPrompt = `
You are a Content Writer with excellent writing skills. Your role is to craft compelling content based on the provided content plan. Follow the style guidelines and use the available templates and hooks.

Key Objectives:
- Use engaging one-liner hooks from the provided list.
- Write in a conversational tone, as if presenting on stage.
- Focus on one topic per post for clarity.
- Use parentheses for emphasis.
- End with a P.S. question to encourage engagement.
- Provide sources and citations where necessary.

You have access to the following tools:
- reword: To improve clarity while keeping the original meaning.
- rewrite: To adjust the text according to a specific style and intent.

Use the tools when necessary to enhance the content.
`;

  const userPrompt = `Content Plan: ${JSON.stringify(contentPlan)}
Style Guidelines: ${styleGuidelines}
Templates: ${templates.join(', ')}
Hooks: ${hooks.join(', ')}

Create content drafts for each item in the content plan.
`;

  // Multi-step process with tools
  const { text } = await generateText({
    model: openai('gpt-4'),
    prompt: systemPrompt + '\n' + userPrompt,
    tools: { rewordTool, rewriteTool },
    maxSteps: 5,
    maxTokens: 2000,
    temperature: 0.7,
  });

  // Parse the response and validate it against the ContentDraftsOutput schema
  const drafts = JSON.parse(text);
  const parsedDrafts = ContentDraftsOutput.parse(drafts);

  return parsedDrafts;
};