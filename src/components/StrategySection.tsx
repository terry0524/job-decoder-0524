import { ApplicationStrategy } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Briefcase, HelpCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface StrategySectionProps {
  strategy: ApplicationStrategy;
}

const sectionConfig = [
  { key: 'keyStrengthsToHighlight', title: 'What to Emphasize in Resume', icon: Target, color: 'bg-primary/10 text-primary' },
  { key: 'experiencesToPrepare', title: 'Experiences to Prepare', icon: Briefcase, color: 'bg-secondary/10 text-secondary' },
  { key: 'questionsToAnticipate', title: 'Questions to Anticipate', icon: HelpCircle, color: 'bg-warning/10 text-warning' },
  { key: 'commonMistakesToAvoid', title: 'Mistakes to Avoid', icon: AlertCircle, color: 'bg-destructive/10 text-destructive' },
];

export function StrategySection({ strategy }: StrategySectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-accent/10">
          <Lightbulb className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold">Application Strategy</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionConfig.map(({ key, title, icon: Icon, color }) => {
          const items = strategy[key as keyof ApplicationStrategy];
          return (
            <Card key={key}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className={`p-1.5 rounded-md ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground mt-1.5">•</span>
                      <span>{item}</span>
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
