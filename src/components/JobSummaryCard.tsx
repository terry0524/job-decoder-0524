import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Building2, Briefcase, Hash } from 'lucide-react';

interface JobSummaryCardProps {
  companyName: string;
  positionName: string;
  summary: string;
  atsKeywords: string[];
}

export function JobSummaryCard({ companyName, positionName, summary, atsKeywords }: JobSummaryCardProps) {
  return (
    <Card className="h-full border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5 text-base">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          채용공고 요약
        </CardTitle>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge variant="secondary" className="gap-1 text-xs font-medium">
            <Building2 className="w-3 h-3" />
            {companyName}
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs font-medium">
            <Briefcase className="w-3 h-3" />
            {positionName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-foreground/85">{summary}</p>
        
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Hash className="w-3.5 h-3.5 text-accent" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ATS 키워드</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {atsKeywords.map((keyword, idx) => (
              <Badge 
                key={idx} 
                variant="outline"
                className="text-xs font-medium bg-accent/8 border-accent/25 text-accent hover:bg-accent/15 transition-colors"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
