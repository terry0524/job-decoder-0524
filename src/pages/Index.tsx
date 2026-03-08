import { useState, useCallback } from 'react';
import { JobInputForm } from '@/components/JobInputForm';
import { AnalysisResultSection } from '@/components/AnalysisResultSection';
import { ResumeGuidanceSection } from '@/components/ResumeGuidanceSection';
import { ExperienceMatchingSection } from '@/components/ExperienceMatchingSection';
import { DashboardSummary } from '@/components/DashboardSummary';
import { analyzeJobPosting, generateResumeGuidance, matchExperiences } from '@/lib/mockAnalysis';
import { FullAnalysis, ExperienceMatch } from '@/types/jobAnalysis';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { FileText, RotateCcw } from 'lucide-react';

const Index = () => {
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [experienceMatches, setExperienceMatches] = useState<ExperienceMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(async (data: { companyName: string; positionName: string; rawContent: string }) => {
    setIsLoading(true);
    
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const analysisResult = analyzeJobPosting(data.rawContent, data.companyName, data.positionName);
    const resumeGuidance = generateResumeGuidance(analysisResult);
    
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
      experienceMatches: []
    };
    
    setAnalysis(fullAnalysis);
    setExperiences([]);
    setExperienceMatches([]);
    setIsLoading(false);
  }, []);

  const handleAddExperience = useCallback((exp: string) => {
    if (!analysis || experiences.includes(exp)) return;
    
    const newExperiences = [...experiences, exp];
    setExperiences(newExperiences);
    
    const matches = matchExperiences(newExperiences, analysis.analysis);
    setExperienceMatches(matches);
  }, [analysis, experiences]);

  const handleRemoveExperience = useCallback((index: number) => {
    if (!analysis) return;
    
    const newExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(newExperiences);
    
    const matches = matchExperiences(newExperiences, analysis.analysis);
    setExperienceMatches(matches);
  }, [analysis, experiences]);

  const handleReset = () => {
    setAnalysis(null);
    setExperiences([]);
    setExperienceMatches([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">채용공고 분석기</h1>
                <p className="text-xs text-muted-foreground">공고 해석부터 자소서 전략까지</p>
              </div>
            </div>
            {analysis && (
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                새 공고 분석
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        {!analysis ? (
          /* 입력 화면 */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">채용공고를 분석해보세요</h2>
              <p className="text-muted-foreground">
                공고를 입력하면 핵심 평가 기준과 자기소개서 방향을 알려드립니다
              </p>
            </div>
            <JobInputForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          /* 분석 결과 화면 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽: 대시보드 요약 */}
            <div className="lg:col-span-1 space-y-6">
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

            {/* 오른쪽: 상세 분석 */}
            <div className="lg:col-span-2 space-y-6">
              <AnalysisResultSection analysis={analysis.analysis} />
              
              <Separator className="my-6" />
              
              <ResumeGuidanceSection guidance={analysis.resumeGuidance} />
            </div>
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="border-t mt-12">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            채용공고 분석기 · 취업 준비의 첫 단계를 도와드립니다
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
