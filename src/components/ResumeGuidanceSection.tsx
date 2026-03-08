import { ResumeGuidance } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Zap, Users, Rocket, PenLine } from 'lucide-react';

interface ResumeGuidanceSectionProps {
  guidance: ResumeGuidance;
}

const tabs = [
  { key: 'motivation', label: 'Motivation', icon: Heart, color: 'text-destructive' },
  { key: 'competency', label: 'Competency', icon: Zap, color: 'text-primary' },
  { key: 'collaboration', label: 'Collaboration', icon: Users, color: 'text-secondary' },
  { key: 'aspiration', label: 'Aspiration', icon: Rocket, color: 'text-warning' },
];

export function ResumeGuidanceSection({ guidance }: ResumeGuidanceSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <PenLine className="w-5 h-5 text-primary" />
          </div>
          Cover Letter Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="motivation" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto gap-1 bg-muted/50 p-1">
            {tabs.map(({ key, label, icon: Icon, color }) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="data-[state=active]:bg-card data-[state=active]:shadow-sm py-2.5 gap-1.5"
              >
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {tabs.map(({ key, label, icon: Icon, color }) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <h3 className="font-medium">{label} — What to Write</h3>
                </div>
                {guidance[key as keyof ResumeGuidance].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {idx + 1}
                    </div>
                    <p className="text-sm pt-0.5">{point}</p>
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
