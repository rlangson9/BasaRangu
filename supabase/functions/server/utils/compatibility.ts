export interface MatchScore {
  overall: number;
  category: { score: number; reason: string; weight: number };
  location: { score: number; reason: string; weight: number };
  budget: { score: number; reason: string;