import { AnalysisResult, ExperienceMatch } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LayoutDashboard, TrendingUp, ListChecks, Hash } from 'lucide-react';

interface DashboardSummaryProps {
  analysis: AnalysisResult;
  matches: ExperienceMatch[];
  companyName: string;
  positionName: string;
}

export function DashboardSummary({ analysis, matches, companyName, positionName }: DashboardSummaryProps) {
  const matchScore = matches.length > 0 
    ? Math.round(matches.reduce((acc, m) => {
        if (m.matchLevel === 'strong') return acc + 100;
        if (m.matchLevel === 'moderate') return acc + 60;
        return acc + 25;
      }, 0) / matches.length)
    : 0;

  const priorityItems = [
    ...analysis.requiredSkills.slice(0, 2),
    ...analysis.hiddenCriteria.slice(0, 1),
    ...analysis.requiredExperiences.slice(0, 1)
  ];

  return (
    <Card className="border-secondary/20 shadow-sm shadow-secondary/5">
      <CardHeader className="pb-2.5">
        <CardTitle className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-md bg-secondary/10 flex items-center justify-center">
            <LayoutDashboard className="w-3.5 h-3.5 text-secondary" />
          </div>
          <span className="font-semibold">분석 대시보드</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{companyName} · {positionName}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Hash className="w-3.5 h-3.5" />
            주요 ATS 키워드
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.atsKeywords.slice(0, 6).map((keyword, idx) => (
              <Badge key={idx} className="bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-foreground border-0 px-2.5 py-0.5 text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5" />
              경험 매칭도
            </span>
            <span className={`font-bold text-sm ${matchScore >= 70 ? 'text-success' : matchScore >= 40 ? 'text-warning' : 'text-muted-foreground'}`}>
              {matches.length > 0 ? `${matchScore}%` : '—'}
            </span>
          </div>
          <Progress value={matchScore} className="h-2" />
          {matches.length === 0 && (
            <p className="text-[11px] text-muted-foreground">아래에서 경험을 추가하면 매칭 점수를 확인할 수 있습니다</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <ListChecks className="w-3.5 h-3.5" />
            우선 준비 사항
          </div>
          <div className="space-y-1.5">
            {priorityItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2 rounded-md bg-muted/40 text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  idx === 0 ? 'bg-destructive/10 text-destructive' :
                  idx === 1 ? 'bg-warning/10 text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {idx + 1}
                </div>
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
