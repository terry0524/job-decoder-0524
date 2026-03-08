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
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && "bg-primary/10 border-primary text-primary",
                    !isCompleted && !isCurrent && "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="mt-2 text-center">
                  <p className={cn(
                    "text-sm font-medium",
                    (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-16 sm:w-24 h-0.5 mx-2 sm:mx-4 mt-[-24px]",
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
