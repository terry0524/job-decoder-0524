import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Briefcase, Building2, FileText, Sparkles, BookOpen, Loader2, User, ChevronDown } from 'lucide-react';
import { SampleJD } from '@/lib/sampleJobDescription';

interface JobInputFormProps {
  onSubmit: (data: { companyName: string; positionName: string; rawContent: string; resumeText?: string }) => void;
  isLoading?: boolean;
  sampleData?: SampleJD[];
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

  const handleLoadSample = (sample: SampleJD) => {
    setCompanyName(sample.companyName);
    setPositionName(sample.positionName);
    setRawContent(sample.rawContent);
  };

  const isValid = companyName && positionName && rawContent.length > 50;

  return (
    <div className="space-y-4">
      {/* Job Description Input */}
      <Card className="card-elevated border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2.5 text-sm">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary" />
            </div>
            채용공고 입력
          </CardTitle>
          <CardDescription className="text-xs">
            채용공고 정보를 입력하세요. 상세할수록 더 정확한 분석이 가능합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="company" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Building2 className="w-3 h-3" />
                  회사명
                </Label>
                <Input
                  id="company"
                  placeholder="예: Google, 삼성, 네이버"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="position" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Briefcase className="w-3 h-3" />
                  직무명
                </Label>
                <Input
                  id="position"
                  placeholder="예: 데이터 분석가, 프로덕트 매니저"
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <FileText className="w-3 h-3" />
                채용공고 내용
              </Label>
              <Textarea
                id="content"
                placeholder="채용공고 내용을 붙여넣으세요"
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                className="min-h-[180px] resize-none scrollbar-thin text-sm"
              />
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-muted-foreground">최소 50자 이상</p>
                <p className="text-[11px] text-muted-foreground tabular-nums">{rawContent.length}자</p>
              </div>
            </div>

            {/* Resume input */}
            <div className="space-y-1.5 pt-3 border-t border-border/40">
              <Label htmlFor="resume" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <User className="w-3 h-3" />
                이력서 또는 경험 입력
                <span className="text-[10px] text-muted-foreground/50 ml-1">(선택)</span>
              </Label>
              <Textarea
                id="resume"
                placeholder="자신의 기술이나 프로젝트 경험을 입력하세요"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[100px] resize-none scrollbar-thin text-sm"
              />
              <p className="text-[10px] text-muted-foreground">
                입력하면 JD Match Score 및 이력서 개선 제안을 확인할 수 있습니다.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Button 
                type="submit" 
                className="flex-1 h-10 text-sm font-semibold gap-2"
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
              {sampleData && sampleData.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="gap-1.5 text-xs h-10 border-dashed"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      예시 불러오기
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {sampleData.map((sample) => (
                      <DropdownMenuItem
                        key={sample.id}
                        onClick={() => handleLoadSample(sample)}
                        className="text-xs cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                        {sample.label}
                        <span className="ml-auto text-[10px] text-muted-foreground">{sample.companyName}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
