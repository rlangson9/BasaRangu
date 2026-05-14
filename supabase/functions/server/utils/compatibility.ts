export interface MatchScore {
  overall: number;
  category: { score: number; reason: string; weight: number };
  location: { score: number; reason: string; weight: number };
  budget: { score: number; reason: string; weight: number };
  experience: { score: number; reason: string; weight: number };
  rating: { score: number; reason: string; weight: number };
}

export interface ScoringParams {
  userPreferences?: {
    preferredCategories: string[];
    preferredLocations: string[];
    priceRangeMin: number;
    priceRangeMax: number;
    ratingMin: number;
    experienceLevel: string;
  };
  job: {
    category: string;
    location: string;
    budget: number;
    urgency: string;
  };
  provider: {
    categories: string[];
    location: string;
    rating: number;
    experienceLevel: string;
  };
}

// Weight distribution (total 100)
const WEIGHTS = {
  category: 35,
  location: 25,
  budget: 20,
  experience: 10,
  rating: 10
};

// Categories that map well together
const RELATED_CATEGORIES: Record<string, string[]> = {
  "Plumbing": ["Repair", "Electrical"],
  "Cleaning": ["Gardening", "Moving"],
  "Electrical": ["Plumbing", "Repair"],
  "Carpentry": ["Repair", "Moving"],
  "Moving": ["Cleaning", "Delivery"],
  "Delivery": ["Moving", "Shopping"],
  "Gardening": ["Cleaning"],
  "Repair": ["Plumbing", "Carpentry", "Electrical"],
  "Painting": ["Repair"]
};

// Experience levels in order
const EXPERIENCE_LEVELS = ["Any", "1-3 years", "3-5 years", "5+ years"];

export function calculateMatchScore(params: ScoringParams): MatchScore {
  const { userPreferences, job, provider } = params;
  
  const categoryScore = calculateCategoryScore(
    job.category,
    provider.categories,
    userPreferences?.preferredCategories || []
  );

  const locationScore = calculateLocationScore(
    job.location,
    provider.location,
    userPreferences?.preferredLocations || []
  );

  const budgetScore = calculateBudgetScore(
    job.budget,
    userPreferences?.priceRangeMin || 0,
    userPreferences?.priceRangeMax || Infinity
  );

  const experienceScore = calculateExperienceScore(
    provider.experienceLevel,
    userPreferences?.experienceLevel
  );

  const ratingScore = calculateRatingScore(
    provider.rating,
    userPreferences?.ratingMin || 0
  );

  // Calculate overall score
  const overall = Math.round(
    (categoryScore.score * WEIGHTS.category) +
    (locationScore.score * WEIGHTS.location) +
    (budgetScore.score * WEIGHTS.budget) +
    (experienceScore.score * WEIGHTS.experience) +
    (ratingScore.score * WEIGHTS.rating)
  );

  return {
    overall,
    category: categoryScore,
    location: locationScore,
    budget: budgetScore,
    experience: experienceScore,
    rating: ratingScore
  };
}

function calculateCategoryScore(
  jobCategory: string,
  providerCategories: string[],
  preferredCategories: string[]
): { score: number; reason: string; weight: number } {
  let score = 0;
  let reason = "";

  if (providerCategories.includes(jobCategory)) {
    score = 100;
    reason = `Specializes in ${jobCategory}`;
  } else if (RELATED_CATEGORIES[jobCategory]?.some(cat => providerCategories.includes(cat))) {
    score = 70;
    reason = `Experienced in related categories`;
  } else {
    score = 30;
    reason = `Other categories available`;
  }

  if (preferredCategories.includes(jobCategory)) {
    score = Math.min(score + 10, 100);
    reason += " • Preferred category";
  }

  return { score: score / 100, reason, weight: WEIGHTS.category };
}

function calculateLocationScore(
  jobLocation: string,
  providerLocation: string,
  preferredLocations: string[]
): { score: number; reason: string; weight: number } {
  let score = 0;
  let reason = "";

  const jobCity = jobLocation.split(",")[0].trim();
  const providerCity = providerLocation.split(",")[0].trim();

  if (jobCity === providerCity) {
    score = 100;
    reason = `Located in ${jobCity}`;
  } else {
    score = 50;
    reason = `Serves nearby areas`;
  }

  if (preferredLocations.some(loc => loc.includes(jobCity))) {
    score = Math.min(score + 15, 100);
    reason += " • Preferred area";
  }

  return { score: score / 100, reason, weight: WEIGHTS.location };
}

function calculateBudgetScore(
  jobBudget: number,
  userMin: number,
  userMax: number
): { score: number; reason: string; weight: number } {
  let score = 0;
  let reason = "";

  if (!userMax || userMax === Infinity) {
    score = 80;
    reason = `Budget flexible`;
  } else if (jobBudget >= userMin && jobBudget <= userMax) {
    score = 100;
    reason = `Budget in range ($${userMin}-$${userMax})`;
  } else if (jobBudget > userMax) {
    const overPercent = ((jobBudget - userMax) / userMax) * 100;
    score = Math.max(60 - overPercent, 20);
    reason = `Budget slightly above range`;
  } else {
    const underPercent = ((userMin - jobBudget) / userMin) * 100;
    score = Math.max(70 - underPercent, 30);
    reason = `Budget below preferred range`;
  }

  return { score: score / 100, reason, weight: WEIGHTS.budget };
}

function calculateExperienceScore(
  providerExperience: string,
  userPreference?: string
): { score: number; reason: string; weight: number } {
  if (!userPreference || userPreference === "Any") {
    return { score: 1, reason: `${providerExperience} experience`, weight: WEIGHTS.experience };
  }

  const prefIndex = EXPERIENCE_LEVELS.indexOf(userPreference);
  const provIndex = EXPERIENCE_LEVELS.indexOf(providerExperience);

  let score = 0;
  let reason = "";

  if (provIndex >= prefIndex) {
    score = 100;
    reason = `${providerExperience} experience meets requirements`;
  } else {
    score = 50;
    reason = `${providerExperience} experience available`;
  }

  return { score: score / 100, reason, weight: WEIGHTS.experience };
}

function calculateRatingScore(
  providerRating: number,
  userMinRating: number
): { score: number; reason: string; weight: number } {
  let score = 0;
  let reason = "";

  if (providerRating >= 4.8) {
    score = 100;
    reason = `Excellent rating (${providerRating.toFixed(1)}/5.0)`;
  } else if (providerRating >= 4.5) {
    score = 90;
    reason = `Great rating (${providerRating.toFixed(1)}/5.0)`;
  } else if (providerRating >= 4.0) {
    score = 75;
    reason = `Good rating (${providerRating.toFixed(1)}/5.0)`;
  } else if (providerRating >= 3.5) {
    score = 50;
    reason = `Fair rating (${providerRating.toFixed(1)}/5.0)`;
  } else {
    score = 30;
    reason = `${providerRating.toFixed(1)}/5.0 rating`;
  }

  if (providerRating >= userMinRating) {
    score = Math.min(score + 10, 100);
  }

  return { score: score / 100, reason, weight: WEIGHTS.rating };
}

export function getMatchColor(score: number): string {
  if (score >= 80) return "#10B981"; // Emerald green
  if (score >= 60) return "#F59E0B"; // Amber
  if (score >= 40) return "#F97316"; // Orange
  return "#EF4444"; // Red
}

export function getMatchLabel(score: number): string {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Fair Match";
  return "Poor Match";
}
