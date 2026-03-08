import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult, ResumeGuidance, ApplicationStrategy, FullAnalysis } from '@/types/jobAnalysis';
import { JdMatchResult } from '@/lib/jdMatch';

interface AIAnalysisInput {
  companyName: string;
  positionName: string;
  rawContent: string;
  resumeText?: string;
}

interface AIAnalysisOutput {
  fullAnalysis: FullAnalysis;
  resumeKeywords: string[];
  jdMatchResult: JdMatchResult | null;
}

export async function analyzeWithAI(input: AIAnalysisInput): Promise<AIAnalysisOutput> {
  const { data, error } = await supabase.functions.invoke('analyze-job', {
    body: {
      jobDescription: input.rawContent,
      companyName: input.companyName,
      positionName: input.positionName,
      resumeText: input.resumeText,
    },
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || 'AI 분석 요청에 실패했습니다.');
  }

  if (data?.error) {
    throw new Error(data.message || 'AI 분석 중 오류가 발생했습니다.');
  }

  // Validate and map the response
  const analysis = validateAnalysis(data.analysis);
  const resumeGuidance = validateResumeGuidance(data.resumeGuidance);
  const applicationStrategy = validateStrategy(data.applicationStrategy);
  const resumeKeywords: string[] = Array.isArray(data.resumeKeywords) ? data.resumeKeywords : [];

  let jdMatchResult: JdMatchResult | null = null;
  if (data.jdMatch && typeof data.jdMatch.score === 'number') {
    jdMatchResult = {
      score: Math.min(100, Math.max(0, Math.round(data.jdMatch.score))),
      matchingSkills: Array.isArray(data.jdMatch.matchingSkills) ? data.jdMatch.matchingSkills : [],
      missingKeywords: Array.isArray(data.jdMatch.missingKeywords) ? data.jdMatch.missingKeywords : [],
    };
  }

  const fullAnalysis: FullAnalysis = {
    jobPosting: {
      id: crypto.randomUUID(),
      companyName: input.companyName,
      positionName: input.positionName,
      rawContent: input.rawContent,
      createdAt: new Date(),
    },
    analysis,
    resumeGuidance,
    applicationStrategy,
    experienceMatches: [],
  };

  return { fullAnalysis, resumeKeywords, jdMatchResult };
}

function validateAnalysis(raw: any): AnalysisResult {
  return {
    jobSummary: raw?.jobSummary || '직무 요약을 생성할 수 없습니다.',
    coreResponsibilities: ensureArray(raw?.coreResponsibilities),
    requiredSkills: ensureArray(raw?.requiredSkills),
    preferredSkills: ensureArray(raw?.preferredSkills),
    toolsAndTechnologies: ensureArray(raw?.toolsAndTechnologies),
    atsKeywords: ensureArray(raw?.atsKeywords),
    hiddenCriteria: ensureArray(raw?.hiddenCriteria),
    requiredExperiences: ensureArray(raw?.requiredExperiences),
    recruiterInsights: Array.isArray(raw?.recruiterInsights)
      ? raw.recruiterInsights.map((r: any) => ({
          category: r?.category || '',
          insight: r?.insight || '',
        }))
      : [],
    entryLevelDifficulty: {
      score: typeof raw?.entryLevelDifficulty?.score === 'number' ? raw.entryLevelDifficulty.score : 50,
      level: ['easy', 'moderate', 'challenging', 'difficult'].includes(raw?.entryLevelDifficulty?.level)
        ? raw.entryLevelDifficulty.level
        : 'moderate',
      factors: ensureArray(raw?.entryLevelDifficulty?.factors),
      recommendation: raw?.entryLevelDifficulty?.recommendation || '',
    },
  };
}

function validateResumeGuidance(raw: any): ResumeGuidance {
  return {
    motivation: ensureArray(raw?.motivation),
    competency: ensureArray(raw?.competency),
    collaboration: ensureArray(raw?.collaboration),
    aspiration: ensureArray(raw?.aspiration),
  };
}

function validateStrategy(raw: any): ApplicationStrategy {
  return {
    keyStrengthsToHighlight: ensureArray(raw?.keyStrengthsToHighlight),
    experiencesToPrepare: ensureArray(raw?.experiencesToPrepare),
    questionsToAnticipate: ensureArray(raw?.questionsToAnticipate),
    commonMistakesToAvoid: ensureArray(raw?.commonMistakesToAvoid),
  };
}

function ensureArray(val: any): string[] {
  if (Array.isArray(val)) return val.filter((v) => typeof v === 'string');
  return [];
}
