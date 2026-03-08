import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { JdMatchResult } from '@/lib/jdMatch';
import { Target, CheckCircle2, AlertTriangle, Info, ChevronRight } from 'lucide-react';

interface JdMatchScoreCardProps {
  result: JdMatchResult;
}

const priorityConfig = {
  high: { label: 'High Priority', labelKo: '필수 기술', className: 'bg-destructive/8 border-destructive/20 text-destructive', dotColor: 'bg-destructive' },
  medium: { label: 'Medium Priority', labelKo: '우대 기술', className: 'bg-warning/8 border-warning/20 text-warning', dotColor: 'bg-warning' },
  low: { label: 'Low Priority', labelKo: 'ATS 키워드', className: 'bg-muted-foreground/8 border-muted-foreground/20 text-muted-foreground', dotColor: 'bg-muted-foreground' },
};

export function JdMatchScoreCard({ result }: JdMatchScoreCardProps) {
  const { score, scoreExplanation, matchingSkills, missingKeywordGroups, missingKeywords } = result;

  const scoreColor =
    score >= 70 ? 'text-success' : score >= 40 ? 'text-warning' : 'text-destructive';
  const scoreLabel =
    score >= 70 ? '높은 일치도' : score >= 40 ? '보통 일치도' : '낮은 일치도';
  const progressColor =
    score >= 70 ? '[&>div]:bg-success' : score >= 40 ? '[&>div]:bg-warning' : '[&>div]:bg-destructive';

  return (
    <div className="space-y-5">
      {/* Score Card — Hero */}
      <Card className="border-primary/20 card-highlight overflow-hidden">
        <div className="relative">
          {/* Subtle gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-80" />
          <CardHeader className="pb-2 pt-6">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">
              <Target className="w-3.5 h-3.5 text-primary" />
              JD Match Score
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            <div className="flex items-baseline gap-3">
              <span className={`text-6xl font-extrabold tabular-nums tracking-tight ${scoreColor}`}>{score}</span>
              <span className={`text-2xl font-bold ${scoreColor}`}>%</span>
              <span className="text-sm font-medium text-muted-foreground ml-1">{scoreLabel}</span>
            </div>
            <Progress value={score} className={`h-2 rounded-full ${progressColor}`} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {scoreExplanation || '이력서와 채용공고 간 필수 기술, 우대 기술, ATS 키워드의 가중치 기반 매칭도입니다. 필수 기술은 3배 가중치가 적용됩니다.'}
            </p>
          </CardContent>
        </div>
      </Card>

      {/* Two-column: Matching + Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matching Skills */}
        <Card className="border-success/15">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-success">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Matching Skills
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{matchingSkills.length}개 일치</span>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {matchingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {matchingSkills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-[11px] font-medium bg-success/5 border-success/20 text-success"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">일치하는 기술이 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* Missing Keywords — grouped by priority */}
        <Card className="border-destructive/15">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-destructive">
                <AlertTriangle className="w-3.5 h-3.5" />
                Missing Keywords
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">{missingKeywords.length}개 누락</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {missingKeywordGroups && missingKeywordGroups.length > 0 ? (
              missingKeywordGroups.map((group, gIdx) => {
                const config = priorityConfig[group.priority];
                return (
                  <div key={gIdx} className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                      <span className="text-[11px] font-bold text-foreground">{config.label}</span>
                      <span className="text-[10px] text-muted-foreground">({config.labelKo})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 ml-3.5">
                      {group.keywords.map((kw, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={`text-xs font-medium ${config.className}`}
                        >
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {missingKeywords.map((kw, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs font-medium bg-destructive/8 border-destructive/20 text-destructive"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">누락된 키워드가 없습니다! 🎉</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
