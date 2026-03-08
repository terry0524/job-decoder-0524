import { CheckCircle2, FileText, Sparkles, ClipboardList, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: '채용공고 입력', description: '공고 내용 붙여넣기', icon: FileText },
  { id: 2, title: 'AI 분석', description: '핵심 요소 추출', icon: Sparkles },
  { id: 3, title: 'JD 분석 리포트 확인', description: '전략 리포트 확인', icon: ClipboardList },
];

export function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  return (
    <div className="w-full mb-10">
      <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
        How It Works
      </p>
      <div className="flex items-start justify-center gap-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center gap-2.5 w-28 sm:w-36">
                <div 
                  className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
                    isCompleted && "bg-primary text-primary-foreground shadow-md shadow-primary/20",
                    isCurrent && "bg-primary/10 text-primary ring-2 ring-primary/25",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4.5 h-4.5" />}
                </div>
                <div className="text-center">
                  <p className={cn(
                    "text-xs font-bold leading-tight",
                    (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 hidden sm:block mt-0.5">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex items-center mt-5 mx-1 sm:mx-2">
                  <ArrowRight className={cn(
                    "w-4 h-4",
                    currentStep > step.id ? "text-primary" : "text-border"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
