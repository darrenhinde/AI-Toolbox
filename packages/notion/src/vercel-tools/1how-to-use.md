You can use these tools :


import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { CreateDatabaseTool, QueryDatabaseTool, FindPageTool } from './vercel-tools/notion-tools';

const output = await generateText({
  model: openai("gpt-4-turbo"),
  streamText: false,
  tools: {
    createDatabase: CreateDatabaseTool,
    queryDatabase: QueryDatabaseTool,
    findPage: FindPageTool,
  },
  prompt: 'Create a notion database titled "Leads" and populate it with 5 random entries containing first name, last name, and email.',
  maxToolRoundtrips: 5,
});