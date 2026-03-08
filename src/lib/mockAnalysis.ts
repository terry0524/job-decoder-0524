import { AnalysisResult, ResumeGuidance, ExperienceMatch, ApplicationStrategy, DifficultyAssessment } from '@/types/jobAnalysis';

export function analyzeJobPosting(rawContent: string, companyName: string, positionName: string): AnalysisResult {
  const keywords = extractKeywords(rawContent);
  const tools = extractTools(rawContent);
  const difficulty = assessDifficulty(rawContent);
  const responsibilities = extractResponsibilities(rawContent);
  const requiredSkills = extractRequiredSkills(rawContent);
  const preferredSkills = extractPreferredSkills(rawContent);
  
  return {
    jobSummary: `${companyName} is hiring for a ${positionName} role. The position focuses on delivering measurable results through data-driven decision making, cross-functional collaboration, and strategic planning. Candidates should demonstrate strong analytical skills and adaptability.`,
    
    coreResponsibilities: responsibilities,
    requiredSkills,
    preferredSkills,
    toolsAndTechnologies: tools,
    atsKeywords: keywords,
    
    hiddenCriteria: [
      'Prefers hands-on leadership over passive participation',
      'Values problem-solving process over final results',
      'Prioritizes fast learners who adapt to new environments',
      'Looks for self-driven initiative and ownership'
    ],
    
    requiredExperiences: [
      'Led or owned a project end-to-end',
      'Made data-informed decisions in a real context',
      'Collaborated across teams or departments',
      'Solved a significant problem with measurable outcome'
    ],
    
    recruiterInsights: [
      {
        category: 'Experience Preference',
        insight: 'They favor candidates who led initiatives, not just participated — highlight ownership.'
      },
      {
        category: 'Evaluation Focus',
        insight: 'They verify your problem-solving process, not just outcomes — describe your approach step by step.'
      },
      {
        category: 'Core Competency',
        insight: 'Adaptability matters more than teamwork claims — share examples of thriving in new environments.'
      }
    ],
    
    entryLevelDifficulty: difficulty
  };
}

export function generateResumeGuidance(analysis: AnalysisResult): ResumeGuidance {
  return {
    motivation: [
      'Connect the company\'s core business to your personal interests',
      'Show a specific growth direction within this role',
      'Link company values to your own experiences'
    ],
    competency: [
      'Prove required skills with concrete examples and metrics',
      'Mention preferred skills with real usage context',
      'Quantify your impact with numbers or deliverables'
    ],
    collaboration: [
      'Describe resolving a conflict to reach consensus',
      'Share a cross-functional team collaboration example',
      'Highlight a time you took initiative to solve a problem'
    ],
    aspiration: [
      'Set a specific goal achievable within your first year',
      'Identify your unique strength and how it benefits the team',
      'Align your long-term vision with the company direction'
    ]
  };
}

export function generateApplicationStrategy(analysis: AnalysisResult): ApplicationStrategy {
  return {
    keyStrengthsToHighlight: [
      'Data analysis and insight generation experience',
      'Project ownership and execution track record',
      'Fast learning ability and adaptability',
      'Clear and structured communication skills'
    ],
    experiencesToPrepare: [
      'A project you led from problem definition to solution',
      'A data-driven decision you made with real impact',
      'An example of quickly delivering results in a new setting',
      'A stakeholder management or persuasion scenario'
    ],
    questionsToAnticipate: [
      'What was your most challenging project and how did you solve it?',
      'How do you handle team conflicts or disagreements?',
      'Why are you interested in this role and company?',
      'What value can you bring in your first 90 days?'
    ],
    commonMistakesToAvoid: [
      'Listing vague skills instead of concrete examples',
      'Trying to cover everything instead of focusing on strengths',
      'Writing generic motivation without company research',
      'Showing only results without explaining the process'
    ]
  };
}

export function generateResumeKeywords(analysis: AnalysisResult): string[] {
  const allKeywords = [
    ...analysis.atsKeywords,
    ...analysis.requiredSkills.slice(0, 3),
    ...analysis.toolsAndTechnologies.slice(0, 3),
  ];
  // Deduplicate
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
      explanation = 'Directly aligns with core job requirements';
    } else if (matchCount >= 1 || analysis.preferredSkills.some(p => 
      p.toLowerCase().includes(lowerExp)
    )) {
      matchLevel = 'moderate';
      explanation = 'Relates to preferred qualifications — add supporting context';
    } else {
      matchLevel = 'weak';
      explanation = 'Weak connection — consider replacing with a stronger experience';
    }
    
    return { keyword: exp, matchLevel, explanation };
  });
}

