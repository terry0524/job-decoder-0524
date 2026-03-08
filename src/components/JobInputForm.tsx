import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Briefcase, Building2, FileText, Sparkles, BookOpen, Loader2, User } from 'lucide-react';

interface JobInputFormProps {
  onSubmit: (data: { companyName: string; positionName: string; rawContent: string; resumeText?: string }) => void;
  isLoading?: boolean;
  sampleData?: { companyName: string; positionName: string; rawContent: string };
}

export function JobInputForm({ onSubmit, isLoading, sampleData }: JobInputFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [positionName, setPositionName] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [resumeText, setResumeText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName && positionName && rawContent) {
      onSubmit({ companyName, positionName, rawContent, resumeText: resumeText.trim() || undefined });
    }
  };

  const handleLoadSample = () => {
    if (sampleData) {
      setCompanyName(sampleData.companyName);
      setPositionName(sampleData.positionName);
      setRawContent(sampleData.rawContent);
    }
  };

  const isValid = companyName && positionName && rawContent.length > 50;

  return (
    <div className="space-y-5">
      {/* Job Description Input */}
      <Card className="card-elevated border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-base">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              채용공고 입력
            </CardTitle>
            {sampleData && (
              <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 border-dashed" onClick={handleLoadSample}>
                <BookOpen className="w-3.5 h-3.5" />
                예시 채용공고 불러오기
              </Button>
            )}
          </div>
          <CardDescription className="text-xs mt-1.5">
            채용공고 정보를 입력하세요. 상세할수록 더 정확한 분석이 가능합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="company" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5" />
                  회사명
                </Label>
                <Input
                  id="company"
                  placeholder="예: Google, 삼성, 네이버"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="position" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5" />
                  직무명
                </Label>
                <Input
                  id="position"
                  placeholder="예: 데이터 분석가, 프로덕트 매니저"
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FileText className="w-3.5 h-3.5" />
                채용공고 내용
              </Label>
              <Textarea
                id="content"
                placeholder="채용공고 내용을 여기에 붙여넣으세요."
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                className="min-h-[200px] resize-none scrollbar-thin text-sm"
              />
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-muted-foreground">최소 50자 이상</p>
                <p className="text-[11px] text-muted-foreground tabular-nums">{rawContent.length}자</p>
              </div>
            </div>

            {/* Resume input - always visible */}
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <Label htmlFor="resume" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                이력서 또는 경험 입력
                <span className="text-[10px] text-muted-foreground/60 ml-1">(선택)</span>
              </Label>
              <Textarea
                id="resume"
                placeholder="자신의 기술이나 경험을 입력하세요."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[120px] resize-none scrollbar-thin text-sm"
              />
              <p className="text-[10px] text-muted-foreground">
                입력하면 JD Match Score 및 이력서 개선 제안을 확인할 수 있습니다.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-sm font-semibold gap-2"
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  분석 시작
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
