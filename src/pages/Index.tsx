import { useState, useCallback, useRef, useEffect } from 'react';
import { JobInputForm } from '@/components/JobInputForm';
import { ResumeGuidanceSection } from '@/components/ResumeGuidanceSection';
import { WorkflowStepper } from '@/components/WorkflowStepper';
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
import { AnalysisProgress } from '@/components/AnalysisProgress';
import { JdMatchResult } from '@/lib/jdMatch';
import { analyzeWithAI } from '@/lib/aiAnalysis';
import { FullAnalysis } from '@/types/jobAnalysis';
import { getHistory, saveToHistory, HistoryEntry } from '@/lib/analysisHistory';
import { sampleJobDescriptions } from '@/lib/sampleJobDescription';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RotateCcw, RefreshCw } from 'lucide-react';

type SubmitData = { companyName: string; positionName: string; rawContent: string; resumeText?: string };

const Index = () => {
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [resumeKeywords, setResumeKeywords] = useState<string[]>([]);
  const [jdMatchResult, setJdMatchResult] = useState<JdMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<SubmitData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const refreshHistory = useCallback(() => {
    setHistory(getHistory());
  }, []);

  const runAnalysis = useCallback(async (data: SubmitData) => {
    setLastInput(data);
    setErrorMessage(null);
    setIsLoading(true);
    setCurrentStep(2);

    try {
      const result = await analyzeWithAI(data);
      setAnalysis(result.fullAnalysis);
      setResumeKeywords(result.resumeKeywords);
      setJdMatchResult(result.jdMatchResult);
      setCurrentStep(3);
      saveToHistory(result.fullAnalysis, result.resumeKeywords, result.jdMatchResult);
      refreshHistory();
    } catch (err) {
      console.error('분석 실패:', err);
      setAnalysis(null);
      setResumeKeywords([]);
      setJdMatchResult(null);
      setCurrentStep(1);
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : '분석 요청이 처리되지 않았습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [refreshHistory]);

  const handleHistorySelect = useCallback((entry: HistoryEntry) => {
    setAnalysis(entry.analysis);
    setResumeKeywords(entry.resumeKeywords);
    setJdMatchResult(entry.jdMatchResult ?? null);
    setErrorMessage(null);
    setCurrentStep(3);
  }, []);

  const handleReset = () => {
    setAnalysis(null);
    setResumeKeywords([]);
    setJdMatchResult(null);
    setErrorMessage(null);
    setCurrentStep(1);
  };

  const a = analysis?.analysis;
  const hasAtsKeywords = !!a && a.atsKeywords.length > 0;
  const hasStrategy =
    !!analysis &&
    (analysis.applicationStrategy.keyStrengthsToHighlight.length > 0 ||
      analysis.applicationStrategy.experiencesToPrepare.length > 0 ||
      analysis.applicationStrategy.questionsToAnticipate.length > 0 ||
      analysis.applicationStrategy.commonMistakesToAvoid.length > 0);
  const hasHidden =
    !!a && (a.hiddenCriteria.length > 0 || a.requiredExperiences.length > 0 || a.recruiterInsights.length > 0);
  const hasGuidance =
    !!analysis &&
    (analysis.resumeGuidance.motivation.length > 0 ||
      analysis.resumeGuidance.competency.length > 0 ||
      analysis.resumeGuidance.collaboration.length > 0 ||
      analysis.resumeGuidance.aspiration.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">Job Decoder</span>
          {analysis && (
            <div className="flex items-center gap-1.5">
              <AnalysisActions
                analysis={analysis}
                resumeKeywords={resumeKeywords}
                reportRef={reportRef as React.RefObject<HTMLDivElement>}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                새 분석
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4">
        {!analysis ? (
          <div className="max-w-2xl mx-auto pt-12 sm:pt-16 pb-20">
            <div className="mb-10 sm:mb-12">
              <h1 className="text-[26px] sm:text-[32px] font-bold tracking-tight text-foreground leading-snug">
                채용공고를 지원 전략으로 바꿉니다.
              </h1>
              <p className="mt-3 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                채용공고의 핵심 요구사항을 정리하고, 이력서와의 차이를 확인하세요.
              </p>
            </div>

            <WorkflowStepper currentStep={currentStep} />

            {errorMessage && !isLoading && (
              <Alert variant="destructive" className="mb-5">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle className="text-sm">분석에 실패했습니다</AlertTitle>
                <AlertDescription className="text-xs leading-relaxed">
                  {errorMessage}
                  <br />
                  입력한 내용은 그대로 남아 있습니다. 잠시 후 다시 시도해 주세요.
                  {lastInput && (
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 text-xs"
                        onClick={() => runAnalysis(lastInput)}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        다시 시도
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {isLoading && <AnalysisProgress className="mb-5" />}

            <JobInputForm onSubmit={runAnalysis} isLoading={isLoading} sampleData={sampleJobDescriptions} />

            <AnalysisHistory
              history={history}
              onSelect={handleHistorySelect}
              onHistoryChange={refreshHistory}
            />
          </div>
        ) : (
          <div className="py-8 sm:py-10" ref={reportRef}>
            {/* A. 직무 요약 */}
            <ReportHeader
              companyName={analysis.jobPosting.companyName}
              positionName={analysis.jobPosting.positionName}
              summary={a!.jobSummary}
            />

            {/* B. 이력서 매칭 */}
            {jdMatchResult && (
              <section className="mt-10 pt-8 border-t border-border">
                <h2 className="text-base font-semibold text-foreground mb-5">이력서 매칭</h2>
                <JdMatchScoreCard result={jdMatchResult} />
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-4">바로 적용할 보완 포인트</h3>
                  <ResumeImprovementSection result={jdMatchResult} />
                </div>
              </section>
            )}

            {/* C. 요구 역량 */}
            <section className="mt-10 pt-8 border-t border-border">
              <SkillsSection
                requiredSkills={a!.requiredSkills}
                preferredSkills={a!.preferredSkills}
                toolsAndTechnologies={a!.toolsAndTechnologies}
                responsibilities={a!.coreResponsibilities}
              />
              {hasAtsKeywords && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-foreground">ATS 키워드</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    채용공고에서 반복되는 핵심 용어입니다. 이력서에 자연스럽게 포함하세요.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {a!.atsKeywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs font-normal">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* D. 지원 전략 */}
            {hasStrategy && (
              <section className="mt-10 pt-8 border-t border-border">
                <StrategySection strategy={analysis.applicationStrategy} />
              </section>
            )}

            {/* 보조 정보 */}
            <section className="mt-10 pt-8 border-t border-border">
              <h2 className="text-base font-semibold text-foreground mb-2">참고 정보</h2>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="difficulty">
                  <AccordionTrigger className="text-sm">지원 난이도</AccordionTrigger>
                  <AccordionContent>
                    <DifficultyScore difficulty={a!.entryLevelDifficulty} />
                  </AccordionContent>
                </AccordionItem>
                {hasHidden && (
                  <AccordionItem value="hidden">
                    <AccordionTrigger className="text-sm">공고에 드러나지 않은 요구사항</AccordionTrigger>
                    <AccordionContent>
                      <HiddenRequirementsSection
                        hiddenCriteria={a!.hiddenCriteria}
                        requiredExperiences={a!.requiredExperiences}
                        recruiterInsights={a!.recruiterInsights}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}
                {hasGuidance && (
                  <AccordionItem value="guidance">
                    <AccordionTrigger className="text-sm">자기소개서 작성 가이드</AccordionTrigger>
                    <AccordionContent>
                      <ResumeGuidanceSection guidance={analysis.resumeGuidance} />
                    </AccordionContent>
                  </AccordionItem>
                )}
                {resumeKeywords.length > 0 && (
                  <AccordionItem value="keywords">
                    <AccordionTrigger className="text-sm">이력서 추천 키워드</AccordionTrigger>
                    <AccordionContent>
                      <ResumeKeywords keywords={resumeKeywords} />
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16">
        <div className="container max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">Job Decoder</span>
          <p className="text-xs text-muted-foreground">채용공고 분석 및 지원 전략 정리 도구</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
