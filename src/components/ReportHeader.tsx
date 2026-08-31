interface ReportHeaderProps {
  companyName: string;
  positionName: string;
  summary: string;
}

export function ReportHeader({ companyName, positionName, summary }: ReportHeaderProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{companyName}</p>
      <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
        {positionName}
      </h1>
      <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{summary}</p>
    </div>
  );
}
