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
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { FileText, RotateCcw, BookOpen } from 'lucide-react';

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

  const handleLoadSample = useCallback(() => {
    // This is handled by passing to form - we expose sample data
    return sampleJobDescription;
  }, []);

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
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Job Decoder</h1>
                <p className="text-xs text-muted-foreground">분석 · 전략 · 지원</p>
              </div>
            </div>
            {analysis && (
              <div className="flex items-center gap-2">
                <AnalysisActions 
                  analysis={analysis} 
                  resumeKeywords={resumeKeywords} 
                  reportRef={reportRef as React.RefObject<HTMLDivElement>} 
                />
                <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  새 분석
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <WorkflowStepper currentStep={currentStep} />

        {!analysis ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">채용공고를 분석해 보세요</h2>
              <p className="text-muted-foreground">
                채용공고를 붙여넣으면 핵심 요구사항, 기술 스택, 지원 전략을 자동으로 분석합니다.
              </p>
            </div>
            <JobInputForm onSubmit={handleSubmit} isLoading={isLoading} sampleData={sampleJobDescription} />
            <AnalysisHistory 
              history={history} 
              onSelect={handleHistorySelect} 
              onHistoryChange={refreshHistory} 
            />
          </div>
        ) : (
          <div className="space-y-8" ref={reportRef}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

            <Separator />

            <SkillsSection 
              requiredSkills={analysis.analysis.requiredSkills}
              preferredSkills={analysis.analysis.preferredSkills}
              toolsAndTechnologies={analysis.analysis.toolsAndTechnologies}
              responsibilities={analysis.analysis.coreResponsibilities}
            />

            <Separator />

            <HiddenRequirementsSection 
              hiddenCriteria={analysis.analysis.hiddenCriteria}
              requiredExperiences={analysis.analysis.requiredExperiences}
              recruiterInsights={analysis.analysis.recruiterInsights}
            />

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StrategySection strategy={analysis.applicationStrategy} />
              </div>
              <div className="space-y-6">
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

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      <footer className="border-t mt-12">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Job Decoder — AI 기반 채용공고 분석 및 지원 전략 도구
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
