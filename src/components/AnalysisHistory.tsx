import { HistoryEntry, removeFromHistory } from '@/lib/analysisHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, Building2, Briefcase } from 'lucide-react';

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
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-md bg-muted">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          최근 분석 기록
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelect(entry)}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Building2 className="w-3 h-3" />
                      {entry.companyName}
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Briefcase className="w-3 h-3" />
                      {entry.positionName}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => handleRemove(e, entry.id)}
              >
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
