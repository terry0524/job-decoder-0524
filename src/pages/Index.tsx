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
import { analyzeJobPosting, generateResumeGuidance, generateApplicationStrategy, generateResumeKeywords, matchExperiences } from '@/lib/mockAnalysis';
import { FullAnalysis, ExperienceMatch } from '@/types/jobAnalysis';
import { getHistory, saveToHistory, HistoryEntry } from '@/lib/analysisHistory';
import { sampleJobDescription } from '@/lib/sampleJobDescription';
import { Button } from '@/components/ui/button';
import { FileText, RotateCcw, Search, Zap, Shield } from 'lucide-react';
import { ReportHeader } from '@/components/ReportHeader';

const Index = () => {
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [experienceMatches, setExperienceMatches] = useState<ExperienceMatch[]>([]);
  const [resumeKeywords, setResumeKeywords] = useState<string[]>([]);
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

  const applyAnalysis = useCallback((fullAnalysis: FullAnalysis, keywords: string[]) => {
    setAnalysis(fullAnalysis);
    setResumeKeywords(keywords);
    setExperiences([]);
    setExperienceMatches([]);
    setCurrentStep(3);
  }, []);

  const handleSubmit = useCallback(async (data: { companyName: string; positionName: string; rawContent: string }) => {
    setIsLoading(true);
    setCurrentStep(2);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysisResult = analyzeJobPosting(data.rawContent, data.companyName, data.positionName);
    const resumeGuidance = generateResumeGuidance(analysisResult);
    const applicationStrategy = generateApplicationStrategy(analysisResult);
    const keywords = generateResumeKeywords(analysisResult);
    
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
    
    applyAnalysis(fullAnalysis, keywords);
    saveToHistory(fullAnalysis, keywords);
    refreshHistory();
    setIsLoading(false);
  }, [applyAnalysis, refreshHistory]);

  const handleHistorySelect = useCallback((entry: HistoryEntry) => {
    applyAnalysis(entry.analysis, entry.resumeKeywords);
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
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Job Decoder</span>
          </div>
          {analysis && (
            <div className="flex items-center gap-2">
              <AnalysisActions 
                analysis={analysis} 
                resumeKeywords={resumeKeywords} 
                reportRef={reportRef as React.RefObject<HTMLDivElement>} 
              />
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-muted-foreground hover:text-foreground">
                <RotateCcw className="w-3.5 h-3.5" />
                새 분석
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4">
        {!analysis ? (
          <div className="max-w-2xl mx-auto pt-12 pb-16">
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-5">
                <Zap className="w-3.5 h-3.5" />
                AI 기반 채용공고 분석
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text">
                Job Decoder
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                채용공고를 분석하여 필요한 기술과 지원 전략을 알려주는 도구
              </p>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Search className="w-4 h-4" /> 기술 추출</span>
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> ATS 분석</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> 전략 생성</span>
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
          <div className="py-8 space-y-10" ref={reportRef}>
            {/* Result Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">분석 결과</p>
                <h2 className="text-2xl font-bold tracking-tight">
                  {analysis.jobPosting.companyName} · {analysis.jobPosting.positionName}
                </h2>
              </div>
            </div>

            {/* Summary + Difficulty */}
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

            {/* Skills — highlighted */}
            <SkillsSection 
              requiredSkills={analysis.analysis.requiredSkills}
              preferredSkills={analysis.analysis.preferredSkills}
              toolsAndTechnologies={analysis.analysis.toolsAndTechnologies}
              responsibilities={analysis.analysis.coreResponsibilities}
            />

            {/* Hidden Requirements */}
            <HiddenRequirementsSection 
              hiddenCriteria={analysis.analysis.hiddenCriteria}
              requiredExperiences={analysis.analysis.requiredExperiences}
              recruiterInsights={analysis.analysis.recruiterInsights}
            />

            {/* Strategy + Dashboard */}
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

            {/* Resume Guidance + Keywords */}
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

      <footer className="border-t border-border/50 mt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold">Job Decoder</span>
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
