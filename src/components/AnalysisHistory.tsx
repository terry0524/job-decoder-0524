import { HistoryEntry, removeFromHistory } from '@/lib/analysisHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Building2, Briefcase, ChevronRight } from 'lucide-react';

interface AnalysisHistoryProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onHistoryChange: () => void;
}

export function AnalysisHistory({ history, onSelect, onHistoryChange }: AnalysisHistoryProps) {
  if (history.length === 0) return null;

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeFromHistory(id);
    onHistoryChange();
  };

  return (
    <Card className="mt-6 border-border/60">
      <CardHeader className="pb-2.5">
        <CardTitle className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <span className="font-semibold">최근 분석 기록</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {history.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelect(entry)}
              className="flex items-center justify-between p-2.5 rounded-md border border-border/40 bg-card hover:bg-muted/40 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="gap-1 text-[10px] font-medium h-5">
                      <Building2 className="w-2.5 h-2.5" />
                      {entry.companyName}
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-[10px] font-medium h-5">
                      <Briefcase className="w-2.5 h-2.5" />
                      {entry.positionName}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleRemove(e, entry.id)}
                >
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </Button>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
