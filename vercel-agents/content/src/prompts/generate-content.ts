export function buildContentPrompt(topic: string): string {
  return `You are a content creation expert. Generate a detailed outline for creating content about the following topic:\n\n${topic}\n\nProvide a structured response including main points, subpoints, and potential angles to explore.`;
}

export function generateIdeasPrompt(subject: string): string {
  return `You are a creative brainstorming assistant. Generate a list of innovative content ideas related to the following subject:\n\n${subject}\n\nProvide a variety of ideas suitable for different content formats such as blog posts, videos, podcasts, and social media posts.`;
}

export function researchGuidancePrompt(contentTopic: string): string {
  return `You are a research specialist. Provide guidance on the best ways to research the following content topic:\n\n${contentTopic}\n\nInclude suggested sources, key areas to focus on, and potential experts to consult or cite.`;
}

export function linkedInPostPrompt(topic: string): string {
  return `You are a LinkedIn content strategist. Craft an engaging LinkedIn post about the following topic:\n\n${topic}\n\nEnsure the post is professional, informative, and encourages engagement. Include relevant hashtags and a call-to-action.`;
}

export function twitterPostPrompt(subject: string): string {
  return `You are a Twitter content creator. Compose a compelling tweet about the following subject:\n\n${subject}\n\nEnsure the tweet is concise, attention-grabbing, and within the character limit. Include relevant hashtags and consider adding a hook or question to encourage interaction.`;
}