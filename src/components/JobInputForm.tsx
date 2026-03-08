import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Briefcase, Building2, FileText, Sparkles } from 'lucide-react';

interface JobInputFormProps {
  onSubmit: (data: { companyName: string; positionName: string; rawContent: string }) => void;
  isLoading?: boolean;
}

export function JobInputForm({ onSubmit, isLoading }: JobInputFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [positionName, setPositionName] = useState('');
  const [rawContent, setRawContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName && positionName && rawContent) {
      onSubmit({ companyName, positionName, rawContent });
    }
  };

  const isValid = companyName && positionName && rawContent.length > 50;

  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-xl">채용공고 입력</CardTitle>
        </div>
        <CardDescription className="text-sm">
          분석할 채용공고 정보를 입력하세요. 상세할수록 정확한 분석이 가능합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                회사명
              </Label>
              <Input
                id="company"
                placeholder="예: 삼성전자, 네이버, 토스"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="flex items-center gap-2 text-sm font-medium">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                직무명
              </Label>
              <Input
                id="position"
                placeholder="예: 서비스 기획, 데이터 분석, 마케팅"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="w-4 h-4 text-muted-foreground" />
              공고 원문
            </Label>
            <Textarea
              id="content"
              placeholder={`채용공고 전문을 붙여넣으세요.

예시:
[담당업무]
- 신규 서비스 기획 및 운영
- 시장/경쟁사 분석을 통한 전략 수립
- 데이터 기반 서비스 개선

[자격요건]
- 관련 학과 졸업 또는 동등 경력
- 문서 작성 및 커뮤니케이션 역량
- 데이터 분석 도구 활용 가능자

[우대사항]
- 유관 인턴 경험자
- SQL/Python 활용 경험...`}
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="min-h-[280px] resize-none scrollbar-thin"
            />
            <p className="text-xs text-muted-foreground">
              최소 50자 이상 입력해주세요 ({rawContent.length}자 입력됨)
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium gap-2"
            disabled={!isValid || isLoading}
          >
            <Sparkles className="w-5 h-5" />
            {isLoading ? '분석 중...' : '공고 분석하기'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
