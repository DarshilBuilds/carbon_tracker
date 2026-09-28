import { MappingResult } from '@/types/emissions';

const REPORT_HEADERS = [
  'facility',
  'reporting_period',
  'activity_name',
  'zip_code',
  'quantity',
  'quantity_unit',
  'unit_assumed',
  'matched_activity',
  'emission_factor',
  'emission_factor_unit',
  'calculated_emissions_kg_co2e',
  'match_score',
];

function toCsvCell(value: string | number | boolean | undefined): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export function serializeResultsCsv(results: MappingResult[]): string {
  const rows = results.map(result => [
    result.facility,
    result.reportingPeriod,
    result.userActivity,
    result.zipCode,
    result.quantity,
    result.quantityUnit,
    result.unitAssumed ?? false,
    result.matchedEpaActivity,
    result.emissionFactor,
    result.emissionFactorUnit,
    result.calculatedEmissions,
    result.confidenceScore,
  ]);

  return `\uFEFF${[REPORT_HEADERS, ...rows].map(row => row.map(toCsvCell).join(',')).join('\r\n')}\r\n`;
}

export function downloadResultsCsv(results: MappingResult[]): void {
  const blob = new Blob([serializeResultsCsv(results)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `carbon-compass-report-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}