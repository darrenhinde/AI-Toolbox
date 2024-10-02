import { z } from "zod";
import { tool } from "ai";

export const mathTool = tool({
  description: "Performs mathematical calculations.",
  parameters: z.object({
    expression: z.string().describe("Mathematical expression to evaluate."),
  }),
  execute: async ({ expression }) => {
    // Implement the calculation logic here
    // For example, using eval (Note: eval should be used with caution)
    return { result: eval(expression) };
  },
});