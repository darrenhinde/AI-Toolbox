import { createOpenAI } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { ollama } from "ollama-ai-provider";

type ModelProvider = 'ollama' | 'openai' | 'google' | 'anthropic';

interface ModelConfig {
  provider: ModelProvider;
  models: string[];
}

const modelConfigs: ModelConfig[] = [
  { provider: 'openai', models: ['gpt-4o-mini', 'gpt-4o'] },
  { provider: 'ollama', models: ['mistral:v0.3'] },
  { provider: 'google', models: ['models/gemini-1.5-pro-latest'] },
  { provider: 'anthropic', models: ['claude-3-sonnet-20240229', 'claude-3-opus-20240229'] },
];

export function getOperationalModels(): ModelConfig[] {
  return modelConfigs.filter(config => {
    switch (config.provider) {
      case 'openai':
        return !!process.env.OPENAI_API_KEY;
      case 'ollama':
        return !!process.env.OLLAMA_BASE_URL && !!process.env.OLLAMA_MODEL;
      case 'google':
        return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      case 'anthropic':
        return !!process.env.ANTHROPIC_API_KEY;
      default:
        return false;
    }
  });
}

export function getModel(specifiedModel?: string) {
  const operationalModels = getOperationalModels();

  if (operationalModels.length === 0) {
    throw new Error("No operational AI models found. Please check your environment variables.");
  }

  let selectedConfig: ModelConfig;
  let selectedModel: string;

  if (specifiedModel) {
    selectedConfig = operationalModels.find(config => 
      config.models.includes(specifiedModel) || config.provider === specifiedModel.split(':')[0]
    ) || operationalModels[0];
    selectedModel = specifiedModel;
  } else {
    // Default to OpenAI's gpt-4o-mini if available, otherwise use the first operational model
    selectedConfig = operationalModels.find(config => 
      config.provider === 'openai' && config.models.includes('gpt-4o-mini')
    ) || operationalModels[0];
    selectedModel = selectedConfig.provider === 'openai' ? 'gpt-4o-mini' : selectedConfig.models[0];
  }

  switch (selectedConfig.provider) {
    case 'openai':
      const openai = createOpenAI({
        baseURL: process.env.OPENAI_API_BASE,
        apiKey: process.env.OPENAI_API_KEY,
        organization: "",
      });
      return openai.chat(selectedModel);
    case 'ollama':
      console.log("Using Ollama model");
      return ollama(selectedModel);
    case 'google':
      return google(selectedModel);
    case 'anthropic':
      return anthropic(selectedModel);
    default:
      throw new Error(`Unsupported model provider: ${selectedConfig.provider}`);
  }
}