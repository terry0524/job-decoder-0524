import { Badge } from '@/components/ui/badge';
import { JdMatchResult } from '@/lib/jdMatch';

interface ResumeImprovementSectionProps {
  result: JdMatchResult;
}

export function ResumeImprovementSection({ result }: ResumeImprovementSectionProps) {
  const { matchingSkills, missingKeywords, resumePlacementTips } = result;

  if (missingKeywords.length === 0 && matchingSkills.length === 0) return null;

  return (
    <div className="space-y-6">
      {missingKeywords.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2.5">이력서에 추가할 키워드</p>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw, idx) => (
              <Badge key={idx} variant="outline" className="text-xs font-normal border-destructive/30 text-destructive">
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {resumePlacementTips && resumePlacementTips.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-3">키워드를 넣을 위치</p>
          <ul className="divide-y divide-border border-y border-border">
            {resumePlacementTips.map((tip, idx) => (
              <li key={idx} className="py-3">
                <p className="text-sm font-medium text-foreground">{tip.section}</p>
                <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                {tip.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tip.keywords.map((kw, kIdx) => (
                      <Badge key={kIdx} variant="outline" className="text-xs font-normal">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {matchingSkills.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2.5">앞쪽에서 강조할 역량</p>
          <div className="flex flex-wrap gap-1.5">
            {matchingSkills.map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs font-normal border-success/30 text-success">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        채용 시스템은 이력서에서 정확한 표기의 키워드를 찾습니다. 경험한 내용에 한해 위 표기를 그대로 반영하세요.
      </p>
    </div>
  );
}
