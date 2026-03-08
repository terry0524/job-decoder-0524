import { useState } from 'react';
import { ExperienceMatch } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Link2, 
  Plus, 
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface ExperienceMatchingSectionProps {
  matches: ExperienceMatch[];
  onAddExperience: (experience: string) => void;
  onRemoveExperience: (index: number) => void;
}

const matchConfig = {
  strong: {
    label: '강하게 연결됨',
    color: 'bg-success/10 text-success border-success/30',
    icon: CheckCircle2,
    progressColor: 'bg-success',
    score: 100
  },
  moderate: {
    label: '보완 필요',
    color: 'bg-warning/10 text-warning border-warning/30',
    icon: AlertTriangle,
    progressColor: 'bg-warning',
    score: 60
  },
  weak: {
    label: '연결 약함',
    color: 'bg-destructive/10 text-destructive border-destructive/30',
    icon: XCircle,
    progressColor: 'bg-destructive',
    score: 25
  }
};

export function ExperienceMatchingSection({ 
  matches, 
  onAddExperience, 
  onRemoveExperience 
}: ExperienceMatchingSectionProps) {
  const [newExperience, setNewExperience] = useState('');

  const handleAdd = () => {
    if (newExperience.trim()) {
      onAddExperience(newExperience.trim());
      setNewExperience('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const overallScore = matches.length > 0 
    ? Math.round(matches.reduce((acc, m) => acc + matchConfig[m.matchLevel].score, 0) / matches.length)
    : 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Link2 className="w-5 h-5 text-secondary" />
          </div>
          경험 매칭 분석
        </CardTitle>
        <CardDescription>
          본인의 경험 키워드를 입력하면 공고와의 연결 정도를 분석합니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 입력 영역 */}
        <div className="flex gap-2">
          <Input
            placeholder="예: 팀 프로젝트, 데이터 분석, 인턴 경험"
            value={newExperience}
            onChange={(e) => setNewExperience(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={handleAdd} size="icon" disabled={!newExperience.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* 빠른 추가 버튼 */}
        <div className="flex flex-wrap gap-2">
          {['전공 프로젝트', '실험 경험', '데이터 분석', '전시회/산업 조사', '인턴십', '동아리 활동'].map((exp) => (
            <Badge 
              key={exp}
              variant="outline" 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => onAddExperience(exp)}
            >
              + {exp}
            </Badge>
          ))}
        </div>

        {/* 전체 적합도 */}
        {matches.length > 0 && (
          <div className="p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">전체 적합도</span>
              <span className="text-lg font-bold text-primary">{overallScore}%</span>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>
        )}

        {/* 매칭 결과 */}
        <div className="space-y-3">
          {matches.map((match, idx) => {
            const config = matchConfig[match.matchLevel];
            const Icon = config.icon;
            
            return (
              <div 
                key={idx} 
                className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${match.matchLevel === 'strong' ? 'text-success' : match.matchLevel === 'moderate' ? 'text-warning' : 'text-destructive'}`} />
                    <span className="font-medium">{match.keyword}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={config.color}>
                      {config.label}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => onRemoveExperience(idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 ml-6">
                  {match.explanation}
                </p>
                <Progress 
                  value={config.score} 
                  className="h-1.5 mt-2 ml-6"
                />
              </div>
            );
          })}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Link2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">경험 키워드를 입력하면 공고와의 연결 분석이 시작됩니다</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
