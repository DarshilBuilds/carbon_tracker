import { TrendingUp, Activity, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EmissionsSummary as SummaryType } from '@/types/emissions';

interface EmissionsSummaryProps {
  summary: SummaryType;
}

export function EmissionsSummary({ summary }: EmissionsSummaryProps) {
  const stats = [
    {
      label: 'Total Emissions',
      value: summary.totalEmissions.toLocaleString(),
      unit: 'kg CO₂e',
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Activities Mapped',
      value: summary.activityCount,
      unit: 'activities',
      icon: Activity,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      label: 'Avg. Match Score',
      value: `${summary.avgConfidence}%`,
      unit: '',
      icon: Target,
      color: summary.avgConfidence >= 70 ? 'text-success' : 'text-warning',
      bgColor: summary.avgConfidence >= 70 ? 'bg-success/10' : 'bg-warning/10',
    },
    {
      label: 'High Match Score',
      value: summary.highConfidenceCount,
      unit: 'matches',
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Low Match Score',
      value: summary.lowConfidenceCount,
      unit: 'need review',
      icon: AlertTriangle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.label} 
          className="gradient-card shadow-card hover-lift card-glow group relative overflow-hidden transition-all duration-300 animate-fade-in border border-border/80"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary transition-all duration-500" />
          <CardContent className="p-4 min-w-0">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-2xs`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className="min-w-0 break-words text-xl font-display font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-200">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.unit && <span className="font-medium text-foreground/80">{stat.unit} · </span>}
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
