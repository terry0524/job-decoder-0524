import { Badge } from '@/components/ui/badge';
import { KeyRound, Star, MapPin, ChevronRight } from 'lucide-react';
import { JdMatchResult } from '@/lib/jdMatch';

interface ResumeImprovementSectionProps {
  result: JdMatchResult;
}

export function ResumeImprovementSection({ result }: ResumeImprovementSectionProps) {
  const { matchingSkills, missingKeywords, resumePlacementTips } = result;

  if (missingKeywords.length === 0 && matchingSkills.length === 0) return null;

  return (
    <div className="space-y-5">
      {/* Add these keywords */}
      {missingKeywords.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-destructive" />
            <p className="text-xs font-bold text-foreground">Add these keywords</p>
            <span className="text-[10px] text-muted-foreground">이력서에 추가할 키워드</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-[11px] font-medium bg-destructive/5 border-destructive/20 text-destructive"
              >
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Where to add — placement tips */}
      {resumePlacementTips && resumePlacementTips.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <p className="text-xs font-bold text-foreground">Where to add them</p>
            <span className="text-[10px] text-muted-foreground">키워드 배치 위치</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {resumePlacementTips.map((tip, idx) => (
              <div key={idx} className="rounded-lg border border-border/40 bg-muted/20 px-3.5 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <ChevronRight className="w-3 h-3 text-primary" />
                  <p className="text-[11px] font-bold text-foreground">{tip.section}</p>
                </div>
                <p className="text-[10px] text-muted-foreground ml-4.5 mb-1.5">{tip.description}</p>
                {tip.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 ml-[18px]">
                    {tip.keywords.map((kw, kIdx) => (
                      <Badge
                        key={kIdx}
                        variant="outline"
                        className="text-[10px] font-medium bg-primary/5 border-primary/15 text-primary"
                      >
                        {kw}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Skills to Highlight */}
      {matchingSkills.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-success" />
            <p className="text-xs font-bold text-foreground">Highlight these skills</p>
            <span className="text-[10px] text-muted-foreground">강조할 기술</span>
          </div>
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
        </div>
      )}

      {/* ATS note */}
      <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
        💡 ATS는 이력서에서 정확한 키워드를 검색합니다. 위 키워드를 자연스럽게 포함시키면 서류 통과율을 높일 수 있습니다.
      </p>
    </div>
  );
}
