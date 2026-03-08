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
import { ResumeImprovementSection } from '@/components/ResumeImprovementSection';
import { ReportHeader } from '@/components/ReportHeader';
import { analyzeJobPosting, generateResumeGuidance, generateApplicationStrategy, generateResumeKeywords, matchExperiences } from '@/lib/mockAnalysis';
import { calculateJdMatch, JdMatchResult } from '@/lib/jdMatch';
import { analyzeWithAI } from '@/lib/aiAnalysis';
import { useToast } from '@/hooks/use-toast';
import { FullAnalysis, ExperienceMatch } from '@/types/jobAnalysis';
import { getHistory, saveToHistory, HistoryEntry } from '@/lib/analysisHistory';
import { sampleJobDescription } from '@/lib/sampleJobDescription';
import { Button } from '@/components/ui/button';
import { FileText, RotateCcw } from 'lucide-react';
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

  const { toast } = useToast();

  const handleSubmit = useCallback(async (data: { companyName: string; positionName: string; rawContent: string; resumeText?: string }) => {
    setIsLoading(true);
    setCurrentStep(2);

    try {
      // Try real AI analysis
      const result = await analyzeWithAI(data);
      applyAnalysis(result.fullAnalysis, result.resumeKeywords, result.jdMatchResult);
      saveToHistory(result.fullAnalysis, result.resumeKeywords);
      refreshHistory();
    } catch (err: any) {
      console.error('AI analysis failed, falling back to mock:', err);
      toast({
        title: 'AI 분석 실패',
        description: '기본 분석으로 전환합니다. ' + (err?.message || ''),
        variant: 'destructive',
      });

      // Fallback to mock analysis
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
    } finally {
      setIsLoading(false);
    }
  }, [applyAnalysis, refreshHistory, toast]);

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
        <div className="container max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
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

      <main className="container max-w-5xl mx-auto px-4">
        {!analysis ? (
          <div className="max-w-2xl mx-auto pt-16 sm:pt-20 pb-24">
            {/* Hero */}
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-4">
                AI-Powered Job Analysis
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-3">
                Job Decoder
              </h1>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                AI 기반 채용공고 분석 도구
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                채용공고와 이력서를 분석하여
                필수 기술, ATS 키워드, 매칭도, 지원 전략을 확인할 수 있습니다.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-3 italic">
                JD를 읽고, 기술을 정리하고, 지원 전략까지 연결합니다.
              </p>
            </div>

            {/* How It Works */}
            <WorkflowStepper currentStep={currentStep} />

            {/* Form */}
            <JobInputForm onSubmit={handleSubmit} isLoading={isLoading} sampleData={sampleJobDescription} />

            {/* Recent Analyses */}
            <AnalysisHistory 
              history={history} 
              onSelect={handleHistorySelect} 
              onHistoryChange={refreshHistory} 
            />
          </div>
        ) : (
          <div className="py-8 space-y-0" ref={reportRef}>
            {/* Report Header with quick summary */}
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

            {/* JD Match Score — hero section */}
            {jdMatchResult && (
              <div className="mt-8 space-y-0">
                <div className="flex items-center gap-3 mb-6">
                  <Separator className="flex-1" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Resume Match</span>
                  <Separator className="flex-1" />
                </div>
                <JdMatchScoreCard result={jdMatchResult} />
                {/* Connected workflow: Missing Keywords → Improvement */}
                <div className="mt-5 rounded-xl border border-border/50 bg-card/50 p-5 space-y-0">
                  <ResumeImprovementSection result={jdMatchResult} />
                </div>
              </div>
            )}

            {/* Detailed Analysis */}
            <div className="flex items-center gap-3 mt-10 mb-6">
              <Separator className="flex-1" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">상세 분석</span>
              <Separator className="flex-1" />
            </div>

            {/* 1. 직무 요약 + 난이도 */}
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
            <div className="mt-5">
              <SkillsSection 
                requiredSkills={analysis.analysis.requiredSkills}
                preferredSkills={analysis.analysis.preferredSkills}
                toolsAndTechnologies={analysis.analysis.toolsAndTechnologies}
                responsibilities={analysis.analysis.coreResponsibilities}
              />
            </div>

            {/* 3. 지원 전략 + 대시보드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
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
            <div className="mt-5">
              <HiddenRequirementsSection 
                hiddenCriteria={analysis.analysis.hiddenCriteria}
                requiredExperiences={analysis.analysis.requiredExperiences}
                recruiterInsights={analysis.analysis.recruiterInsights}
              />
            </div>

            {/* 5. 이력서 가이드 + 키워드 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
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
        <div className="container max-w-5xl mx-auto px-4 py-8">
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
