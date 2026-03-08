import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-3">
          <FileSearch className="w-3.5 h-3.5" />
          JD Analysis Report
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">채용공고 분석 리포트</h2>
        <p className="text-sm text-muted-foreground mt-1">{companyName} · {positionName}</p>
      </div>

      {/* Quick Summary */}
      <Card className="border-primary/15 bg-primary/[0.03]">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">직무</p>
                <p className="text-sm font-bold text-foreground truncate">{positionName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <Code2 className="w-4 h-4 text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">핵심 기술</p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {topSkills.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-warning" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">난이도</p>
                <p className="text-sm font-bold text-foreground">{difficulty}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed border-t border-border/50 pt-3">{summary}</p>
        </CardContent>
      </Card>
    </div>
  );
}
