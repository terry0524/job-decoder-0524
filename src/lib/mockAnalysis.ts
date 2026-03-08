import { AnalysisResult, ResumeGuidance, ExperienceMatch, ApplicationStrategy, DifficultyAssessment } from '@/types/jobAnalysis';

export function analyzeJobPosting(rawContent: string, companyName: string, positionName: string): AnalysisResult {
  const keywords = extractKeywords(rawContent);
  const tools = extractTools(rawContent);
  const difficulty = assessDifficulty(rawContent);
  const responsibilities = extractResponsibilities(rawContent);
  const requiredSkills = extractRequiredSkills(rawContent);
  const preferredSkills = extractPreferredSkills(rawContent);
  
  return {
    jobSummary: `${companyName}에서 ${positionName} 포지션을 채용하고 있습니다. 이 역할은 데이터 기반 의사결정, 부서 간 협업, 전략적 기획을 통해 측정 가능한 성과를 달성하는 데 초점을 맞추고 있습니다. 강력한 분석 능력과 적응력이 요구됩니다.`,
    
    coreResponsibilities: responsibilities,
    requiredSkills,
    preferredSkills,
    toolsAndTechnologies: tools,
    atsKeywords: keywords,
    
    hiddenCriteria: [
      '수동적 참여보다 주도적 리더십을 선호',
      '결과보다 문제 해결 과정을 중시',
      '새로운 환경에 빠르게 적응하는 인재 우대',
      '자기주도적 업무 수행 능력 중요시'
    ],
    
    requiredExperiences: [
      '프로젝트를 처음부터 끝까지 주도한 경험',
      '데이터 기반으로 의사결정을 내린 경험',
      '다른 팀/부서와 협업한 경험',
      '측정 가능한 성과를 달성한 문제 해결 경험'
    ],
    
    recruiterInsights: [
      {
        category: '경험 선호도',
        insight: '단순 참여보다 주도적으로 이끈 경험을 선호합니다 — 오너십을 강조하세요.'
      },
      {
        category: '평가 초점',
        insight: '결과만이 아닌 문제 해결 과정을 검증합니다 — 접근 방식을 단계별로 설명하세요.'
      },
      {
        category: '핵심 역량',
        insight: '팀워크보다 적응력을 더 중시합니다 — 새로운 환경에서 성과를 낸 사례를 공유하세요.'
      }
    ],
    
    entryLevelDifficulty: difficulty
  };
}

export function generateResumeGuidance(analysis: AnalysisResult): ResumeGuidance {
  return {
    motivation: [
      '회사의 핵심 사업과 본인의 관심사를 연결하세요',
      '이 역할에서의 구체적인 성장 방향을 제시하세요',
      '회사 가치관과 본인의 경험을 연결하세요'
    ],
    competency: [
      '필수 기술을 구체적인 사례와 수치로 증명하세요',
      '우대 기술은 실제 활용 맥락과 함께 언급하세요',
      '성과를 숫자나 결과물로 정량화하세요'
    ],
    collaboration: [
      '갈등 상황을 해결하고 합의를 이끌어낸 경험을 서술하세요',
      '타 부서와의 협업 사례를 공유하세요',
      '주도적으로 문제를 해결한 경험을 강조하세요'
    ],
    aspiration: [
      '입사 후 1년 내 달성 가능한 구체적 목표를 설정하세요',
      '본인만의 차별화된 강점과 팀에 대한 기여를 제시하세요',
      '장기적 비전을 회사 방향과 일치시키세요'
    ]
  };
}

export function generateApplicationStrategy(analysis: AnalysisResult): ApplicationStrategy {
  return {
    keyStrengthsToHighlight: [
      '데이터 분석 및 인사이트 도출 경험',
      '프로젝트 주도 및 실행 경험',
      '빠른 학습 능력과 적응력',
      '명확하고 체계적인 커뮤니케이션 능력'
    ],
    experiencesToPrepare: [
      '문제 정의부터 해결까지 주도한 프로젝트',
      '데이터 기반으로 실질적 영향을 미친 의사결정',
      '새로운 환경에서 빠르게 성과를 낸 경험',
      '이해관계자 관리 또는 설득 사례'
    ],
    questionsToAnticipate: [
      '가장 어려웠던 프로젝트와 해결 방법은?',
      '팀 내 갈등이나 의견 충돌을 어떻게 해결했나요?',
      '이 역할과 회사에 관심을 가진 이유는?',
      '입사 후 90일 내 어떤 가치를 제공할 수 있나요?'
    ],
    commonMistakesToAvoid: [
      '구체적 사례 없이 모호한 역량만 나열하기',
      '강점에 집중하지 않고 모든 것을 다 다루려 하기',
      '회사 리서치 없이 일반적인 지원 동기 작성하기',
      '과정 설명 없이 결과만 제시하기'
    ]
  };
}

