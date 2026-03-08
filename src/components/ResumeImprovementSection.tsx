import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, KeyRound, Star } from 'lucide-react';
import { JdMatchResult } from '@/lib/jdMatch';

interface ResumeImprovementSectionProps {
  result: JdMatchResult;
}

export function ResumeImprovementSection({ result }: ResumeImprovementSectionProps) {
  const { matchingSkills, missingKeywords } = result;

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
      <CardContent className="space-y-4">
        {/* Add these keywords */}
        {missingKeywords.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-destructive/10 flex items-center justify-center">
                <KeyRound className="w-2.5 h-2.5 text-destructive" />
              </div>
              <p className="text-xs font-bold text-foreground">Add these keywords</p>
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

        {/* Recommended Skills to Highlight */}
        {matchingSkills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-success/10 flex items-center justify-center">
                <Star className="w-2.5 h-2.5 text-success" />
              </div>
              <p className="text-xs font-bold text-foreground">Recommended Skills to Highlight</p>
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
        <p className="text-[11px] text-muted-foreground leading-relaxed pt-1 border-t border-border/30">
          이 키워드를 이력서 기술 스택이나 프로젝트 설명에 반영하면 매칭도를 높이는 데 도움이 됩니다.
        </p>
      </CardContent>
    </Card>
  );
}
