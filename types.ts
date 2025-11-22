export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface Problem {
  title: string;
  difficulty: Difficulty;
  topic: string;
  reason?: string; // Why it was recommended or selected for review
  highFailureRate?: boolean; // AI predicted heuristic
  acceptanceRate?: string; // Estimated
}

export interface UserStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking?: string;
  topSkills: string[];
}

export interface StudyPlan {
  stats: UserStats;
  reviewList: Problem[];
  recommendations: Problem[];
  analysis: string;
  groundingUrls?: string[]; // URLs from the search step
}

export type AppStatus = 'idle' | 'analyzing_profile' | 'generating_plan' | 'success' | 'error';
