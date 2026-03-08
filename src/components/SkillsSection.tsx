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
  const sections = [
    {
      title: '필수 기술',
      items: requiredSkills,
      icon: CheckCircle2,
      color: 'bg-destructive/10 text-destructive',
      badgeColor: 'bg-destructive/10 text-destructive border-destructive/30'
    },
    {
      title: '우대 기술',
      items: preferredSkills,
      icon: Star,
      color: 'bg-warning/10 text-warning',
      badgeColor: 'bg-warning/10 text-warning border-warning/30'
    },
    {
      title: '도구 및 기술',
      items: toolsAndTechnologies,
      icon: Wrench,
      color: 'bg-secondary/10 text-secondary',
      badgeColor: 'bg-secondary/10 text-secondary border-secondary/30'
    },
    {
      title: '주요 업무',
      items: responsibilities,
      icon: Clipboard,
      color: 'bg-primary/10 text-primary',
      badgeColor: 'bg-primary/10 text-primary border-primary/30'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <CheckCircle2 className="w-5 h-5 text-primary" />
        </div>
        핵심 기술 및 업무
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map(({ title, items, icon: Icon, color, badgeColor }) => (
          <Card key={title}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className={`p-1.5 rounded-md ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {title === '도구 및 기술' ? (
                <div className="flex flex-wrap gap-2">
                  {items.map((item, idx) => (
                    <Badge key={idx} variant="outline" className={badgeColor}>
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground mt-1.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
