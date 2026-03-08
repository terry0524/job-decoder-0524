import { ApplicationStrategy } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Briefcase, HelpCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface StrategySectionProps {
  strategy: ApplicationStrategy;
}

const sectionConfig = [
  { key: 'keyStrengthsToHighlight', title: '이력서에서 강조할 점', icon: Target, iconColor: 'text-primary', iconBg: 'bg-primary/10' },
  { key: 'experiencesToPrepare', title: '준비할 경험', icon: Briefcase, iconColor: 'text-secondary', iconBg: 'bg-secondary/10' },
  { key: 'questionsToAnticipate', title: '예상 면접 질문', icon: HelpCircle, iconColor: 'text-warning', iconBg: 'bg-warning/10' },
  { key: 'commonMistakesToAvoid', title: '피해야 할 실수', icon: AlertCircle, iconColor: 'text-destructive', iconBg: 'bg-destructive/10' },
];

export function StrategySection({ strategy }: StrategySectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">지원 전략</h2>
          <p className="text-xs text-muted-foreground">효과적인 지원을 위한 맞춤 가이드</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionConfig.map(({ key, title, icon: Icon, iconColor, iconBg }) => {
          const items = strategy[key as keyof ApplicationStrategy];
          return (
            <Card key={key} className="border-border/60">
              <CardHeader className="pb-2.5">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <div className={`w-7 h-7 rounded-md ${iconBg} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  </div>
                  <span className="font-semibold">{title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="mt-2 w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
                      <span className="text-foreground/85">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
