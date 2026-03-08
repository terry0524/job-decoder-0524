import { RecruiterInsight } from '@/types/jobAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Lightbulb, Briefcase } from 'lucide-react';

interface HiddenRequirementsSectionProps {
  hiddenCriteria: string[];
  requiredExperiences: string[];
  recruiterInsights: RecruiterInsight[];
}

export function HiddenRequirementsSection({ hiddenCriteria, requiredExperiences, recruiterInsights }: HiddenRequirementsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <div className="p-2 rounded-lg bg-accent/10">
          <Eye className="w-5 h-5 text-accent" />
        </div>
        Hidden Requirements
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 rounded-md bg-accent/10">
                <Eye className="w-4 h-4 text-accent" />
              </div>
              Implicit Evaluation Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {hiddenCriteria.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-accent mt-1.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 rounded-md bg-success/10">
                <Briefcase className="w-4 h-4 text-success" />
              </div>
              Must-Have Experiences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {requiredExperiences.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-success mt-1.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-2 border-accent/30 bg-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-md bg-accent/10">
              <Lightbulb className="w-4 h-4 text-accent" />
            </div>
            Recruiter Perspective
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recruiterInsights.map((insight, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-card border">
                <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30 mb-2">
                  {insight.category}
                </Badge>
                <p className="text-sm">{insight.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
