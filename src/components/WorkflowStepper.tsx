import { CheckCircle2, FileText, Sparkles, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: '채용공고 입력', description: '공고 내용 붙여넣기', icon: FileText },
  { id: 2, title: 'AI 분석', description: '핵심 요소 추출', icon: Sparkles },
  { id: 3, title: '분석 결과', description: '전략 리포트 확인', icon: ClipboardList },
];

export function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                    isCompleted && "bg-primary text-primary-foreground shadow-md shadow-primary/25",
                    isCurrent && "bg-primary/10 text-primary ring-2 ring-primary/30",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="text-center">
                  <p className={cn(
                    "text-xs font-semibold",
                    (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-12 sm:w-20 h-px mx-3 sm:mx-5 mt-[-20px]",
                  currentStep > step.id ? "bg-primary" : "bg-border"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
