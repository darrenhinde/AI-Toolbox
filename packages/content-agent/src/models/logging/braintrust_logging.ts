

import { invoke } from "braintrust";
import { BraintrustAdapter } from "@braintrust/vercel-ai-sdk";
import { initLogger } from "braintrust";
 

 
export async function POST(req: Request) {
    
   // In the JS SDK, `asyncFlush` is false by default.
const logger = initLogger({
    projectName: "Content creator",
    apiKey: process.env.BRAINTRUST_API_KEY,
    asyncFlush: true,
  });
   
  const stream = await invoke({
    projectName: "your project name",
    slug: "your prompt slug",
    input: await req.json(),
    stream: true,
  });
 
  return BraintrustAdapter.toAIStreamResponse(stream)
}
