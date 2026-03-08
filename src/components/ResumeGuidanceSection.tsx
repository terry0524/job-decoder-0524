import { ResumeGuidance } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Zap, Users, Rocket, PenLine } from 'lucide-react';

interface ResumeGuidanceSectionProps {
  guidance: ResumeGuidance;
}

const tabs = [
  { key: 'motivation', label: '지원 동기', icon: Heart, color: 'text-destructive' },
  { key: 'competency', label: '역량', icon: Zap, color: 'text-primary' },
  { key: 'collaboration', label: '협업', icon: Users, color: 'text-secondary' },
  { key: 'aspiration', label: '포부', icon: Rocket, color: 'text-warning' },
];

export function ResumeGuidanceSection({ guidance }: ResumeGuidanceSectionProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2.5">
        <CardTitle className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <PenLine className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-semibold">자기소개서 가이드</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="motivation" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto gap-1 bg-muted/40 p-1">
            {tabs.map(({ key, label, icon: Icon, color }) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="data-[state=active]:bg-card data-[state=active]:shadow-sm py-2 gap-1.5 text-xs"
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map(({ key, label, icon: Icon, color }) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <h3 className="text-sm font-semibold">{label} — 작성 포인트</h3>
                </div>
                {guidance[key as keyof ResumeGuidance].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-md bg-muted/30">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-foreground/85 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
