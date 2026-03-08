import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Building2, Briefcase } from 'lucide-react';

interface JobSummaryCardProps {
  companyName: string;
  positionName: string;
  summary: string;
  atsKeywords: string[];
}

export function JobSummaryCard({ companyName, positionName, summary, atsKeywords }: JobSummaryCardProps) {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            직무 요약
          </CardTitle>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="gap-1">
            <Building2 className="w-3 h-3" />
            {companyName}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Briefcase className="w-3 h-3" />
            {positionName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{summary}</p>
        
        <div className="pt-3 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2">ATS 키워드</p>
          <div className="flex flex-wrap gap-1.5">
            {atsKeywords.map((keyword, idx) => (
              <Badge 
                key={idx} 
                variant="outline"
                className="text-xs bg-accent/5 border-accent/30 text-accent"
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
