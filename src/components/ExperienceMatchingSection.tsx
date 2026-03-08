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
  strong: { label: '높은 일치', color: 'bg-success/10 text-success border-success/30', icon: CheckCircle2, score: 100 },
  moderate: { label: '보완 필요', color: 'bg-warning/10 text-warning border-warning/30', icon: AlertTriangle, score: 60 },
  weak: { label: '낮은 일치', color: 'bg-destructive/10 text-destructive border-destructive/30', icon: XCircle, score: 25 },
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Link2 className="w-5 h-5 text-secondary" />
          </div>
          경험 매칭
        </CardTitle>
        <CardDescription>보유한 경험을 입력하면 채용 요건과의 일치도를 확인할 수 있습니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="예: Python 프로젝트, 데이터 분석 인턴"
            value={newExperience}
            onChange={(e) => setNewExperience(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleAdd} size="icon" disabled={!newExperience.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Python 프로젝트', 'Data analysis', 'Machine learning', '인턴 경험', 'SQL 활용', '팀 프로젝트'].map((exp) => (
            <Badge key={exp} variant="outline" className="cursor-pointer hover:bg-muted transition-colors" onClick={() => onAddExperience(exp)}>
              + {exp}
            </Badge>
          ))}
        </div>

        {matches.length > 0 && (
          <div className="p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">전체 매칭도</span>
              <span className="text-lg font-bold text-primary">{overallScore}%</span>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>
        )}

        <div className="space-y-3">
          {matches.map((match, idx) => {
            const config = matchConfig[match.matchLevel];
            const Icon = config.icon;
            return (
              <div key={idx} className="p-3 rounded-lg border bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${match.matchLevel === 'strong' ? 'text-success' : match.matchLevel === 'moderate' ? 'text-warning' : 'text-destructive'}`} />
                    <span className="font-medium">{match.keyword}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={config.color}>{config.label}</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemoveExperience(idx)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 ml-6">{match.explanation}</p>
                <Progress value={config.score} className="h-1.5 mt-2 ml-6" />
              </div>
            );
          })}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Link2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">경험을 추가하면 채용 요건과의 매칭 결과를 확인할 수 있습니다</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
