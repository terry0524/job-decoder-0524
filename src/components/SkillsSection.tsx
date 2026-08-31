import { Badge } from '@/components/ui/badge';

interface SkillsSectionProps {
  requiredSkills: string[];
  preferredSkills: string[];
  toolsAndTechnologies: string[];
  responsibilities: string[];
}

export function SkillsSection({ requiredSkills, preferredSkills, toolsAndTechnologies, responsibilities }: SkillsSectionProps) {
  const groups = [
    { title: '필수 역량', items: requiredSkills, className: 'border-destructive/30 text-destructive' },
    { title: '우대 역량', items: preferredSkills, className: 'border-warning/40 text-warning' },
    { title: '도구 및 기술', items: toolsAndTechnologies, className: 'border-border text-foreground/80' },
  ].filter((g) => g.items.length > 0);

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-5">요구 역량</h2>

      <div className="space-y-5">
        {groups.map(({ title, items, className }) => (
          <div key={title}>
            <p className="text-sm font-medium text-foreground mb-2.5">{title}</p>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, idx) => (
                <Badge key={idx} variant="outline" className={`text-xs font-normal ${className}`}>
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {responsibilities.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">주요 업무</h3>
          <ul className="space-y-2">
            {responsibilities.map((item, idx) => (
              <li key={idx} className="flex gap-2.5 text-sm text-foreground/85">
                <span className="text-xs text-muted-foreground tabular-nums pt-0.5">{idx + 1}</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
