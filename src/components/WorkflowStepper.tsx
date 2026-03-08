import { CheckCircle2, FileText, User, ClipboardList, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkflowStepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: '채용공고 입력', icon: FileText },
  { id: 2, title: '이력서 또는 경험 입력', icon: User },
  { id: 3, title: 'JD 분석 리포트 확인', icon: ClipboardList },
];

export function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  return (
    <div className="w-full mb-10">
      <p className="text-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-6">
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
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary/10 text-primary ring-2 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Icon className="w-4 h-4" />}
                </div>
                <p className={cn(
                  "text-[11px] font-semibold leading-tight text-center px-1",
                  (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex items-center mt-4 mx-1 sm:mx-2">
                  <ArrowRight className={cn(
                    "w-3.5 h-3.5",
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
