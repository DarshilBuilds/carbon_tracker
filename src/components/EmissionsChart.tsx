import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MappingResult } from '@/types/emissions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { buildEmissionsChartData } from '@/lib/emissionsAnalytics';

interface EmissionsChartProps {
  results: MappingResult[];
}

const CHART_COLORS = [
  'hsl(158, 64%, 32%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(200, 80%, 45%)',
  'hsl(270, 50%, 55%)',
  'hsl(340, 65%, 47%)',
  'hsl(25, 95%, 53%)',
  'hsl(180, 60%, 40%)',
];

export function EmissionsChart({ results }: EmissionsChartProps) {
  const aggregated = buildEmissionsChartData(results);
  const sortedData = aggregated.barData.map((activity, index) => ({
      name: activity.activityName.length > 25 ? `${activity.activityName.slice(0, 25)}...` : activity.activityName,
      fullName: activity.activityName,
      emissions: activity.emissions,
      confidence: activity.confidenceScore,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  const totalEmissions = aggregated.totalEmissions;
  const pieData = aggregated.pieData.map((activity, index) => ({
      name: activity.activityName.length > 25 ? `${activity.activityName.slice(0, 25)}...` : activity.activityName,
      value: activity.percentage,
      emissions: activity.emissions,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: typeof sortedData[0] }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground text-sm">{data.fullName || data.name}</p>
          <p className="text-primary font-mono text-lg font-semibold">
            {data.emissions.toLocaleString()} kg CO₂e
          </p>
          {data.confidence > 0 && (
            <p className="text-xs text-muted-foreground">
              Match score: {data.confidence}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid min-w-0 md:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <Card className="gradient-card shadow-card min-w-0">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Emission Hotspots
          </CardTitle>
          <CardDescription>
            Top contributors to total emissions by activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                <XAxis 
                  type="number" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={150}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
                <Bar 
                  dataKey="emissions" 
                  radius={[0, 6, 6, 0]}
                  maxBarSize={40}
                >
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="gradient-card shadow-card min-w-0">
        <CardHeader>
          <CardTitle className="font-display">Emission Distribution</CardTitle>
          <CardDescription>
            Percentage breakdown of emissions by activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ value }) => `${Math.round(Number(value))}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, _name: string, props: { payload: typeof pieData[0] }) => [
                    `${props.payload.emissions.toLocaleString()} kg CO₂e (${value}%)`,
                    props.payload.name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            {pieData.map((entry, index) => (
              <div key={`${entry.name}-${index}`} className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: entry.color }} />
                <span className="truncate" title={entry.name}>{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
