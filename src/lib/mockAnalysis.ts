import { AnalysisResult, ResumeGuidance, ExperienceMatch, RecruiterInsight } from '@/types/jobAnalysis';

export function analyzeJobPosting(rawContent: string, companyName: string, positionName: string): AnalysisResult {
  // 실제로는 AI API를 사용하여 분석
  // 지금은 텍스트 기반 간단한 분석 로직
  
  const keywords = extractKeywords(rawContent);
  
  return {
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
    repeatedKeywords: keywords,
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
    ]
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

export function matchExperiences(userExperiences: string[], analysis: AnalysisResult): ExperienceMatch[] {
  return userExperiences.map(exp => {
    const lowerExp = exp.toLowerCase();
    const allKeywords = [
      ...analysis.repeatedKeywords,
      ...analysis.requiredSkills,
      ...analysis.preferredSkills
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
  ).slice(0, 6);
}
