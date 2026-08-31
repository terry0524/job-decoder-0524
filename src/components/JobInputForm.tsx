import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Loader2, ChevronDown } from 'lucide-react';
import { SampleJD } from '@/lib/sampleJobDescription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MAX_JD_LENGTH, MAX_RESUME_LENGTH, MIN_JD_LENGTH } from '@/lib/limits';

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
  const [jobUrl, setJobUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const { toast } = useToast();

  const jdTooLong = rawContent.length > MAX_JD_LENGTH;
  const resumeTooLong = resumeText.length > MAX_RESUME_LENGTH;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ companyName, positionName, rawContent, resumeText: resumeText.trim() || undefined });
  };

  const handleLoadSample = (sample: SampleJD) => {
    setCompanyName(sample.companyName);
    setPositionName(sample.positionName);
    setRawContent(sample.rawContent);
  };

  const handleScrapeUrl = async () => {
    if (!jobUrl.trim()) return;
    setIsScraping(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-job-url', {
        body: { url: jobUrl.trim() },
      });
      if (error) throw new Error(error.message);
      if (data?.error) {
        toast({
          title: '공고를 불러오지 못했습니다',
          description: `${data.error} 개별 채용공고 상세 페이지 URL을 넣거나, 공고 내용을 아래에 직접 붙여넣어 주세요.`,
          variant: 'destructive',
        });
        return;
      }
      if (data?.companyName) setCompanyName(data.companyName);
      if (data?.positionName) setPositionName(data.positionName);
      if (data?.rawContent) setRawContent(String(data.rawContent).slice(0, MAX_JD_LENGTH));
      toast({ title: '공고를 불러왔습니다', description: `${data.companyName} · ${data.positionName}` });
    } catch (err) {
      toast({
        title: '공고를 불러오지 못했습니다',
        description:
          '목록 페이지나 로그인이 필요한 페이지는 읽을 수 없습니다. 개별 채용공고 상세 URL을 넣거나, 공고 내용을 직접 붙여넣어 주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsScraping(false);
    }
  };

  const isValid =
    !!companyName && !!positionName && rawContent.length >= MIN_JD_LENGTH && !jdTooLong && !resumeTooLong;

  return (
    <section className="rounded-md border border-border bg-card">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">채용공고 입력</h2>
        <p className="text-xs text-muted-foreground mt-1">
          공고 URL을 넣으면 자동으로 채워집니다. 내용이 상세할수록 분석이 정확해집니다.
        </p>
      </div>

      <div className="px-5 py-5">
        {/* URL */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="jobUrl" className="text-xs text-muted-foreground">
              채용공고 URL <span className="text-muted-foreground/60">(선택)</span>
            </Label>
            <Input
              id="jobUrl"
              placeholder="https://careers.example.com/jobs/1234"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="h-9"
              disabled={isScraping}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs shrink-0"
            onClick={handleScrapeUrl}
            disabled={!jobUrl.trim() || isScraping}
          >
            {isScraping ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" />불러오는 중</>
            ) : (
              '자동 입력'
            )}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-border space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-xs text-muted-foreground">회사명</Label>
              <Input
                id="company"
                placeholder="예: 네이버"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value.slice(0, 100))}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="position" className="text-xs text-muted-foreground">직무명</Label>
              <Input
                id="position"
                placeholder="예: 데이터 분석"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value.slice(0, 100))}
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-xs text-muted-foreground">채용공고 내용</Label>
            <Textarea
              id="content"
              placeholder="자격요건, 우대사항, 주요 업무를 포함해 붙여넣어 주세요."
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="min-h-[180px] resize-none scrollbar-thin text-sm"
            />
            <div className="flex items-center justify-between gap-3">
              <p className={`text-xs ${jdTooLong ? 'text-destructive' : 'text-muted-foreground'}`}>
                {jdTooLong
                  ? `최대 ${MAX_JD_LENGTH.toLocaleString()}자까지 분석할 수 있습니다. 핵심 내용만 남겨 주세요.`
                  : `최소 ${MIN_JD_LENGTH}자 이상`}
              </p>
              <p className={`text-xs tabular-nums ${jdTooLong ? 'text-destructive' : 'text-muted-foreground'}`}>
                {rawContent.length.toLocaleString()} / {MAX_JD_LENGTH.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="resume" className="text-xs text-muted-foreground">
              이력서 또는 경험 <span className="text-muted-foreground/60">(선택)</span>
            </Label>
            <Textarea
              id="resume"
              placeholder="보유 기술과 프로젝트 경험을 붙여넣으면 공고와의 차이를 확인할 수 있습니다."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[110px] resize-none scrollbar-thin text-sm"
            />
            <div className="flex items-center justify-between gap-3">
              <p className={`text-xs ${resumeTooLong ? 'text-destructive' : 'text-muted-foreground'}`}>
                {resumeTooLong
                  ? `최대 ${MAX_RESUME_LENGTH.toLocaleString()}자까지 입력할 수 있습니다.`
                  : '입력하면 일치도와 보완 포인트를 함께 확인할 수 있습니다.'}
              </p>
              {resumeText.length > 0 && (
                <p className={`text-xs tabular-nums ${resumeTooLong ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {resumeText.length.toLocaleString()} / {MAX_RESUME_LENGTH.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button type="submit" className="flex-1 h-10 text-sm font-semibold" disabled={!isValid || isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />분석 중</>
              ) : (
                '분석 시작'
              )}
            </Button>
            {sampleData && sampleData.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" className="gap-1.5 text-xs h-10">
                    예시 공고 불러오기
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {sampleData.map((sample) => (
                    <DropdownMenuItem
                      key={sample.id}
                      onClick={() => handleLoadSample(sample)}
                      className="text-xs cursor-pointer"
                    >
                      {sample.label}
                      <span className="ml-auto text-[10px] text-muted-foreground">{sample.companyName}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
