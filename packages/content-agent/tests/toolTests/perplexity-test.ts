import { PerplexityTool } from '../../src/tools/perplexityTool';

// Example usage

const main = async () => {
  const result = await PerplexityTool.execute({ prompt: 'What is the news today about AI, what is the most groundbreaking and what is news everyone should know about? and cite me resources showing this return cited resources in mardown format with the url' });
  console.log(result.data);
};

main().catch(console.error);

main().catch(console.error);