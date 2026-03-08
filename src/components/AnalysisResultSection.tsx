import { AnalysisResult } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  CheckCircle2, 
  Star, 
  Hash, 
  Eye, 
  Briefcase,
  Lightbulb
} from 'lucide-react';

interface AnalysisResultSectionProps {
  analysis: AnalysisResult;
}

const sectionConfig = [
  { 
    key: 'coreResponsibilities', 
    title: '핵심 업무', 
    icon: Target, 
    color: 'bg-primary/10 text-primary',
    badgeColor: 'bg-primary/10 text-primary hover:bg-primary/20'
  },
  { 
    key: 'requiredSkills', 
    title: '필수 역량', 
    icon: CheckCircle2, 
    color: 'bg-destructive/10 text-destructive',
    badgeColor: 'bg-destructive/10 text-destructive hover:bg-destructive/20'
  },
  { 
    key: 'preferredSkills', 
    title: '우대 역량', 
    icon: Star, 
    color: 'bg-warning/10 text-warning',
    badgeColor: 'bg-warning/10 text-warning hover:bg-warning/20'
  },
  { 
    key: 'repeatedKeywords', 
    title: '반복 키워드', 
    icon: Hash, 
    color: 'bg-secondary/10 text-secondary',
    badgeColor: 'bg-secondary/10 text-secondary hover:bg-secondary/20'
  },
  { 
    key: 'hiddenCriteria', 
    title: '숨은 평가 기준', 
    icon: Eye, 
    color: 'bg-purple-500/10 text-purple-600',
    badgeColor: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20'
  },
  { 
    key: 'requiredExperiences', 
    title: '반드시 보여줘야 할 경험', 
    icon: Briefcase, 
    color: 'bg-success/10 text-success',
    badgeColor: 'bg-success/10 text-success hover:bg-success/20'
  },
];

export function AnalysisResultSection({ analysis }: AnalysisResultSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-secondary/10">
          <Target className="w-5 h-5 text-secondary" />
        </div>
        <h2 className="text-xl font-semibold">공고 분석 결과</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionConfig.map(({ key, title, icon: Icon, color, badgeColor }) => {
          const items = analysis[key as keyof AnalysisResult] as string[];
          if (!items || items.length === 0) return null;

          return (
            <Card key={key} className="animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className={`p-1.5 rounded-md ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {key === 'repeatedKeywords' ? (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, idx) => (
                      <Badge key={idx} variant="secondary" className={badgeColor}>
                        #{item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 채용 담당자 관점 */}
      <Card className="border-2 border-purple-500/20 bg-purple-500/5 animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-600">
              <Lightbulb className="w-4 h-4" />
            </div>
            채용 담당자 관점에서 본 핵심 포인트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.recruiterInsights.map((insight, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-card border">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600 border-purple-500/30">
                    {insight.category}
                  </Badge>
                </div>
                <p className="text-sm">{insight.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
