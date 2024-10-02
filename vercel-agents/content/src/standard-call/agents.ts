import { generateObject } from "ai";
import { getModel } from "../models/index.js";
import { generateIdeasPrompt } from "../prompts/generate-content.js";
import { mathTool } from "../tools/mathTool.js";
import { z } from "zod";

export async function runContentGenerationAgent(topic: string) {
  const model = getModel();

  const schema = z.object({
    ideas: z.array(
      z.object({
        title: z.string().describe("A catchy title for the content idea"),
        description: z.string().describe("A brief description of the content idea"),
        format: z.enum(["blog post", "video", "podcast", "social media post"]).describe("The suggested format for this content idea"),
        targetAudience: z.string().describe("The primary audience this content idea is aimed at"),
        estimatedLength: z.string().describe("Estimated length or duration of the content (e.g., '500 words', '5 minutes')")
      })
    ).min(3).max(10),
    additionalSuggestions: z.string().describe("Any additional suggestions or notes for content creation")
  });

  const prompt = generateIdeasPrompt(topic);

  const { object, warnings } = await generateObject({
    model,
    schema,
    prompt,
    output: "object",
    maxRetries: 3,
  });

  if (warnings && warnings.length > 0) {
    console.warn("Warnings:", warnings);
  }

  return object;
}