export function generateResumeKeywords(analysis: AnalysisResult): string[] {
  const allKeywords = [
    ...analysis.atsKeywords,
    ...analysis.requiredSkills.slice(0, 3),
    ...analysis.toolsAndTechnologies.slice(0, 3),
  ];
  return [...new Set(allKeywords)];
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
      explanation = '핵심 채용 요건과 직접적으로 일치합니다';
    } else if (matchCount >= 1 || analysis.preferredSkills.some(p => 
      p.toLowerCase().includes(lowerExp)
    )) {
      matchLevel = 'moderate';
      explanation = '우대 자격과 관련이 있습니다 — 구체적인 맥락을 추가하세요';
    } else {
      matchLevel = 'weak';
      explanation = '연관성이 낮습니다 — 더 관련성 높은 경험으로 교체를 고려하세요';
    }
    
    return { keyword: exp, matchLevel, explanation };
  });
}

function extractKeywords(text: string): string[] {
  const keywordMap: Record<string, string[]> = {
    'Python': ['python'],
    'SQL': ['sql'],
    'Data Analysis': ['data analysis', 'analyze data', 'data-driven', '데이터 분석'],
    'Machine Learning': ['machine learning', 'ml model', 'ml', '머신러닝'],
    'Statistics': ['statistics', 'statistical', '통계'],
    'Communication': ['communication', 'communicate', '커뮤니케이션'],
    'Project Management': ['project management', 'manage project', '프로젝트 관리'],
    'Leadership': ['leadership', 'lead', 'leading', '리더십'],
    'Problem Solving': ['problem solving', 'problem-solving', '문제 해결'],
    'Collaboration': ['collaboration', 'collaborate', 'teamwork', 'cross-functional', '협업'],
    'Strategy': ['strategy', 'strategic', '전략'],
    'Research': ['research', '리서치'],
    'Planning': ['planning', 'plan', '기획'],
    'Innovation': ['innovation', 'innovative', '혁신'],
    'Data Pipeline': ['data pipeline', 'pipeline', 'etl'],
  };
  
  const lowerText = text.toLowerCase();
  const found = Object.entries(keywordMap)
    .filter(([, triggers]) => triggers.some(t => lowerText.includes(t)))
    .map(([keyword]) => keyword);
  
  if (found.length < 3) {
    const defaults = ['Communication', 'Problem Solving', 'Collaboration', 'Data Analysis'];
    defaults.forEach(d => { if (!found.includes(d)) found.push(d); });
  }
  
  return found.slice(0, 10);
}

function extractTools(text: string): string[] {
  const tools = [
    'Excel', 'PowerPoint', 'SQL', 'Python', 'R', 'Tableau',
    'Google Analytics', 'Figma', 'Notion', 'Slack', 'Jira',
    'TensorFlow', 'PyTorch', 'AWS', 'GCP', 'Azure', 'Docker',
    'Git', 'Jupyter', 'Spark'
  ];
  
  const found = tools.filter(tool => 
    text.toLowerCase().includes(tool.toLowerCase())
  );
  
  return found.length > 0 ? found : ['Excel', 'SQL', 'Python', 'Collaboration Tools'];
}

function extractResponsibilities(text: string): string[] {
  const responsibilityPatterns: Record<string, string[]> = {
    '대규모 데이터셋 분석 및 인사이트 도출': ['data', 'analysis', 'analyze', 'insight', '데이터', '분석'],
    'Machine Learning 모델 개발 및 배포': ['machine learning', 'model', 'ml', '모델'],
    '핵심 성과 지표(KPI) 최적화': ['performance', 'metric', 'kpi', 'optimize', '성과', '지표'],
    '부서 간 협업 및 커뮤니케이션': ['collaborate', 'cross-functional', 'team', '협업', '팀'],
    '이해관계자를 위한 보고서 및 프레젠테이션 작성': ['report', 'presentation', 'stakeholder', '보고서'],
    'Data Pipeline 설계 및 구현': ['pipeline', 'etl', 'data pipeline', '파이프라인'],
    '시장 조사 및 경쟁 분석': ['market', 'research', 'competitive', '시장', '조사'],
    '프로젝트 일정 및 산출물 관리': ['project', 'timeline', 'deliverable', '프로젝트', '일정'],
  };
  
  const lowerText = text.toLowerCase();
  const found = Object.entries(responsibilityPatterns)
    .filter(([, triggers]) => triggers.some(t => lowerText.includes(t)))
    .map(([resp]) => resp);
  
  if (found.length < 3) {
    return [
      '데이터 분석 및 비즈니스 인사이트 도출',
      '부서 간 협업 및 커뮤니케이션',
      '프로젝트 일정 및 산출물 관리',
      '보고서 및 프레젠테이션 작성'
    ];
  }
  
  return found.slice(0, 6);
}

