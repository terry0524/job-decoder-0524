import { DifficultyAssessment } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gauge, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DifficultyScoreProps {
  difficulty: DifficultyAssessment;
}

const levelConfig = {
  easy: {
    label: '신입 친화적',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/30',
    icon: CheckCircle,
  },
  moderate: {
    label: '중급 수준',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    icon: Info,
  },
  challenging: {
    label: '도전적',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/30',
    icon: AlertTriangle,
  },
  difficult: {
    label: '경력직 수준',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/30',
    icon: AlertTriangle,
  }
};

export function DifficultyScore({ difficulty }: DifficultyScoreProps) {
  const config = levelConfig[difficulty.level];
  const Icon = config.icon;
  
  return (
    <Card className={cn("border-2", config.borderColor, config.bgColor)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className={cn("p-1.5 rounded-md", config.bgColor)}>
            <Gauge className={cn("w-4 h-4", config.color)} />
          </div>
          지원 난이도
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("w-5 h-5", config.color)} />
            <Badge className={cn("font-medium", config.bgColor, config.color, "border-0")}>
              {config.label}
            </Badge>
          </div>
          <span className={cn("text-2xl font-bold", config.color)}>
            {difficulty.score}
          </span>
        </div>
        
        <div className="space-y-1.5">
          <Progress value={difficulty.score} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>쉬움</span>
            <span>어려움</span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-2">평가 요인</p>
          <ul className="space-y-1">
            {difficulty.factors.map((factor, idx) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-sm">{difficulty.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
