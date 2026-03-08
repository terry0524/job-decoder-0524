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
    <Card className="border-primary/15 shadow-sm shadow-primary/5">
      <CardHeader className="pb-2.5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-semibold">이력서 키워드 추천</span>
          </CardTitle>
          <Button variant="ghost" size="sm" className="gap-1 text-xs h-7 px-2" onClick={handleCopy}>
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? '복사됨' : '복사'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-[11px] text-muted-foreground mb-3">
          ATS 통과를 위해 이력서에 포함해야 할 키워드
        </p>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw, idx) => (
            <Badge key={idx} className="bg-primary/8 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-medium">
              {kw}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
