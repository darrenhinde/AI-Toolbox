import { runAgent1 } from "../single-agents/content-idea-agent.js";

export async function workflow1(userInput) {
  // Step 1: Run Agent 1
  const agent1Result = await runAgent1(userInput);

  // Step 2: Process Agent 1's output or pass it to another agent/tool
  // ...

  return agent1Result;
}