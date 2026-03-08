export interface MissingKeywordGroup {
  priority: 'high' | 'medium' | 'low';
  keywords: string[];
}

export interface JdMatchResult {
  score: number;
  scoreExplanation: string;
  matchingSkills: string[];
  missingKeywords: string[];
  missingKeywordGroups: MissingKeywordGroup[];
  resumePlacementTips: ResumePlacementTip[];
}

export interface ResumePlacementTip {
  section: string;
  description: string;
  keywords: string[];
}

export function calculateJdMatch(
  resumeText: string,
  requiredSkills: string[],
  preferredSkills: string[],
  atsKeywords: string[],
  tools: string[]
): JdMatchResult {
  const lowerResume = resumeText.toLowerCase();

  const allKeywords = [
    ...requiredSkills,
    ...preferredSkills,
    ...atsKeywords,
    ...tools,
  ];
  const unique = [...new Set(allKeywords)];

  const matching: string[] = [];
  const missing: string[] = [];

  for (const keyword of unique) {
    const lower = keyword.toLowerCase();
    const englishPart = keyword.match(/[A-Za-z][A-Za-z0-9/.\-+#]*/)?.[0]?.toLowerCase();

    const found =
      lowerResume.includes(lower) ||
      (englishPart && englishPart.length > 1 && lowerResume.includes(englishPart));

    if (found) {
      matching.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()));
  const preferredSet = new Set(preferredSkills.map(s => s.toLowerCase()));
  let totalWeight = 0;
  let matchedWeight = 0;

  for (const kw of unique) {
    const isRequired = requiredSet.has(kw.toLowerCase());
    const weight = isRequired ? 3 : 1;
    totalWeight += weight;
    if (matching.map(m => m.toLowerCase()).includes(kw.toLowerCase())) {
      matchedWeight += weight;
    }
  }

  const score = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  // Group missing keywords by priority
  const highPriority = missing.filter(k => requiredSet.has(k.toLowerCase()));
  const mediumPriority = missing.filter(k => preferredSet.has(k.toLowerCase()));
  const lowPriority = missing.filter(k => !requiredSet.has(k.toLowerCase()) && !preferredSet.has(k.toLowerCase()));

  const missingKeywordGroups: MissingKeywordGroup[] = [];
  if (highPriority.length > 0) missingKeywordGroups.push({ priority: 'high', keywords: highPriority });
  if (mediumPriority.length > 0) missingKeywordGroups.push({ priority: 'medium', keywords: mediumPriority });
  if (lowPriority.length > 0) missingKeywordGroups.push({ priority: 'low', keywords: lowPriority });

  const scoreExplanation = score >= 70
    ? '이력서가 채용공고의 핵심 요구사항과 높은 일치도를 보입니다. 필수 기술과 키워드가 대부분 포함되어 있습니다.'
    : score >= 40
    ? '이력서와 채용공고 간 보통 수준의 일치도입니다. 누락된 핵심 키워드를 추가하면 매칭도를 크게 높일 수 있습니다.'
    : '이력서에 채용공고의 핵심 키워드가 많이 누락되어 있습니다. 아래 제안을 참고하여 이력서를 보완해 주세요.';

  // Generate placement tips from missing keywords
  const resumePlacementTips: ResumePlacementTip[] = [];
  if (highPriority.length > 0) {
    resumePlacementTips.push({
      section: 'Skills Section',
      description: '기술 스택 목록에 핵심 역량으로 추가하세요',
      keywords: highPriority.slice(0, 5),
    });
  }
  if (missing.length > 0) {
    resumePlacementTips.push({
      section: 'Project Descriptions',
      description: '프로젝트 설명에서 해당 기술 사용 경험을 구체적으로 기술하세요',
      keywords: missing.slice(0, 4),
    });
    resumePlacementTips.push({
      section: 'Experience Section',
      description: '경력 사항에서 관련 업무 성과와 함께 자연스럽게 언급하세요',
      keywords: missing.slice(0, 3),
    });
  }

  return { score, scoreExplanation, matchingSkills: matching, missingKeywords: missing, missingKeywordGroups, resumePlacementTips };
}
