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
          <CardTitle className="text-xl">Paste Job Description</CardTitle>
        </div>
        <CardDescription className="text-sm">
          Enter the job posting details below. The more detail you provide, the better the analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Company Name
              </Label>
              <Input
                id="company"
                placeholder="e.g. Google, Netflix, Stripe"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="flex items-center gap-2 text-sm font-medium">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                Job Title
              </Label>
              <Input
                id="position"
                placeholder="e.g. Data Analyst, Product Manager"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Job Description
            </Label>
            <Textarea
              id="content"
              placeholder={`Paste the full job description here.

Example:
[Responsibilities]
- Analyze large datasets to generate business insights
- Develop and maintain machine learning models
- Collaborate with product and engineering teams

[Requirements]
- Bachelor's degree in CS, Statistics, or related field
- Proficiency in Python and SQL
- Experience with data visualization tools

[Preferred]
- Experience with cloud platforms (AWS/GCP)
- Familiarity with A/B testing...`}
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="min-h-[280px] resize-none scrollbar-thin"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 50 characters ({rawContent.length} entered)
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium gap-2"
            disabled={!isValid || isLoading}
          >
            <Sparkles className="w-5 h-5" />
            {isLoading ? 'Analyzing...' : 'Analyze Job Posting'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
