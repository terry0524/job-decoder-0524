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
    borderColor: 'border-success/25',
    icon: CheckCircle,
  },
  moderate: {
    label: '중급 수준',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/25',
    icon: Info,
  },
  challenging: {
    label: '도전적',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/25',
    icon: AlertTriangle,
  },
  difficult: {
    label: '경력직 수준',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/25',
    icon: AlertTriangle,
  }
};

export function DifficultyScore({ difficulty }: DifficultyScoreProps) {
  const config = levelConfig[difficulty.level];
  const Icon = config.icon;
  
  return (
    <Card className={cn("h-full border-border/60", config.borderColor)}>
      <CardHeader className="pb-2.5">
        <CardTitle className="flex items-center gap-2 text-sm">
          <div className={cn("w-7 h-7 rounded-md flex items-center justify-center", config.bgColor)}>
            <Gauge className={cn("w-3.5 h-3.5", config.color)} />
          </div>
          지원 난이도
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("w-4 h-4", config.color)} />
            <Badge className={cn("text-xs font-semibold", config.bgColor, config.color, "border-0")}>
              {config.label}
            </Badge>
          </div>
          <span className={cn("text-3xl font-extrabold tabular-nums", config.color)}>
            {difficulty.score}
          </span>
        </div>
        
        <div className="space-y-1">
          <Progress value={difficulty.score} className="h-1.5" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>쉬움</span>
            <span>어려움</span>
          </div>
        </div>
        
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs font-semibold text-muted-foreground mb-2">평가 요인</p>
          <ul className="space-y-1">
            {difficulty.factors.map((factor, idx) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-foreground/80 leading-relaxed">{difficulty.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
