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
      {/* Score Card */}
      <Card className="border-primary/15 card-highlight">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-base">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="font-bold">JD Match Score</span>
              <span className="text-xs font-normal text-muted-foreground ml-2">이력서 매칭 점수</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-3">
            <span className={`text-5xl font-extrabold tabular-nums ${scoreColor}`}>{score}%</span>
            <span className="text-sm font-medium text-muted-foreground mb-1.5">{scoreLabel}</span>
          </div>
          <Progress value={score} className={`h-2.5 ${progressColor}`} />
          {/* Score explanation */}
          <div className="flex items-start gap-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2.5">
            <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {scoreExplanation || '이력서와 채용공고 간 필수 기술, 우대 기술, ATS 키워드의 가중치 기반 매칭도입니다. 필수 기술은 3배 가중치가 적용됩니다.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Two-column: Matching + Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Matching Skills */}
        <Card className="border-success/20">
          <CardHeader className="pb-2.5">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-md bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              </div>
              <div>
                <span className="font-semibold">Matching Skills</span>
                <span className="text-[10px] text-muted-foreground ml-1.5">{matchingSkills.length}개 일치</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {matchingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {matchingSkills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs font-medium bg-success/8 border-success/20 text-success"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
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
        <Card className="border-destructive/20">
          <CardHeader className="pb-2.5">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-md bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
              </div>
              <div>
                <span className="font-semibold">Missing Keywords</span>
                <span className="text-[10px] text-muted-foreground ml-1.5">{missingKeywords.length}개 누락</span>
              </div>
            </CardTitle>
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
