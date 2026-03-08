import { AnalysisResult, ResumeGuidance, ExperienceMatch, ApplicationStrategy, DifficultyAssessment } from '@/types/jobAnalysis';

export function analyzeJobPosting(rawContent: string, companyName: string, positionName: string): AnalysisResult {
  const keywords = extractKeywords(rawContent);
  const tools = extractTools(rawContent);
  const difficulty = assessEntryLevelDifficulty(rawContent);
  
  return {
    jobSummary: `${companyName}의 ${positionName} 포지션으로, 핵심 업무는 사업 기획 및 데이터 기반 의사결정 지원입니다. 협업 능력과 빠른 환경 적응력이 요구되며, 관련 프로젝트 경험이 중요하게 평가됩니다.`,
    
    coreResponsibilities: [
      '신규 사업 기획 및 전략 수립',
      '시장 조사 및 경쟁사 분석',
      '프로젝트 일정 관리 및 협업',
      '데이터 기반 의사결정 지원'
    ],
    
    requiredSkills: [
      '관련 분야 전공 또는 동등 경력',
      '데이터 분석 도구 활용 능력',
      '문서 작성 및 프레젠테이션 역량',
      '원활한 커뮤니케이션 능력'
    ],
    
    preferredSkills: [
      '유관 산업 인턴/프로젝트 경험',
      'SQL 또는 Python 활용 경험',
      '해외 시장 리서치 경험',
      '스타트업 또는 빠른 환경 적응 경험'
    ],
    
    toolsAndTechnologies: tools,
    
    atsKeywords: keywords,
    
    hiddenCriteria: [
      '단순 참여보다 주도적 역할 경험 선호',
      '결과물보다 문제 해결 과정 중시',
      '팀 협업보다 실무 적응력 우선 평가',
      '빠른 학습 능력과 자기주도성 검증'
    ],
    
    requiredExperiences: [
      '프로젝트 리딩 또는 주도 경험',
      '데이터 기반 의사결정 경험',
      '다양한 이해관계자와의 협업 경험',
      '문제 상황 해결 사례'
    ],
    
    recruiterInsights: [
      {
        category: '경험 선호도',
        insight: '단순 참여보다 주도 경험 선호 - 본인이 기획하고 실행한 경험을 강조하세요'
      },
      {
        category: '평가 방식',
        insight: '결과보다 문제 해결 과정 검증 - 어떻게 해결했는지 과정을 상세히 서술하세요'
      },
      {
        category: '핵심 역량',
        insight: '협업보다 실무 적응력 우선 - 새로운 환경에서 빠르게 적응한 사례를 준비하세요'
      }
    ],
    
    entryLevelDifficulty: difficulty
  };
}

export function generateResumeGuidance(analysis: AnalysisResult): ResumeGuidance {
  return {
    motivation: [
      '회사의 핵심 사업과 본인의 관심 분야 연결',
      '해당 직무에서 성장하고 싶은 구체적 방향',
      '회사가 추구하는 가치와 본인의 경험 연결'
    ],
    competency: [
      '필수 역량 중 본인이 갖춘 것을 구체적 사례로 증명',
      '우대 역량이 있다면 실제 활용 경험 언급',
      '숫자나 결과물로 역량을 객관화'
    ],
    collaboration: [
      '갈등 상황에서 합의점을 찾은 경험',
      '다양한 배경의 팀원과 협업한 사례',
      '문제 상황에서 주도적으로 해결한 경험'
    ],
    aspiration: [
      '입사 후 1년 내 달성하고 싶은 구체적 목표',
      '회사에 기여할 수 있는 본인만의 강점',
      '장기적 성장 비전과 회사 방향 연결'
    ]
  };
}

export function generateApplicationStrategy(analysis: AnalysisResult): ApplicationStrategy {
  return {
    keyStrengthsToHighlight: [
      '데이터 분석 및 인사이트 도출 경험',
      '프로젝트 주도 및 실행 경험',
      '빠른 학습 능력과 적응력',
      '명확한 커뮤니케이션 역량'
    ],
    experiencesToPrepare: [
      '문제 정의부터 해결까지 주도한 프로젝트 사례',
      '데이터를 활용해 의사결정을 내린 경험',
      '새로운 환경에서 빠르게 성과를 낸 경험',
      '이해관계자 설득 및 협업 사례'
    ],
    questionsToAnticipate: [
      '가장 도전적이었던 프로젝트와 해결 과정',
      '팀에서 갈등이 있었을 때 대응 방식',
      '왜 이 직무/회사에 관심을 갖게 되었는지',
      '입사 후 어떤 기여를 할 수 있는지'
    ],
    commonMistakesToAvoid: [
      '추상적인 역량 나열 대신 구체적 사례 제시',
      '모든 역량을 다 보여주려 하지 말고 핵심에 집중',
      '회사 정보 없이 일반적인 지원동기 작성',
      '결과만 나열하지 말고 과정과 배움 강조'
    ]
  };
}

