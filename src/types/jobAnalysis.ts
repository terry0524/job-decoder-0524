export interface JobPosting {
  id: string;
  companyName: string;
  positionName: string;
  rawContent: string;
  createdAt: Date;
}

export interface AnalysisResult {
  // Core sections
  jobSummary: string;
  coreResponsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  toolsAndTechnologies: string[];
  atsKeywords: string[];
  
  // Hidden insights
  hiddenCriteria: string[];
  requiredExperiences: string[];
  recruiterInsights: RecruiterInsight[];
  
  // Entry-level assessment
  entryLevelDifficulty: DifficultyAssessment;
}

export interface DifficultyAssessment {
  score: number; // 0-100
  level: 'easy' | 'moderate' | 'challenging' | 'difficult';
  factors: string[];
  recommendation: string;
}

export interface RecruiterInsight {
  category: string;
  insight: string;
}

export interface ResumeGuidance {
  motivation: string[];
  competency: string[];
  collaboration: string[];
  aspiration: string[];
}

export interface ApplicationStrategy {
  keyStrengthsToHighlight: string[];
  experiencesToPrepare: string[];
  questionsToAnticipate: string[];
  commonMistakesToAvoid: string[];
}

export interface ExperienceMatch {
  keyword: string;
  matchLevel: 'strong' | 'moderate' | 'weak';
  explanation: string;
}

export interface FullAnalysis {
  jobPosting: JobPosting;
  analysis: AnalysisResult;
  resumeGuidance: ResumeGuidance;
  applicationStrategy: ApplicationStrategy;
  experienceMatches: ExperienceMatch[];
}
