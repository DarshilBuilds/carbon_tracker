import { MappingResult } from '@/types/emissions';

export interface ActivityEmissionTotal {
  activityName: string;
  emissions: number;
  confidenceScore: number;
}

export interface EmissionsChartData {
  totalEmissions: number;
  barData: ActivityEmissionTotal[];
  pieData: Array<ActivityEmissionTotal & { percentage: number }>;
}

export function buildEmissionsChartData(results: MappingResult[], limit = 8): EmissionsChartData {
  const groups = new Map<string, { activityName: string; emissions: number; confidenceTotal: number; count: number }>();

  for (const result of results) {
    const key = result.userActivity.trim().toLowerCase();
    const group = groups.get(key) ?? {
      activityName: result.userActivity.trim(),
      emissions: 0,
      confidenceTotal: 0,
      count: 0,
    };
    group.emissions += result.calculatedEmissions;
    group.confidenceTotal += result.confidenceScore;
    group.count += 1;
    groups.set(key, group);
  }

  const totals = [...groups.values()]
    .map(group => ({
      activityName: group.activityName,
      emissions: group.emissions,
      confidenceScore: Math.round(group.confidenceTotal / group.count),
    }))
    .sort((left, right) => right.emissions - left.emissions);
  const totalEmissions = totals.reduce((sum, activity) => sum + activity.emissions, 0);
  const pieLimit = Math.max(1, limit - 1);
  const pieTotals = totals.slice(0, pieLimit);
  const remainder = totals.slice(pieLimit);

  if (remainder.length) {
    pieTotals.push({
      activityName: `Other activities (${remainder.length})`,
      emissions: remainder.reduce((sum, activity) => sum + activity.emissions, 0),
      confidenceScore: 0,
    });
  }

  return {
    totalEmissions,
    barData: totals.slice(0, limit),
    pieData: pieTotals.map(activity => ({
      ...activity,
      percentage: totalEmissions > 0 ? (activity.emissions / totalEmissions) * 100 : 0,
    })),
  };
}