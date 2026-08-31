import { cn } from '@/lib/utils';

interface WorkflowStepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: '채용공고 입력' },
  { id: 2, title: '이력서 입력 (선택)' },
  { id: 3, title: '분석 결과 확인' },
];

export function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  return (
    <ol className="mb-8 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:divide-x divide-border border-y border-border py-3">
      {steps.map((step) => {
        const active = currentStep >= step.id;
        return (
          <li
            key={step.id}
            className="flex items-center gap-2 text-xs sm:flex-1 sm:justify-center sm:px-3"
          >
            <span
              className={cn(
                'tabular-nums font-semibold',
                active ? 'text-primary' : 'text-muted-foreground/60'
              )}
            >
              {step.id}
            </span>
            <span className={active ? 'text-foreground' : 'text-muted-foreground'}>{step.title}</span>
          </li>
        );
      })}
    </ol>
  );
}
