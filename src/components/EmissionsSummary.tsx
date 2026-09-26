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
          className="gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4 min-w-0">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className="min-w-0 break-words text-xl font-display font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.unit && <span className="font-medium">{stat.unit} · </span>}
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
