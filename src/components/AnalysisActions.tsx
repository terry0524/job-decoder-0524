import { useState } from 'react';
import { FullAnalysis } from '@/types/jobAnalysis';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisActionsProps {
  analysis: FullAnalysis;
  resumeKeywords: string[];
  reportRef: React.RefObject<HTMLDivElement>;
}

function buildCopyText(analysis: FullAnalysis, resumeKeywords: string[]): string {
  const a = analysis.analysis;
  const s = analysis.applicationStrategy;
  const lines: string[] = [];

  lines.push(`=== 채용공고 요약 ===`);
  lines.push(`회사: ${analysis.jobPosting.companyName}`);
  lines.push(`직무: ${analysis.jobPosting.positionName}`);
  lines.push(a.jobSummary);
  lines.push('');

  lines.push(`=== 필수 기술 ===`);
  a.requiredSkills.forEach(s => lines.push(`• ${s}`));
  lines.push('');

  lines.push(`=== 우대 기술 ===`);
  a.preferredSkills.forEach(s => lines.push(`• ${s}`));
  lines.push('');

  lines.push(`=== 주요 업무 ===`);
  a.coreResponsibilities.forEach(s => lines.push(`• ${s}`));
  lines.push('');

  lines.push(`=== ATS 키워드 ===`);
  lines.push(a.atsKeywords.join(', '));
  lines.push('');

  lines.push(`=== 지원 전략 ===`);
  lines.push(`[이력서에서 강조할 점]`);
  s.keyStrengthsToHighlight.forEach(i => lines.push(`• ${i}`));
  lines.push(`[예상 면접 질문]`);
  s.questionsToAnticipate.forEach(i => lines.push(`• ${i}`));
  lines.push('');

  lines.push(`=== 지원 난이도 ===`);
  lines.push(`점수: ${a.entryLevelDifficulty.score}/100 (${a.entryLevelDifficulty.level})`);
  lines.push(a.entryLevelDifficulty.recommendation);
  lines.push('');

  lines.push(`=== 이력서 키워드 추천 ===`);
  lines.push(resumeKeywords.join(', '));

  return lines.join('\n');
}

export function AnalysisActions({ analysis, resumeKeywords, reportRef }: AnalysisActionsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    const text = buildCopyText(analysis, resumeKeywords);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: '복사 완료', description: '분석 결과가 클립보드에 복사되었습니다.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePdfDownload = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = reportRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f5f6f8',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      while (position < pdfHeight) {
        if (position > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, pdfHeight);
        position += pageHeight;
      }

      pdf.save(`${analysis.jobPosting.companyName}_${analysis.jobPosting.positionName}_분석결과.pdf`);
      toast({ title: 'PDF 다운로드 완료', description: '분석 결과가 PDF로 저장되었습니다.' });
    } catch (err) {
      toast({ title: '다운로드 실패', description: 'PDF 생성 중 오류가 발생했습니다.', variant: 'destructive' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex gap-1.5">
      <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={handleCopy}>
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? '복사됨' : '결과 복사'}
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" onClick={handlePdfDownload} disabled={downloading}>
        {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        {downloading ? '생성 중...' : 'PDF 다운로드'}
      </Button>
    </div>
  );
}
