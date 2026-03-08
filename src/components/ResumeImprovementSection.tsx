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
        <CardTitle className="flex items-center gap-2.5 text-base">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-accent" />
          </div>
          Resume Improvement Suggestions
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          이력서를 개선하기 위한 키워드 및 강조 기술 추천입니다.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 추천 키워드 (missing → add these) */}
        {missingKeywords.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-destructive/10 flex items-center justify-center">
                <KeyRound className="w-3 h-3 text-destructive" />
              </div>
              <p className="text-xs font-bold text-foreground">추천 키워드</p>
              <span className="text-[10px] text-muted-foreground">— 이력서에 추가하세요</span>
            </div>
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
          </div>
        )}

        {/* 추천 강조 기술 (matching → highlight these) */}
        {matchingSkills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-success/10 flex items-center justify-center">
                <Star className="w-3 h-3 text-success" />
              </div>
              <p className="text-xs font-bold text-foreground">추천 강조 기술</p>
              <span className="text-[10px] text-muted-foreground">— 이력서에서 강조하세요</span>
            </div>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
