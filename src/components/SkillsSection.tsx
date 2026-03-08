import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star, Wrench, Clipboard } from 'lucide-react';

interface SkillsSectionProps {
  requiredSkills: string[];
  preferredSkills: string[];
  toolsAndTechnologies: string[];
  responsibilities: string[];
}

export function SkillsSection({ requiredSkills, preferredSkills, toolsAndTechnologies, responsibilities }: SkillsSectionProps) {
  const skillSections = [
    {
      title: '필수 기술',
      subtitle: 'Required Skills',
      items: requiredSkills,
      icon: CheckCircle2,
      iconColor: 'text-destructive',
      iconBg: 'bg-destructive/10',
      badgeStyle: 'bg-destructive/8 text-destructive border-destructive/20 hover:bg-destructive/15',
      highlight: true,
      asBadges: true,
    },
    {
      title: '우대 기술',
      subtitle: 'Preferred Skills',
      items: preferredSkills,
      icon: Star,
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      badgeStyle: 'bg-warning/8 text-warning border-warning/20 hover:bg-warning/15',
      highlight: false,
      asBadges: true,
    },
    {
      title: '도구 및 기술',
      subtitle: 'Tools & Technologies',
      items: toolsAndTechnologies,
      icon: Wrench,
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary/10',
      badgeStyle: 'bg-secondary/8 text-secondary border-secondary/20 hover:bg-secondary/15',
      highlight: false,
      asBadges: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">핵심 기술 및 업무</h2>
          <p className="text-xs text-muted-foreground">채용공고에서 추출한 요구사항</p>
        </div>
      </div>
      
      {/* Skills as badges in 3-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skillSections.map(({ title, subtitle, items, icon: Icon, iconColor, iconBg, badgeStyle, highlight }) => (
          <Card key={title} className={highlight ? 'border-destructive/20 shadow-sm shadow-destructive/5' : 'border-border/60'}>
            <CardHeader className="pb-2.5">
              <CardTitle className="flex items-center gap-2 text-sm">
                <div className={`w-7 h-7 rounded-md ${iconBg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                </div>
                <div>
                  <span className="font-semibold">{title}</span>
                  <span className="text-[10px] text-muted-foreground ml-1.5">{subtitle}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item, idx) => (
                  <Badge key={idx} variant="outline" className={`text-xs font-medium transition-colors ${badgeStyle}`}>
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Responsibilities as separate card */}
      <Card className="border-border/60">
        <CardHeader className="pb-2.5">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Clipboard className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <span className="font-semibold">주요 업무</span>
              <span className="text-[10px] text-muted-foreground ml-1.5">Key Responsibilities</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {responsibilities.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-md bg-muted/30 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="text-foreground/85">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
