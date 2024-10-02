import { runContentGenerationAgent } from '../../src/standard-call/agents';

async function testContentGenerationAgent() {
  const topic = "Artificial Intelligence in Healthcare";

  console.log("Input:");
  console.log("Topic:", topic);

  try {
    const result = await runContentGenerationAgent(topic);

    console.log("\nOutput:");
    console.log(JSON.stringify(result, null, 2));

    // Log specific parts of the output
    console.log("\nGenerated Ideas:");
    result.ideas.forEach((idea, index) => {
      console.log(`\nIdea ${index + 1}:`);
      console.log(`Title: ${idea.title}`);
      console.log(`Description: ${idea.description}`);
      console.log(`Format: ${idea.format}`);
      console.log(`Target Audience: ${idea.targetAudience}`);
      console.log(`Estimated Length: ${idea.estimatedLength}`);
    });

    console.log("\nAdditional Suggestions:");
    console.log(result.additionalSuggestions);

  } catch (error) {
    console.error("Error:", error);
  }
}

testContentGenerationAgent();

// To run this test:
// 1. Make sure you're in the project root directory
// 2. Run the following command in your terminal:
//    npx ts-node content/tests/agentTests/content-generation.ts
