import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { JdMatchResult } from '@/lib/jdMatch';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';

interface JdMatchScoreCardProps {
  result: JdMatchResult;
}

export function JdMatchScoreCard({ result }: JdMatchScoreCardProps) {
  const { score, matchingSkills, missingKeywords } = result;

  const scoreColor =
    score >= 70 ? 'text-success' : score >= 40 ? 'text-warning' : 'text-destructive';
  const scoreLabel =
    score >= 70 ? '높은 일치도' : score >= 40 ? '보통 일치도' : '낮은 일치도';

  return (
    <div className="space-y-5">
      {/* Score */}
      <Card className="border-primary/15 card-highlight">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-base">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            JD Match Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-3">
            <span className={`text-5xl font-extrabold tabular-nums ${scoreColor}`}>{score}%</span>
            <span className="text-sm font-medium text-muted-foreground mb-1.5">{scoreLabel}</span>
          </div>
          <Progress value={score} className="h-2.5" />
          <p className="text-xs text-muted-foreground">
            이력서와 채용공고 간 키워드 일치도를 기반으로 산출된 점수입니다.
          </p>
        </CardContent>
      </Card>

      {/* Two-column: Matching + Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Matching */}
        <Card className="border-success/20">
          <CardHeader className="pb-2.5">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-md bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              </div>
              <div>
                <span className="font-semibold">Matching Skills</span>
                <span className="text-[10px] text-muted-foreground ml-1.5">{matchingSkills.length}개</span>
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
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">일치하는 기술이 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* Missing */}
        <Card className="border-destructive/20">
          <CardHeader className="pb-2.5">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-md bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
              </div>
              <div>
                <span className="font-semibold">Missing Keywords</span>
                <span className="text-[10px] text-muted-foreground ml-1.5">{missingKeywords.length}개</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {missingKeywords.length > 0 ? (
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
              <p className="text-xs text-muted-foreground">누락된 키워드가 없습니다!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