export function matchExperiences(userExperiences: string[], analysis: AnalysisResult): ExperienceMatch[] {
  return userExperiences.map(exp => {
    const lowerExp = exp.toLowerCase();
    const allKeywords = [
      ...analysis.atsKeywords,
      ...analysis.requiredSkills,
      ...analysis.preferredSkills,
      ...analysis.toolsAndTechnologies
    ].map(k => k.toLowerCase());
    
    const matchCount = allKeywords.filter(k => 
      lowerExp.includes(k) || k.includes(lowerExp)
    ).length;
    
    let matchLevel: 'strong' | 'moderate' | 'weak';
    let explanation: string;
    
    if (matchCount >= 2 || analysis.requiredExperiences.some(r => 
      r.toLowerCase().includes(lowerExp) || lowerExp.includes(r.toLowerCase())
    )) {
      matchLevel = 'strong';
      explanation = '공고의 핵심 요구사항과 직접 연결됩니다';
    } else if (matchCount >= 1 || analysis.preferredSkills.some(p => 
      p.toLowerCase().includes(lowerExp)
    )) {
      matchLevel = 'moderate';
      explanation = '우대 역량과 연결되어 보완 서술이 필요합니다';
    } else {
      matchLevel = 'weak';
      explanation = '직접적 연결이 약하므로 다른 경험으로 대체 고려';
    }
    
    return { keyword: exp, matchLevel, explanation };
  });
}

function extractKeywords(text: string): string[] {
  const commonKeywords = [
    '기획', '분석', '협업', '문제해결', '데이터', 
    '전략', '커뮤니케이션', '프로젝트', '리더십', '혁신',
    '성장', '도전', '주도', '실행', '성과'
  ];
  
  return commonKeywords.filter(keyword => 
    text.includes(keyword)
  ).slice(0, 8);
}

function extractTools(text: string): string[] {
  const tools = [
    'Excel', 'PowerPoint', 'SQL', 'Python', 'Tableau',
    'Google Analytics', 'Figma', 'Notion', 'Slack', 'Jira'
  ];
  
  const found = tools.filter(tool => 
    text.toLowerCase().includes(tool.toLowerCase())
  );
  
  // Default tools if none found
  if (found.length === 0) {
    return ['Excel', 'PowerPoint', 'SQL', 'Collaboration Tools'];
  }
  
  return found;
}

function assessEntryLevelDifficulty(text: string): DifficultyAssessment {
  const lowerText = text.toLowerCase();
  
  let score = 50; // Base score
  const factors: string[] = [];
  
  // Check for experience requirements
  if (lowerText.includes('경력') || lowerText.includes('년 이상')) {
    score += 20;
    factors.push('경력 요구사항이 명시됨');
  }
  
  // Check for technical requirements
  const techTerms = ['sql', 'python', 'java', 'api', 'database'];
  const techCount = techTerms.filter(t => lowerText.includes(t)).length;
  if (techCount >= 2) {
    score += 15;
    factors.push('다수의 기술 역량 요구');
  }
  
  // Check for leadership requirements
  if (lowerText.includes('리더십') || lowerText.includes('관리')) {
    score += 10;
    factors.push('리더십/관리 경험 필요');
  }
  
  // Check for industry experience
  if (lowerText.includes('업계 경험') || lowerText.includes('산업 경험')) {
    score += 15;
    factors.push('특정 산업 경험 선호');
  }
  
  // Positive factors for entry-level
  if (lowerText.includes('신입') || lowerText.includes('인턴')) {
    score -= 20;
    factors.push('신입/인턴 환영');
  }
  
  if (lowerText.includes('교육') || lowerText.includes('성장')) {
    score -= 10;
    factors.push('성장 가능성 중시');
  }
  
  // Clamp score
  score = Math.max(20, Math.min(95, score));
  
  let level: DifficultyAssessment['level'];
  let recommendation: string;
  
  if (score <= 35) {
    level = 'easy';
    recommendation = '신입에게 적합한 포지션입니다. 기본기와 열정을 강조하세요.';
  } else if (score <= 55) {
    level = 'moderate';
    recommendation = '적절한 난이도입니다. 관련 경험이나 프로젝트를 잘 어필하세요.';
  } else if (score <= 75) {
    level = 'challenging';
    recommendation = '도전적인 포지션입니다. 차별화된 경험과 역량을 강조하세요.';
  } else {
    level = 'difficult';
    recommendation = '경력직 성향이 강합니다. 신입으로 지원 시 특출난 역량 증명이 필요합니다.';
  }
  
  if (factors.length === 0) {
    factors.push('일반적인 신입 채용 요건');
  }
  
  return { score, level, factors, recommendation };
}
