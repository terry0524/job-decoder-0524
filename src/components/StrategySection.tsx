import { ApplicationStrategy } from '@/types/jobAnalysis';

interface StrategySectionProps {
  strategy: ApplicationStrategy;
}

const sectionConfig = [
  { key: 'keyStrengthsToHighlight', title: '이력서에서 강조할 점' },
  { key: 'experiencesToPrepare', title: '준비할 경험' },
  { key: 'questionsToAnticipate', title: '예상 면접 질문' },
  { key: 'commonMistakesToAvoid', title: '피해야 할 실수' },
];

export function StrategySection({ strategy }: StrategySectionProps) {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-5">지원 전략</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {sectionConfig.map(({ key, title }) => {
          const items = strategy[key as keyof ApplicationStrategy];
          if (!items || items.length === 0) return null;
          return (
            <div key={key}>
              <p className="text-sm font-medium text-foreground mb-2">{title}</p>
              <ul className="space-y-1.5">
                {items.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-foreground/85 leading-relaxed">
                    <span className="mt-2 w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
