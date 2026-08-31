import { useEffect, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const stages = ['공고 읽는 중', '요구사항 분류 중', '지원 전략 정리 중'];

interface AnalysisProgressProps {
  className?: string;
}

export function AnalysisProgress({ className }: AnalysisProgressProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((s) => (s < stages.length - 1 ? s + 1 : s));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn('rounded-md border border-border bg-card px-4 py-3.5', className)}>
      <ul className="space-y-2">
        {stages.map((label, idx) => {
          const done = idx < stage;
          const active = idx === stage;
          return (
            <li key={label} className="flex items-center gap-2 text-xs">
              {done ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : active ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              ) : (
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                </span>
              )}
              <span
                className={cn(
                  done ? 'text-muted-foreground' : active ? 'text-foreground font-medium' : 'text-muted-foreground/60'
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
