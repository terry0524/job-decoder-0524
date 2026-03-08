import { useState, useCallback, useRef, useEffect } from 'react';
import { JobInputForm } from '@/components/JobInputForm';
import { ResumeGuidanceSection } from '@/components/ResumeGuidanceSection';
import { ExperienceMatchingSection } from '@/components/ExperienceMatchingSection';
import { DashboardSummary } from '@/components/DashboardSummary';
import { WorkflowStepper } from '@/components/WorkflowStepper';
import { JobSummaryCard } from '@/components/JobSummaryCard';
import { SkillsSection } from '@/components/SkillsSection';
import { HiddenRequirementsSection } from '@/components/HiddenRequirementsSection';
import { DifficultyScore } from '@/components/DifficultyScore';
import { StrategySection } from '@/components/StrategySection';
import { ResumeKeywords } from '@/components/ResumeKeywords';
import { AnalysisHistory } from '@/components/AnalysisHistory';
import { AnalysisActions } from '@/components/AnalysisActions';
import { JdMatchScoreCard } from '@/components/JdMatchScoreCard';
import { analyzeJobPosting, generateResumeGuidance, generateApplicationStrategy, generateResumeKeywords, matchExperiences } from '@/lib/mockAnalysis';
import { calculateJdMatch, JdMatchResult } from '@/lib/jdMatch';
import { FullAnalysis, ExperienceMatch } from '@/types/jobAnalysis';
import { getHistory, saveToHistory, HistoryEntry } from '@/lib/analysisHistory';
import { sampleJobDescription } from '@/lib/sampleJobDescription';
import { Button } from '@/components/ui/button';
import { FileText, RotateCcw, Search, Zap, Shield } from 'lucide-react';
import { ReportHeader } from '@/components/ReportHeader';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [experienceMatches, setExperienceMatches] = useState<ExperienceMatch[]>([]);
  const [resumeKeywords, setResumeKeywords] = useState<string[]>([]);
  const [jdMatchResult, setJdMatchResult] = useState<JdMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const refreshHistory = useCallback(() => {
    setHistory(getHistory());
  }, []);

  const applyAnalysis = useCallback((fullAnalysis: FullAnalysis, keywords: string[], matchResult: JdMatchResult | null) => {
    setAnalysis(fullAnalysis);
    setResumeKeywords(keywords);
    setJdMatchResult(matchResult);
    setExperiences([]);
    setExperienceMatches([]);
    setCurrentStep(3);
  }, []);

  const handleSubmit = useCallback(async (data: { companyName: string; positionName: string; rawContent: string; resumeText?: string }) => {
    setIsLoading(true);
    setCurrentStep(2);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysisResult = analyzeJobPosting(data.rawContent, data.companyName, data.positionName);
    const resumeGuidance = generateResumeGuidance(analysisResult);
    const applicationStrategy = generateApplicationStrategy(analysisResult);
    const keywords = generateResumeKeywords(analysisResult);

    let matchResult: JdMatchResult | null = null;
    if (data.resumeText && data.resumeText.trim().length > 0) {
      matchResult = calculateJdMatch(
        data.resumeText,
        analysisResult.requiredSkills,
        analysisResult.preferredSkills,
        analysisResult.atsKeywords,
        analysisResult.toolsAndTechnologies
      );
    }
    
    const fullAnalysis: FullAnalysis = {
      jobPosting: {
        id: crypto.randomUUID(),
        companyName: data.companyName,
        positionName: data.positionName,
        rawContent: data.rawContent,
        createdAt: new Date()
      },
      analysis: analysisResult,
      resumeGuidance,
      applicationStrategy,
      experienceMatches: []
    };
    
    applyAnalysis(fullAnalysis, keywords, matchResult);
    saveToHistory(fullAnalysis, keywords);
    refreshHistory();
    setIsLoading(false);
  }, [applyAnalysis, refreshHistory]);

  const handleHistorySelect = useCallback((entry: HistoryEntry) => {
    applyAnalysis(entry.analysis, entry.resumeKeywords, null);
  }, [applyAnalysis]);

  const handleAddExperience = useCallback((exp: string) => {
    if (!analysis || experiences.includes(exp)) return;
    const newExperiences = [...experiences, exp];
    setExperiences(newExperiences);
    setExperienceMatches(matchExperiences(newExperiences, analysis.analysis));
  }, [analysis, experiences]);

  const handleRemoveExperience = useCallback((index: number) => {
    if (!analysis) return;
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
    setExperienceMatches(matchExperiences(newExperiences, analysis.analysis));
  }, [analysis, experiences]);

  const handleReset = () => {
    setAnalysis(null);
    setExperiences([]);
    setExperienceMatches([]);
    setResumeKeywords([]);
    setJdMatchResult(null);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight">Job Decoder</span>
          </div>
          {analysis && (
            <div className="flex items-center gap-2">
              <AnalysisActions 
                analysis={analysis} 
                resumeKeywords={resumeKeywords} 
                reportRef={reportRef as React.RefObject<HTMLDivElement>} 
              />
              <Separator orientation="vertical" className="h-5 mx-1" />
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8">
                <RotateCcw className="w-3.5 h-3.5" />
                새 분석
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4">
        {!analysis ? (
          <div className="max-w-2xl mx-auto pt-16 pb-20">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/12 text-primary text-xs font-semibold mb-5">
                <Zap className="w-3.5 h-3.5" />
                AI 기반 채용공고 분석 도구
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 text-foreground">
                Job Decoder
              </h1>
              <p className="text-sm sm:text-base font-medium text-muted-foreground max-w-md mx-auto mb-1">
                채용공고를 분석하여 필수 기술, ATS 키워드, 지원 전략을 자동으로 도출합니다.
              </p>
              <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto">
                채용공고를 붙여넣으면 몇 초 안에 전문 분석 리포트를 받아보세요.
              </p>
              <div className="flex items-center justify-center gap-5 mt-8 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60">
                  <Search className="w-3.5 h-3.5 text-primary" /> 기술 추출
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60">
                  <Shield className="w-3.5 h-3.5 text-secondary" /> ATS 분석
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60">
                  <Zap className="w-3.5 h-3.5 text-accent" /> 전략 생성
                </span>
              </div>
            </div>

            {/* Workflow Steps */}
            <WorkflowStepper currentStep={currentStep} />

            {/* Form */}
            <JobInputForm onSubmit={handleSubmit} isLoading={isLoading} sampleData={sampleJobDescription} />

            {/* History */}
            <AnalysisHistory 
              history={history} 
              onSelect={handleHistorySelect} 
              onHistoryChange={refreshHistory} 
            />
          </div>
        ) : (
          <div className="py-10 space-y-8" ref={reportRef}>
            {/* Report Header */}
            <ReportHeader
              companyName={analysis.jobPosting.companyName}
              positionName={analysis.jobPosting.positionName}
              topSkills={analysis.analysis.requiredSkills.slice(0, 3)}
              difficulty={
                analysis.analysis.entryLevelDifficulty.level === 'easy' ? 'Entry-Level' :
                analysis.analysis.entryLevelDifficulty.level === 'moderate' ? 'Mid-Level' :
                analysis.analysis.entryLevelDifficulty.level === 'challenging' ? 'Senior-Level' : 'Expert-Level'
              }
              summary={analysis.analysis.jobSummary}
            />

            {/* JD Match Score (shown above the analysis if resume was provided) */}
            {jdMatchResult && (
              <>
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">이력서 매칭</span>
                  <Separator className="flex-1" />
                </div>
                <JdMatchScoreCard result={jdMatchResult} />
              </>
            )}

            {/* Section divider */}
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">상세 분석</span>
              <Separator className="flex-1" />
            </div>

            {/* 1. 채용공고 요약 + 난이도 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <JobSummaryCard 
                  companyName={analysis.jobPosting.companyName}
                  positionName={analysis.jobPosting.positionName}
                  summary={analysis.analysis.jobSummary}
                  atsKeywords={analysis.analysis.atsKeywords}
                />
              </div>
              <div>
                <DifficultyScore difficulty={analysis.analysis.entryLevelDifficulty} />
              </div>
            </div>

            {/* 2. 필수/우대 기술 + 주요 업무 */}
            <SkillsSection 
              requiredSkills={analysis.analysis.requiredSkills}
              preferredSkills={analysis.analysis.preferredSkills}
              toolsAndTechnologies={analysis.analysis.toolsAndTechnologies}
              responsibilities={analysis.analysis.coreResponsibilities}
            />

            {/* 3. 지원 전략 + 대시보드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <StrategySection strategy={analysis.applicationStrategy} />
              </div>
              <div className="space-y-5">
                <DashboardSummary 
                  analysis={analysis.analysis}
                  matches={experienceMatches}
                  companyName={analysis.jobPosting.companyName}
                  positionName={analysis.jobPosting.positionName}
                />
                <ExperienceMatchingSection
                  matches={experienceMatches}
                  onAddExperience={handleAddExperience}
                  onRemoveExperience={handleRemoveExperience}
                />
              </div>
            </div>

            {/* 4. 숨겨진 요구사항 */}
            <HiddenRequirementsSection 
              hiddenCriteria={analysis.analysis.hiddenCriteria}
              requiredExperiences={analysis.analysis.requiredExperiences}
              recruiterInsights={analysis.analysis.recruiterInsights}
            />

            {/* 5. 이력서 가이드 + 키워드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <ResumeGuidanceSection guidance={analysis.resumeGuidance} />
              </div>
              <div>
                <ResumeKeywords keywords={resumeKeywords} />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 mt-20">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <FileText className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold">Job Decoder</span>
            </div>
            <p className="text-xs text-muted-foreground">
              AI 기반 채용공고 분석 및 지원 전략 도구
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
