import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KeyRound, Copy, Check } from 'lucide-react';

interface ResumeKeywordsProps {
  keywords: string[];
}

export function ResumeKeywords({ keywords }: ResumeKeywordsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(keywords.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-md bg-primary/10">
              <KeyRound className="w-4 h-4 text-primary" />
            </div>
            이력서 키워드 추천
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopy}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? '복사됨' : '전체 복사'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          ATS 통과를 위해 이력서에 포함해야 할 키워드입니다.
        </p>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, idx) => (
            <Badge key={idx} className="bg-primary/10 text-primary border border-primary/30 px-3 py-1">
              {kw}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
