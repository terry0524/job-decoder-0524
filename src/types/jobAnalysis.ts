export interface JobPosting {
  id: string;
  companyName: string;
  positionName: string;
  rawContent: string;
  createdAt: Date;
}

export interface AnalysisResult {
  coreResponsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  repeatedKeywords: string[];
  hiddenCriteria: string[];
  requiredExperiences: string[];
  recruiterInsights: RecruiterInsight[];
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

export interface ExperienceMatch {
  keyword: string;
  matchLevel: 'strong' | 'moderate' | 'weak';
  explanation: string;
}

export interface FullAnalysis {
  jobPosting: JobPosting;
  analysis: AnalysisResult;
  resumeGuidance: ResumeGuidance;
  experienceMatches: ExperienceMatch[];
}
