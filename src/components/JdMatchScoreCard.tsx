import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { JdMatchResult } from '@/lib/jdMatch';

interface JdMatchScoreCardProps {
  result: JdMatchResult;
}

const priorityConfig = {
  high: { labelKo: '필수 기술', className: 'border-destructive/30 text-destructive' },
  medium: { labelKo: '우대 기술', className: 'border-warning/40 text-warning' },
  low: { labelKo: 'ATS 키워드', className: 'border-border text-muted-foreground' },
};

export function JdMatchScoreCard({ result }: JdMatchScoreCardProps) {
  const { score, scoreExplanation, matchingSkills, missingKeywordGroups, missingKeywords } = result;

  const scoreColor = score >= 70 ? 'text-success' : score >= 40 ? 'text-warning' : 'text-destructive';
  const scoreLabel = score >= 70 ? '높은 일치도' : score >= 40 ? '보통 일치도' : '낮은 일치도';
  const progressColor =
    score >= 70 ? '[&>div]:bg-success' : score >= 40 ? '[&>div]:bg-warning' : '[&>div]:bg-destructive';

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">이력서 일치도</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className={`text-5xl font-bold tabular-nums tracking-tight ${scoreColor}`}>{score}</span>
          <span className={`text-xl font-semibold ${scoreColor}`}>%</span>
          <span className="ml-1 text-sm text-muted-foreground">{scoreLabel}</span>
        </div>
        <Progress value={score} className={`mt-3 h-1.5 ${progressColor}`} />
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
          {scoreExplanation ||
            '필수 기술, 우대 기술, ATS 키워드를 가중 평균한 값입니다. 필수 기술의 비중이 가장 높습니다.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-baseline justify-between mb-2.5">
            <h3 className="text-sm font-semibold text-foreground">일치하는 역량</h3>
            <span className="text-xs text-muted-foreground">{matchingSkills.length}개</span>
          </div>
          {matchingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {matchingSkills.map((skill, idx) => (
                <Badge key={idx} variant="outline" className="text-xs font-normal border-success/30 text-success">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">일치하는 역량을 찾지 못했습니다.</p>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-2.5">
            <h3 className="text-sm font-semibold text-foreground">부족한 키워드</h3>
            <span className="text-xs text-muted-foreground">{missingKeywords.length}개</span>
          </div>
          {missingKeywordGroups && missingKeywordGroups.length > 0 ? (
            <div className="space-y-3">
              {missingKeywordGroups.map((group, gIdx) => {
                const config = priorityConfig[group.priority];
                return (
                  <div key={gIdx}>
                    <p className="text-xs text-muted-foreground mb-1.5">{config.labelKo}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.keywords.map((kw, idx) => (
                        <Badge key={idx} variant="outline" className={`text-xs font-normal ${config.className}`}>
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.map((kw, idx) => (
                <Badge key={idx} variant="outline" className="text-xs font-normal border-destructive/30 text-destructive">
                  {kw}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">부족한 키워드가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
