import { RecruiterInsight } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Lightbulb, Briefcase } from 'lucide-react';

interface HiddenRequirementsSectionProps {
  hiddenCriteria: string[];
  requiredExperiences: string[];
  recruiterInsights: RecruiterInsight[];
}

export function HiddenRequirementsSection({ hiddenCriteria, requiredExperiences, recruiterInsights }: HiddenRequirementsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Eye className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">숨겨진 요구사항</h2>
          <p className="text-xs text-muted-foreground">공고에 명시되지 않은 평가 기준</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/60">
          <CardHeader className="pb-2.5">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5 text-accent" />
              </div>
              <span className="font-semibold">암묵적 평가 기준</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {hiddenCriteria.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="mt-2 w-1 h-1 rounded-full bg-accent shrink-0" />
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-border/60">
          <CardHeader className="pb-2.5">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-md bg-success/10 flex items-center justify-center">
                <Briefcase className="w-3.5 h-3.5 text-success" />
              </div>
              <span className="font-semibold">필수 경험</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {requiredExperiences.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="mt-2 w-1 h-1 rounded-full bg-success shrink-0" />
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-accent/20 bg-accent/3 border-border/60">
        <CardHeader className="pb-2.5">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="font-semibold">채용 담당자 관점</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recruiterInsights.map((insight, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-card border border-border/50">
                <Badge variant="outline" className="text-[10px] bg-accent/8 text-accent border-accent/20 mb-2 font-semibold">
                  {insight.category}
                </Badge>
                <p className="text-xs text-foreground/80 leading-relaxed">{insight.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