function extractRequiredSkills(text: string): string[] {
  const skillPatterns: Record<string, string[]> = {
    'Python 프로그래밍': ['python'],
    'SQL 및 데이터베이스 관리': ['sql', 'database', '데이터베이스'],
    '데이터 분석 및 시각화': ['data analysis', 'visualization', 'analyze', '데이터 분석', '시각화'],
    'Machine Learning 기초': ['machine learning', 'ml', '머신러닝'],
    '통계 분석': ['statistics', 'statistical', '통계'],
    '커뮤니케이션 능력': ['communication', '커뮤니케이션', '소통'],
    '문제 해결 능력': ['problem solving', 'problem-solving', '문제 해결'],
    '프로젝트 관리': ['project management', '프로젝트 관리'],
  };
  
  const lowerText = text.toLowerCase();
  const found = Object.entries(skillPatterns)
    .filter(([, triggers]) => triggers.some(t => lowerText.includes(t)))
    .map(([skill]) => skill);
  
  if (found.length < 3) {
    return [
      '관련 분야 학위 또는 동등한 경험',
      '데이터 분석 도구 활용 능력',
      '우수한 문서 및 구두 커뮤니케이션',
      '분석적 사고 및 문제 해결 능력'
    ];
  }
  
  return found.slice(0, 6);
}

function extractPreferredSkills(text: string): string[] {
  const prefPatterns: Record<string, string[]> = {
    'Deep Learning 경험': ['deep learning', 'neural network', '딥러닝'],
    'A/B Testing 방법론': ['a/b test', 'ab test', 'experimentation'],
    'Cloud 플랫폼 경험 (AWS/GCP/Azure)': ['aws', 'gcp', 'azure', 'cloud', '클라우드'],
    '인턴십 경험': ['intern', 'internship', '인턴'],
    '글로벌 시장 리서치 경험': ['international', 'global', 'overseas', '해외', '글로벌'],
    '스타트업 또는 빠른 환경 경험': ['startup', 'fast-paced', '스타트업'],
    '고급 SQL 또는 Python 스크립팅': ['advanced sql', 'scripting'],
  };
  
  const lowerText = text.toLowerCase();
  const found = Object.entries(prefPatterns)
    .filter(([, triggers]) => triggers.some(t => lowerText.includes(t)))
    .map(([skill]) => skill);
  
  if (found.length < 2) {
    return [
      '인턴십 또는 관련 프로젝트 경험',
      'SQL 또는 Python 실무 경험',
      '해외 또는 다국적 시장 경험',
      '스타트업 또는 빠른 업무 환경 경험'
    ];
  }
  
  return found.slice(0, 5);
}

function assessDifficulty(text: string): DifficultyAssessment {
  const lowerText = text.toLowerCase();
  
  let score = 50;
  const factors: string[] = [];
  
  if (lowerText.includes('years of experience') || lowerText.includes('경력') || lowerText.includes('senior')) {
    score += 20;
    factors.push('경력 요구사항이 명시되어 있음');
  }
  
  const techTerms = ['sql', 'python', 'java', 'api', 'database', 'machine learning', 'tensorflow', 'docker'];
  const techCount = techTerms.filter(t => lowerText.includes(t)).length;
  if (techCount >= 2) {
    score += 15;
    factors.push('다수의 기술 스택 요구');
  }
  
  if (lowerText.includes('leadership') || lowerText.includes('manage') || lowerText.includes('lead a team') || lowerText.includes('리더십')) {
    score += 10;
    factors.push('리더십 또는 관리 경험 요구');
  }
  
  if (lowerText.includes('industry experience') || lowerText.includes('domain expertise') || lowerText.includes('업계 경험')) {
    score += 15;
    factors.push('특정 산업 경험 요구');
  }
  
  if (lowerText.includes('entry-level') || lowerText.includes('junior') || lowerText.includes('intern') || lowerText.includes('신입')) {
    score -= 20;
    factors.push('신입/주니어 지원 가능');
  }
  
  if (lowerText.includes('training') || lowerText.includes('mentorship') || lowerText.includes('growth') || lowerText.includes('성장')) {
    score -= 10;
    factors.push('성장 및 학습 기회 강조');
  }
  
  score = Math.max(20, Math.min(95, score));
  
  let level: DifficultyAssessment['level'];
  let recommendation: string;
  
  if (score <= 35) {
    level = 'easy';
    recommendation = '신입 친화적인 포지션입니다. 기본기와 열정에 집중하세요.';
  } else if (score <= 55) {
    level = 'moderate';
    recommendation = '중간 난이도입니다. 관련 프로젝트와 수업 경험을 강조하세요.';
  } else if (score <= 75) {
    level = 'challenging';
    recommendation = '신입에게 도전적인 수준입니다. 강력한 포트폴리오로 차별화하세요.';
  } else {
    level = 'difficult';
    recommendation = '경력직 수준의 포지션입니다. 뛰어난 역량 증명이 필요합니다.';
  }
  
  if (factors.length === 0) {
    factors.push('일반적인 신입 수준의 요구사항');
  }
  
  return { score, level, factors, recommendation };
}
