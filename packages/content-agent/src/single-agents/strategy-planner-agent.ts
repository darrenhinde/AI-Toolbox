import { z } from 'zod';
import { generateObject } from 'ai';
import { getModel } from '../models/index.js';
import { openai } from '@ai-sdk/openai';

// Define the input schema
const StrategyPlannerInput = z.object({
  projectDescription: z.string().describe('A detailed description of the project or task to be planned'),
});

// Define the output schema
const StrategyPlannerOutput = z.object({
  plan: z.array(z.object({
    section: z.string().describe('Name of the high-level section'),
    objectives: z.array(z.string()).describe('Key objectives for this section'),
    tasks: z.array(z.object({
      description: z.string().describe('Description of the task'),
      assignedTo: z.string().describe('Type of person or role best suited for this task'),
      taskInputObject: z.object({}).describe('Object containing any additional input needed for the task'),
      taskOutputObject: z.object({}).describe('Object containing any additional input needed for the task'),
    })),
  })),
  error: z.string().optional().describe('Error message if the task is impossible to plan'),
});

// Define the type for the output
type StrategyPlanOutput = z.infer<typeof StrategyPlannerOutput>;

/**
 * Generates a strategic plan based on the given project description.
 * @param input An object containing the project description
 * @returns A strategic plan or an error message
 */
export async function runStrategyPlannerAgent(input: z.infer<typeof StrategyPlannerInput>): Promise<StrategyPlanOutput> {
  const model = getModel();

  const prompt = `
  As an expert strategy planner, your task is to create a comprehensive plan for the following project:

  ${input.projectDescription}

  Break down the project into high-level sections, define key objectives for each section, and specify tasks with the type of person best suited to complete them. If the project seems impossible to plan, provide an error message explaining why.

  Respond with a JSON object containing an array called 'plan' with the structure as defined in the StrategyPlannerOutput schema. If the task is impossible, include an 'error' field with an explanation.
  `;

  try {
    const { object, warnings } = await generateObject<StrategyPlanOutput>({
      model,
      schema: StrategyPlannerOutput,
      prompt,
      output: 'object',
      maxRetries: 3,
    });

    if (warnings && warnings.length > 0) {
      console.warn('Warnings:', warnings);
    }

    return object;
  } catch (error) {
    console.error('Error in strategy planning:', error);
    return {
      plan: [],
      error: 'Failed to generate a strategy plan due to an unexpected error.',
    };
  }
}

// Example usage:
// const input = { projectDescription: 'Create a marketing campaign for a new eco-friendly product line' };
// const result = await runStrategyPlannerAgent(input);
// console.log(JSON.stringify(result, null, 2));

