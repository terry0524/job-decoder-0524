import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Briefcase, Code2, BarChart3, FileSearch } from 'lucide-react';

interface ReportHeaderProps {
  companyName: string;
  positionName: string;
  topSkills: string[];
  difficulty: string;
  summary: string;
}

export function ReportHeader({ companyName, positionName, topSkills, difficulty, summary }: ReportHeaderProps) {
  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.15em]">
          <FileSearch className="w-3 h-3" />
          JD Analysis Report
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          {companyName} · {positionName}
        </h2>
      </div>

      {/* Quick Summary Bar */}
      <div className="rounded-xl border border-primary/10 bg-card p-5 card-highlight">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
          {/* 직무 */}
          <div className="flex items-center gap-3 py-3 sm:py-0 sm:pr-5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">직무</p>
              <p className="text-sm font-bold text-foreground truncate mt-0.5">{positionName}</p>
            </div>
          </div>
          {/* 핵심 기술 */}
          <div className="flex items-center gap-3 py-3 sm:py-0 sm:px-5">
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <Code2 className="w-4 h-4 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">핵심 기술</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {topSkills.slice(0, 3).map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-[10px] px-2 py-0 h-5 font-semibold border-secondary/25 text-secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          {/* 난이도 */}
          <div className="flex items-center gap-3 py-3 sm:py-0 sm:pl-5">
            <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 text-warning" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">난이도</p>
              <p className="text-sm font-bold text-foreground mt-0.5">{difficulty}</p>
            </div>
          </div>
        </div>
        <Separator className="my-4 bg-border/40" />
        <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}
