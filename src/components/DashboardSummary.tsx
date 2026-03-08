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
    <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-secondary/10">
            <LayoutDashboard className="w-5 h-5 text-secondary" />
          </div>
          분석 대시보드
        </CardTitle>
        <p className="text-sm text-muted-foreground">{companyName} · {positionName}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Hash className="w-4 h-4 text-muted-foreground" />
            주요 ATS 키워드
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.atsKeywords.map((keyword, idx) => (
              <Badge key={idx} className="bg-gradient-to-r from-primary/80 to-secondary/80 text-primary-foreground border-0 px-3 py-1">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 font-medium">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              경험 매칭도
            </div>
            <span className={`font-bold ${matchScore >= 70 ? 'text-success' : matchScore >= 40 ? 'text-warning' : 'text-muted-foreground'}`}>
              {matches.length > 0 ? `${matchScore}%` : '—'}
            </span>
          </div>
          <Progress value={matchScore} className="h-3" />
          {matches.length === 0 && (
            <p className="text-xs text-muted-foreground">아래에서 경험을 추가하면 매칭 점수를 확인할 수 있습니다</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ListChecks className="w-4 h-4 text-muted-foreground" />
            우선 준비 사항
          </div>
          <div className="space-y-2">
            {priorityItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-card border text-sm">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-destructive/10 text-destructive' :
                  idx === 1 ? 'bg-warning/10 text-warning' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {idx + 1}
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
