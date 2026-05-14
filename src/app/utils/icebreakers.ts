export interface IcebreakerContext {
  jobTitle?: string;
  jobCategory?: string;
  jobBudget?: number;
  jobLocation?: string;
  providerName?: string;
  providerRating?: number;
  providerExperience?: string;
  senderRole?: "user" | "provider";
  recipientRole?: "user" | "provider";
}

export interface IcebreakerPrompt {
  id: string;
  text: string;
  category: "greeting" | "availability" | "details" | "budget" | "compliment";
  priority: number;
}

// Icebreaker templates for users messaging providers
const userToProviderTemplates = [
  {
    template: "Hi {providerName}, I saw your profile and think you'd be great for my {jobCategory} job. Are you available {timeframe}?",
    category: "greeting" as const,
    priority: 10
  },
  {
    template: "Hello! I need help with {jobTitle}. Your {providerRating}+ rating caught my attention - would you be interested?",
    category: "compliment" as const,
    priority: 9
  },
  {
    template: "Hi {providerName}, I'm looking for someone to help with {jobCategory} in {jobLocation}. What's your availability this week?",
    category: "availability" as const,
    priority: 8
  },
  {
    template: "Good day! I have a {jobCategory} job available for ${jobBudget}. Would this be something you're interested in?",
    category: "budget" as const,
    priority: 7
  },
  {
    template: "Hi there! I noticed your experience in {jobCategory}. Could you tell me more about your approach to {jobTitle}?",
    category: "details" as const,
    priority: 6
  },
  {
    template: "Hello {providerName}, I need {jobCategory} services and your profile looks perfect. Can we discuss the details?",
    category: "greeting" as const,
    priority: 5
  },
  {
    template: "Hi! I'm planning a {jobCategory} project and would love to hear your thoughts on the requirements.",
    category: "details" as const,
    priority: 4
  },
  {
    template: "Hey {providerName}, your {providerExperience} experience is exactly what I'm looking for. Are you free soon?",
    category: "compliment" as const,
    priority: 3
  },
];

// Icebreaker templates for providers messaging users
const providerToUserTemplates = [
  {
    template: "Hi! I saw your {jobCategory} job posting and would love to help. I have {providerExperience} experience - are you available to chat?",
    category: "greeting" as const,
    priority: 10
  },
  {
    template: "Hello! I specialize in {jobCategory} and would be happy to assist with your {jobTitle}. What's the timeline?",
    category: "availability" as const,
    priority: 9
  },
  {
    template: "Good day! I noticed your {jobCategory} job in {jobLocation}. My rate is ${jobBudget} - would that work for you?",
    category: "budget" as const,
    priority: 8
  },
  {
    template: "Hi there! I've completed many {jobCategory} projects and have a {providerRating}+ rating. Could I help with your job?",
    category: "compliment" as const,
    priority: 7
  },
  {
    template: "Hello! Your {jobTitle} project sounds interesting. Can you share more details about what you need?",
    category: "details" as const,
    priority: 6
  },
  {
    template: "Hi! I'm available this week to help with your {jobCategory} needs. When would be a good time to start?",
    category: "availability" as const,
    priority: 5
  },
  {
    template: "Hey! I'd love to discuss your {jobCategory} job. I'm confident I can deliver great results.",
    category: "greeting" as const,
    priority: 4
  },
];

// Quick reply options
export const quickReplies = [
  { id: "yes", text: "Yes", category: "response" },
  { id: "no", text: "No", category: "response" },
  { id: "maybe", text: "Maybe", category: "response" },
  { id: "when", text: "When?", category: "question" },
  { id: "how", text: "How?", category: "question" },
  { id: "more", text: "Tell me more", category: "question" },
  { id: "price", text: "What's the price?", category: "question" },
  { id: "schedule", text: "Let's schedule", category: "action" },
];

export function generateIcebreakers(context: IcebreakerContext): IcebreakerPrompt[] {
  const templates = context.senderRole === "user" && context.recipientRole === "provider"
    ? userToProviderTemplates
    : providerToUserTemplates;

  const timeframe = getTimeframe();

  const icebreakers = templates.map((template, index) => {
    let text = template.template;

    // Replace placeholders with context values
    text = text.replace(/{providerName}/g, context.providerName || "there");
    text = text.replace(/{providerRating}/g, context.providerRating?.toFixed(1) || "great");
    text = text.replace(/{providerExperience}/g, context.providerExperience || "extensive");
    text = text.replace(/{jobTitle}/g, context.jobTitle || "project");
    text = text.replace(/{jobCategory}/g, context.jobCategory || "job");
    text = text.replace(/{jobLocation}/g, context.jobLocation || "your area");
    text = text.replace(/{jobBudget}/g, context.jobBudget?.toString() || "your budget");
    text = text.replace(/{timeframe}/g, timeframe);

    return {
      id: `icebreaker-${index}`,
      text,
      category: template.category,
      priority: template.priority
    };
  });

  // Filter and sort by priority
  return icebreakers
    .filter(prompt => shouldIncludePrompt(prompt, context))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 6);
}

function getTimeframe(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "this morning";
  if (hour < 18) return "this afternoon";
  return "this evening";
}

function shouldIncludePrompt(prompt: IcebreakerPrompt, context: IcebreakerContext): boolean {
  // Only include budget prompts if budget is available
  if (prompt.category === "budget" && !context.jobBudget) return false;
  
  // Only include rating/compliment prompts if rating is available
  if (prompt.category === "compliment" && !context.providerRating) return false;
  
  // Only include experience prompts if experience is available
  if (prompt.text.includes("{providerExperience}") && !context.providerExperience) return false;
  
  return true;
}

export function getQuickRepliesByCategory(category?: string) {
  if (category) {
    return quickReplies.filter(r => r.category === category);
  }
  return quickReplies;
}
