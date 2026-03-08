import { useState } from 'react';
import { ExperienceMatch } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link2, Plus, X, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ExperienceMatchingSectionProps {
  matches: ExperienceMatch[];
  onAddExperience: (experience: string) => void;
  onRemoveExperience: (index: number) => void;
}

const matchConfig = {
  strong: { label: '높은 일치', color: 'bg-success/8 text-success border-success/20', icon: CheckCircle2, score: 100 },
  moderate: { label: '보완 필요', color: 'bg-warning/8 text-warning border-warning/20', icon: AlertTriangle, score: 60 },
  weak: { label: '낮은 일치', color: 'bg-destructive/8 text-destructive border-destructive/20', icon: XCircle, score: 25 },
};

export function ExperienceMatchingSection({ matches, onAddExperience, onRemoveExperience }: ExperienceMatchingSectionProps) {
  const [newExperience, setNewExperience] = useState('');

  const handleAdd = () => {
    if (newExperience.trim()) {
      onAddExperience(newExperience.trim());
      setNewExperience('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
  };

  const overallScore = matches.length > 0 
    ? Math.round(matches.reduce((acc, m) => acc + matchConfig[m.matchLevel].score, 0) / matches.length)
    : 0;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2.5">
        <CardTitle className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-md bg-secondary/10 flex items-center justify-center">
            <Link2 className="w-3.5 h-3.5 text-secondary" />
          </div>
          <span className="font-semibold">경험 매칭</span>
        </CardTitle>
        <CardDescription className="text-xs">보유한 경험을 입력하면 채용 요건과의 일치도를 확인할 수 있습니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="예: Python 프로젝트, 데이터 분석 인턴"
            value={newExperience}
            onChange={(e) => setNewExperience(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-9 text-sm"
          />
          <Button onClick={handleAdd} size="icon" className="h-9 w-9" disabled={!newExperience.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['Python 프로젝트', 'Data analysis', 'Machine learning', '인턴 경험', 'SQL 활용'].map((exp) => (
            <Badge key={exp} variant="outline" className="cursor-pointer hover:bg-muted text-[11px] transition-colors" onClick={() => onAddExperience(exp)}>
              + {exp}
            </Badge>
          ))}
        </div>

        {matches.length > 0 && (
          <div className="p-3 rounded-md bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium">전체 매칭도</span>
              <span className="text-sm font-bold text-primary">{overallScore}%</span>
            </div>
            <Progress value={overallScore} className="h-1.5" />
          </div>
        )}

        <div className="space-y-2">
          {matches.map((match, idx) => {
            const config = matchConfig[match.matchLevel];
            const Icon = config.icon;
            return (
              <div key={idx} className="p-2.5 rounded-md border border-border/50 bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${match.matchLevel === 'strong' ? 'text-success' : match.matchLevel === 'moderate' ? 'text-warning' : 'text-destructive'}`} />
                    <span className="text-sm font-medium">{match.keyword}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className={`text-[10px] ${config.color}`}>{config.label}</Badge>
                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onRemoveExperience(idx)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 ml-5">{match.explanation}</p>
              </div>
            );
          })}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Link2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-xs">경험을 추가하면 매칭 결과를 확인할 수 있습니다</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