function extractKeywords(text: string): string[] {
  const keywordMap: Record<string, string[]> = {
    'Python': ['python'],
    'SQL': ['sql'],
    'Data Analysis': ['data analysis', 'analyze data', 'data-driven'],
    'Machine Learning': ['machine learning', 'ml model', 'ml'],
    'Statistics': ['statistics', 'statistical'],
    'Communication': ['communication', 'communicate'],
    'Project Management': ['project management', 'manage project'],
    'Leadership': ['leadership', 'lead', 'leading'],
    'Problem Solving': ['problem solving', 'problem-solving'],
    'Collaboration': ['collaboration', 'collaborate', 'teamwork', 'cross-functional'],
    'Strategy': ['strategy', 'strategic'],
    'Research': ['research'],
    'Planning': ['planning', 'plan'],
    'Innovation': ['innovation', 'innovative'],
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
    'Analyze large datasets to derive actionable insights': ['data', 'analysis', 'analyze', 'insight'],
    'Develop and deploy machine learning models': ['machine learning', 'model', 'ml'],
    'Optimize key performance metrics and KPIs': ['performance', 'metric', 'kpi', 'optimize'],
    'Collaborate with cross-functional teams': ['collaborate', 'cross-functional', 'team'],
    'Create reports and presentations for stakeholders': ['report', 'presentation', 'stakeholder'],
    'Design and implement data pipelines': ['pipeline', 'etl', 'data pipeline'],
    'Conduct market research and competitive analysis': ['market', 'research', 'competitive'],
    'Manage project timelines and deliverables': ['project', 'timeline', 'deliverable'],
  };
  
  const lowerText = text.toLowerCase();
  const found = Object.entries(responsibilityPatterns)
    .filter(([, triggers]) => triggers.some(t => lowerText.includes(t)))
    .map(([resp]) => resp);
  
  if (found.length < 3) {
    return [
      'Analyze data and generate business insights',
      'Collaborate with cross-functional teams',
      'Manage project timelines and deliverables',
      'Create reports and presentations'
    ];
  }
  
  return found.slice(0, 6);
}

function extractRequiredSkills(text: string): string[] {
  const skillPatterns: Record<string, string[]> = {
    'Python programming': ['python'],
    'SQL and database management': ['sql', 'database'],
    'Data analysis and visualization': ['data analysis', 'visualization', 'analyze'],
    'Machine learning fundamentals': ['machine learning', 'ml'],
    'Statistical analysis': ['statistics', 'statistical'],
    'Communication skills': ['communication'],
    'Problem-solving ability': ['problem solving', 'problem-solving'],
    'Project management': ['project management'],
  };
  
  const lowerText = text.toLowerCase();
  const found = Object.entries(skillPatterns)
    .filter(([, triggers]) => triggers.some(t => lowerText.includes(t)))
    .map(([skill]) => skill);
  
  if (found.length < 3) {
    return [
      'Relevant degree or equivalent experience',
      'Data analysis tool proficiency',
      'Strong written and verbal communication',
      'Analytical and problem-solving skills'
    ];
  }
  
  return found.slice(0, 6);
}

function extractPreferredSkills(text: string): string[] {
  const prefPatterns: Record<string, string[]> = {
    'Deep Learning experience': ['deep learning', 'neural network'],
    'A/B Testing methodology': ['a/b test', 'ab test', 'experimentation'],
    'Cloud platform experience (AWS/GCP/Azure)': ['aws', 'gcp', 'azure', 'cloud'],
    'Industry internship experience': ['intern', 'internship'],
    'International market research': ['international', 'global', 'overseas'],
    'Startup or fast-paced environment experience': ['startup', 'fast-paced'],
    'Advanced SQL or Python scripting': ['advanced sql', 'scripting'],
  };
  
  const lowerText = text.toLowerCase();
  const found = Object.entries(prefPatterns)
    .filter(([, triggers]) => triggers.some(t => lowerText.includes(t)))
    .map(([skill]) => skill);
  
  if (found.length < 2) {
    return [
      'Industry internship or project experience',
      'SQL or Python hands-on experience',
      'International or cross-market exposure',
      'Startup or fast-paced environment background'
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
    factors.push('Explicit experience requirement detected');
  }
  
  const techTerms = ['sql', 'python', 'java', 'api', 'database', 'machine learning', 'tensorflow', 'docker'];
  const techCount = techTerms.filter(t => lowerText.includes(t)).length;
  if (techCount >= 2) {
    score += 15;
    factors.push('Multiple technical skills required');
  }
  
  if (lowerText.includes('leadership') || lowerText.includes('manage') || lowerText.includes('lead a team')) {
    score += 10;
    factors.push('Leadership or management experience expected');
  }
  
  if (lowerText.includes('industry experience') || lowerText.includes('domain expertise')) {
    score += 15;
    factors.push('Specific industry experience preferred');
  }
  
  if (lowerText.includes('entry-level') || lowerText.includes('junior') || lowerText.includes('intern') || lowerText.includes('신입')) {
    score -= 20;
    factors.push('Entry-level / junior candidates welcome');
  }
  
  if (lowerText.includes('training') || lowerText.includes('mentorship') || lowerText.includes('growth')) {
    score -= 10;
    factors.push('Growth and learning opportunities emphasized');
  }
  
  score = Math.max(20, Math.min(95, score));
  
  let level: DifficultyAssessment['level'];
  let recommendation: string;
  
  if (score <= 35) {
    level = 'easy';
    recommendation = 'Entry-level friendly. Focus on fundamentals and enthusiasm.';
  } else if (score <= 55) {
    level = 'moderate';
    recommendation = 'Moderate difficulty. Highlight relevant projects and coursework.';
  } else if (score <= 75) {
    level = 'challenging';
    recommendation = 'Challenging for entry-level. Differentiate with strong portfolio work.';
  } else {
    level = 'difficult';
    recommendation = 'Senior-leaning role. Entry-level candidates need exceptional proof of skills.';
  }
  
  if (factors.length === 0) {
    factors.push('Standard entry-level requirements');
  }
  
  return { score, level, factors, recommendation };
}
