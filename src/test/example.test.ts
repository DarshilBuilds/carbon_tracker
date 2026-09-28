import { describe, expect, it } from 'vitest';
import { parseCSV } from '@/lib/csvParser';
import { DEMO_FACTORS, mapDemoActivity } from '@/lib/demoMapping';
import { buildEmissionsChartData } from '@/lib/emissionsAnalytics';
import { serializeResultsCsv } from '@/lib/exportResults';

describe('parseCSV', () => {
  it('preserves optional unit and reporting metadata', () => {
    const result = parseCSV('\uFEFFfacility,reporting_period,activity_name,quantity,unit\nPlant 01,2025-01,"Steel, primary",1.25,kg');

    expect(result.isValid).toBe(true);
    expect(result.validRows).toEqual([{
      activityName: 'Steel, primary',
      quantity: 1.25,
      unit: 'kg',
      facility: 'Plant 01',
      reportingPeriod: '2025-01',
    }]);
  });

  it('rejects partially numeric and non-finite quantities', () => {
    const result = parseCSV('activity_name,quantity\nsteel production,12kg\nelectricity,Infinity');

    expect(result.isValid).toBe(false);
    expect(result.validRows).toHaveLength(0);
    expect(result.errors).toHaveLength(2);
  });

  it('maps every demo factor deterministically and preserves metadata', () => {
    const results = DEMO_FACTORS.map(factor => mapDemoActivity({
      activityName: factor.activity,
      quantity: 2,
      unit: factor.unit.split('/').at(-1),
      facility: 'Plant 01',
      reportingPeriod: '2025-01',
    }));

    expect(results.map(result => result.matchedEpaActivity)).toEqual(DEMO_FACTORS.map(factor => factor.activity));
    expect(results.every(result => result.confidenceScore === 100)).toBe(true);
    expect(results.every(result => result.facility === 'Plant 01' && result.reportingPeriod === '2025-01')).toBe(true);
  });

  it('rejects units that do not match a factor', () => {
    expect(() => mapDemoActivity({ activityName: 'diesel fuel combustion', quantity: 100, unit: 'kg' }))
      .toThrow('expects L, but the uploaded unit is kg');
  });

  it('aggregates repeated activities and accounts for all pie-chart emissions', () => {
    const results = Array.from({ length: 9 }, (_, index) => ({
      userActivity: `Activity ${index + 1}`,
      matchedEpaActivity: `Factor ${index + 1}`,
      emissionFactor: 1,
      emissionFactorUnit: 'kg CO2e/kg',
      confidenceScore: 80,
      quantity: 1,
      calculatedEmissions: 10 - index,
    }));
    results.push({ ...results[0], quantity: 5, calculatedEmissions: 5 });

    const chartData = buildEmissionsChartData(results);

    expect(chartData.totalEmissions).toBe(59);
    expect(chartData.barData).toHaveLength(8);
    expect(chartData.barData[0]).toMatchObject({ activityName: 'Activity 1', emissions: 15 });
    expect(chartData.pieData.at(-1)).toMatchObject({ activityName: 'Other activities (2)', emissions: 5 });
    expect(chartData.pieData.reduce((sum, activity) => sum + activity.percentage, 0)).toBeCloseTo(100);
  });

  it('exports units and reporting metadata as escaped CSV', () => {
    const result = mapDemoActivity({
      activityName: 'Steel, primary',
      quantity: 2,
      unit: 'kg',
      facility: 'Plant "A"',
      reportingPeriod: '2025-01',
    });
    const csv = serializeResultsCsv([result]);

    expect(csv).toContain('"facility","reporting_period","activity_name"');
    expect(csv).toContain('"Plant ""A""","2025-01","Steel, primary"');
    expect(csv).toContain('"2","kg","false"');
  });

  it('converts compatible units accurately (e.g. MWh to kWh, gal to L, Mcf to m3)', () => {
    // 2 MWh * 1000 kWh/MWh * 0.42 = 840 kg CO2e
    const electricity = mapDemoActivity({
      activityName: 'Electricity generation - grid average',
      quantity: 2,
      unit: 'MWh',
    });
    expect(electricity.calculatedEmissions).toBe(840);

    // 100 gal * 3.78541 L/gal * 2.68 = 1014.49 kg CO2e
    const diesel = mapDemoActivity({
      activityName: 'Diesel fuel combustion - mobile sources',
      quantity: 100,
      unit: 'gal',
    });
    expect(diesel.calculatedEmissions).toBeCloseTo(1014.49, 1);
  });

  it('handles direct reported emissions in Metric Tons CO2e without crashing', () => {
    const combustion = mapDemoActivity({
      activityName: 'Combustion Equipment at Onshore Petroleum Facilities',
      quantity: 542311.64,
      unit: 'Metric Tons CO2e',
    });

    expect(combustion.calculatedEmissions).toBe(542311640);
    expect(combustion.emissionFactor).toBe(1000);
    expect(combustion.confidenceScore).toBeGreaterThanOrEqual(90);
  });
});
