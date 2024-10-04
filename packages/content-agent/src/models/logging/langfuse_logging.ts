import { Langfuse } from "langfuse";
import {getModel} from "../index"

const langfuse = new Langfuse({
  secretKey: "sk-lf-30ccb53e-3604-4def-aed3-6cde2a3f578d",
  publicKey: "pk-lf-985ac6c9-5eb8-4176-8bbd-68c032eea4d9",
  baseUrl: "https://cloud.langfuse.com"
});

import { registerOTel } from "@vercel/otel";
import { LangfuseExporter } from "langfuse-vercel";
 
export function register() {
  registerOTel({
    serviceName: "langfuse-vercel-ai-nextjs-example",
    traceExporter: new LangfuseExporter(),
  });
}

import { generateObject } from 'ai';
import { z } from 'zod';

export async function generateObjectWithLogging<T>({
  prompt,
  model,
  schema,
  output = 'object',
  mode = 'auto',
  schemaName,
  schemaDescription,
  system,
  messages,
  maxTokens = 2000,
  temperature = 0.7,
  topP,
  topK,
  presencePenalty,
  frequencyPenalty,
  seed,
  maxRetries = 2,
  abortSignal,
  headers,
  experimental_telemetry,
}: {
  prompt: string;
  model: string;
  schema: z.ZodType<T>;
  output?: 'object' | 'array' | 'enum' | 'no-schema';
  mode?: 'auto' | 'json' | 'tool';
  schemaName?: string;
  schemaDescription?: string;
  system?: string;
  messages?: Array<any>; // Simplified for brevity, should be properly typed in actual implementation
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  seed?: number;
  maxRetries?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string>;
  experimental_telemetry?: {
    isEnabled?: boolean;
    recordInputs?: boolean;
    recordOutputs?: boolean;
    functionId?: string;
    metadata?: Record<string, string | number | boolean | Array<null | undefined | string | number | boolean>>;
  };
}): Promise<T> {
  const llm_model = getModel(model)
  const { object } = await generateObject({
    llm_model,
    schema,
    prompt,
    output,
    mode,
    schemaName,
    schemaDescription,
    system,
    messages,
    maxTokens,
    temperature,
    topP,
    topK,
    presencePenalty,
    frequencyPenalty,
    seed,
    maxRetries,
    abortSignal,
    headers,
    experimental_telemetry,
  });

  return object as T;
}