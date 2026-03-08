import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult, ResumeGuidance, ApplicationStrategy, FullAnalysis } from '@/types/jobAnalysis';
import { JdMatchResult, MissingKeywordGroup, ResumePlacementTip } from '@/lib/jdMatch';

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

  const analysis = validateAnalysis(data.analysis);
  const resumeGuidance = validateResumeGuidance(data.resumeGuidance);
  const applicationStrategy = validateStrategy(data.applicationStrategy);
  const resumeKeywords: string[] = Array.isArray(data.resumeKeywords) ? data.resumeKeywords : [];

  let jdMatchResult: JdMatchResult | null = null;
  if (data.jdMatch && typeof data.jdMatch.score === 'number') {
    const score = Math.min(100, Math.max(0, Math.round(data.jdMatch.score)));
    const matchingSkills = Array.isArray(data.jdMatch.matchingSkills) ? data.jdMatch.matchingSkills : [];
    const missingKeywords = Array.isArray(data.jdMatch.missingKeywords) ? data.jdMatch.missingKeywords : [];

    // Build priority groups from AI response or derive from analysis
    let missingKeywordGroups: MissingKeywordGroup[] = [];
    if (Array.isArray(data.jdMatch.missingKeywordGroups)) {
      missingKeywordGroups = data.jdMatch.missingKeywordGroups
        .filter((g: any) => ['high', 'medium', 'low'].includes(g?.priority) && Array.isArray(g?.keywords))
        .map((g: any) => ({ priority: g.priority, keywords: g.keywords }));
    }
    // Fallback: derive from required/preferred skills
    if (missingKeywordGroups.length === 0 && missingKeywords.length > 0) {
      const requiredSet = new Set(analysis.requiredSkills.map(s => s.toLowerCase()));
      const preferredSet = new Set(analysis.preferredSkills.map(s => s.toLowerCase()));
      const high = missingKeywords.filter(k => requiredSet.has(k.toLowerCase()));
      const medium = missingKeywords.filter(k => preferredSet.has(k.toLowerCase()));
      const low = missingKeywords.filter(k => !requiredSet.has(k.toLowerCase()) && !preferredSet.has(k.toLowerCase()));
      if (high.length > 0) missingKeywordGroups.push({ priority: 'high', keywords: high });
      if (medium.length > 0) missingKeywordGroups.push({ priority: 'medium', keywords: medium });
      if (low.length > 0) missingKeywordGroups.push({ priority: 'low', keywords: low });
    }

    // Build placement tips from AI response or generate defaults
    let resumePlacementTips: ResumePlacementTip[] = [];
    if (Array.isArray(data.jdMatch.resumePlacementTips)) {
      resumePlacementTips = data.jdMatch.resumePlacementTips
        .filter((t: any) => t?.section && t?.description)
        .map((t: any) => ({ section: t.section, description: t.description, keywords: Array.isArray(t.keywords) ? t.keywords : [] }));
    }
    if (resumePlacementTips.length === 0 && missingKeywords.length > 0) {
      const highKws = missingKeywordGroups.find(g => g.priority === 'high')?.keywords || missingKeywords;
      resumePlacementTips = [
        { section: 'Skills Section', description: '기술 스택 목록에 핵심 역량으로 추가하세요', keywords: highKws.slice(0, 5) },
        { section: 'Project Descriptions', description: '프로젝트 설명에서 해당 기술 사용 경험을 구체적으로 기술하세요', keywords: missingKeywords.slice(0, 4) },
        { section: 'Experience Section', description: '경력 사항에서 관련 업무 성과와 함께 자연스럽게 언급하세요', keywords: missingKeywords.slice(0, 3) },
      ];
    }

    const scoreExplanation = data.jdMatch.scoreExplanation || (
      score >= 70
        ? '이력서가 채용공고의 핵심 요구사항과 높은 일치도를 보입니다. 필수 기술과 키워드가 대부분 포함되어 있습니다.'
        : score >= 40
        ? '이력서와 채용공고 간 보통 수준의 일치도입니다. 누락된 핵심 키워드를 추가하면 매칭도를 크게 높일 수 있습니다.'
        : '이력서에 채용공고의 핵심 키워드가 많이 누락되어 있습니다. 아래 제안을 참고하여 이력서를 보완해 주세요.'
    );

    jdMatchResult = {
      score,
      scoreExplanation,
      matchingSkills,
      missingKeywords,
      missingKeywordGroups,
      resumePlacementTips,
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
