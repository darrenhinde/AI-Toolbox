import { runStrategyPlannerAgent } from "../../src/single-agents/strategy-planner-agent";

//Example usage:
const input = { projectDescription: 'How to start a contracting agency and build a customer base' };
const result = await runStrategyPlannerAgent(input);
console.log(JSON.stringify(result, null, 2));
