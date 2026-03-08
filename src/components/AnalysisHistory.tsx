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
    <div className="mt-8">
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 text-center">
        Recent Analyses
      </p>
      <div className="space-y-1.5">
        {history.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-border/40 bg-card hover:bg-muted/40 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <Badge variant="secondary" className="gap-1 text-[10px] font-medium h-5 shrink-0">
                  <Building2 className="w-2.5 h-2.5" />
                  {entry.companyName}
                </Badge>
                <Badge variant="outline" className="gap-1 text-[10px] font-medium h-5 shrink-0">
                  <Briefcase className="w-2.5 h-2.5" />
                  {entry.positionName}
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground/60 hidden sm:inline shrink-0">
                {new Date(entry.createdAt).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleRemove(e, entry.id)}
              >
                <Trash2 className="w-3 h-3 text-muted-foreground" />
              </Button>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
