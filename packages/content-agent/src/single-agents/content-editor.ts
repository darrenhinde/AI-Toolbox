import { generateText, tool } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { languageQualityAgent } from './language-quality-agent';

const ContentEditorInput = z.object({
  contentDrafts: z.array(z.object({
    planItemId: z.string().uuid(),
    title: z.string(),
    body: z.string(),
    hook: z.string(),
    callToAction: z.string(),
    sources: z.array(z.string().url()).optional(),
    createdAt: z.date(),
  })),
  styleGuidelines: z.string(),
});

const FinalContent = z.object({
  draftId: z.string().uuid(),
  title: z.string(),
  body: z.string(),
  hook: z.string(),
  callToAction: z.string(),
  sources: z.array(z.string().url()).optional(),
  editorComments: z.array(z.string()).optional(),
  approvedAt: z.date(),
});

const FinalContentsOutput = z.array(FinalContent);

// Tools
const grammarCheckTool = tool({
  description: 'Check the text for grammatical errors and suggest corrections.',
  parameters: z.object({
    text: z.string(),
  }),
  execute: async ({ text }) => {
    return languageQualityAgent.checkGrammar(text);
  },
});

const readabilityCheckTool = tool({
  description: 'Assess the readability of the text and suggest improvements.',
  parameters: z.object({
    text: z.string(),
  }),
  execute: async ({ text }) => {
    return languageQualityAgent.assessReadability(text);
  },
});

export const contentEditor = async (input: z.infer<typeof ContentEditorInput>): Promise<z.infer<typeof FinalContentsOutput>> => {
  const { contentDrafts, styleGuidelines } = input;

  const systemPrompt = `
You are a Content Editor with a keen eye for detail. Your task is to review and refine content drafts, ensuring they meet quality standards and adhere to style guidelines.

Key Objectives:
- Check for clarity and coherence.
- Ensure grammatical accuracy.
- Verify the effectiveness of hooks and calls to action.
- Provide constructive feedback in editor comments.

You have access to the following tools:
- grammarCheck: To identify and correct grammatical errors.
- readabilityCheck: To assess and improve readability.

Use these tools as needed to enhance the content.
`;

  const userPrompt = `Content Drafts: ${JSON.stringify(contentDrafts)}
Style Guidelines: ${styleGuidelines}

Review and finalize the content drafts.
`;

  // Multi-step process with tools
  const { text } = await generateText({
    model: openai('gpt-4'),
    prompt: systemPrompt + '\n' + userPrompt,
    tools: { grammarCheckTool, readabilityCheckTool },
    maxSteps: 5,
    maxTokens: 2000,
    temperature: 0.7,
  });

  // Parse the response and validate it against the FinalContentsOutput schema
  const finalContents = JSON.parse(text);
  const parsedFinalContents = FinalContentsOutput.parse(finalContents);

  return parsedFinalContents;
};