import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, KeyRound, Star, MapPin, ChevronRight } from 'lucide-react';
import { JdMatchResult } from '@/lib/jdMatch';

interface ResumeImprovementSectionProps {
  result: JdMatchResult;
}

export function ResumeImprovementSection({ result }: ResumeImprovementSectionProps) {
  const { matchingSkills, missingKeywords, resumePlacementTips } = result;

  if (missingKeywords.length === 0 && matchingSkills.length === 0) return null;

  return (
    <Card className="border-accent/15 card-elevated">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-sm">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-accent" />
          </div>
          <div>
            <span className="font-bold">Resume Improvement Suggestions</span>
            <span className="text-xs font-normal text-muted-foreground ml-2">이력서 개선 제안</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Add these keywords */}
        {missingKeywords.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-destructive/10 flex items-center justify-center">
                <KeyRound className="w-2.5 h-2.5 text-destructive" />
              </div>
              <p className="text-xs font-bold text-foreground">Add these keywords</p>
              <span className="text-[10px] text-muted-foreground">이력서에 추가할 키워드</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.map((kw, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs font-medium bg-destructive/5 border-destructive/20 text-destructive"
                >
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Where to add — placement tips */}
        {resumePlacementTips && resumePlacementTips.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                <MapPin className="w-2.5 h-2.5 text-primary" />
              </div>
              <p className="text-xs font-bold text-foreground">Where to add them</p>
              <span className="text-[10px] text-muted-foreground">키워드 배치 위치</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {resumePlacementTips.map((tip, idx) => (
                <div key={idx} className="rounded-lg border border-border/40 bg-muted/30 px-3.5 py-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ChevronRight className="w-3 h-3 text-primary" />
                    <p className="text-[11px] font-bold text-foreground">{tip.section}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2 ml-4">{tip.description}</p>
                  {tip.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 ml-4">
                      {tip.keywords.map((kw, kIdx) => (
                        <Badge
                          key={kIdx}
                          variant="outline"
                          className="text-[10px] font-medium bg-primary/5 border-primary/20 text-primary"
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
          <div className="space-y-2 pt-3 border-t border-border/30">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-success/10 flex items-center justify-center">
                <Star className="w-2.5 h-2.5 text-success" />
              </div>
              <p className="text-xs font-bold text-foreground">Recommended Skills to Highlight</p>
              <span className="text-[10px] text-muted-foreground">강조할 기술</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchingSkills.map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs font-medium bg-success/5 border-success/20 text-success"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Guidance */}
        <p className="text-[11px] text-muted-foreground leading-relaxed pt-2 border-t border-border/30">
          💡 ATS(지원자 추적 시스템)는 이력서에서 정확한 키워드를 검색합니다. 위 키워드를 자연스럽게 이력서에 포함시키면 서류 통과율을 높일 수 있습니다.
        </p>
      </CardContent>
    </Card>
  );
}
