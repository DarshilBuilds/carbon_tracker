import { ActivityInput, ValidationError, UploadValidation } from '@/types/emissions';

const ACTIVITY_ALIASES = [
  'activity_name',
  'activityname',
  'activity',
  'item_name',
  'itemname',
  'item',
  'industry_type_sectors',
  'industry_sector',
  'industry_type',
  'source_name',
  'sourcename',
  'emission_source',
  'emissions_source',
  'process_name',
  'process',
  'operation',
  'fuel_type',
  'fuel',
  'equipment',
  'primary_naics_title',
  'naics_title',
  'category',
  'description',
  'name',
  'source',
  'industry_type_subparts',
  'subpart',
];

const QUANTITY_ALIASES = [
  'quantity',
  'qty',
  'amount',
  'value',
  'quantity_or_value',
  'reading',
  'usage',
  'volume',
  'consumption',
  'total_reported_direct_emissions',
  'total_reported_emissions',
  'reported_emissions',
  'direct_emissions',
  'total_emissions',
  'total_co2e_mt',
  'total_co2e',
  'co2_emissions_non_biogenic',
  'co2_emissions',
  'co2e',
  'metric_tons_co2e',
  'mt_co2e',
  'ghg_emissions',
  'ghg_quantity',
  'emissions',
  'emissions_mt',
  'carbon_emissions',
  'calculated_emissions',
];

const UNIT_ALIASES = [
  'unit',
  'units',
  'uom',
  'unit_or_uom',
  'unit_of_measure',
  'measurement_unit',
  'measure',
];

const FACILITY_ALIASES = [
  'facility',
  'facility_name',
  'facilityname',
  'site',
  'site_name',
  'plant',
  'plant_name',
  'location',
  'reporting_entity',
  'parent_company',
  'company',
];

const PERIOD_ALIASES = [
  'reporting_period',
  'reportingperiod',
  'reporting_month',
  'reporting_year',
  'reportingyear',
  'period',
  'month',
  'year',
  'date',
  'timestamp',
  'quarter',
];

const DATA_SECTION_ALIASES = [
  'data_section',
  'datasection',
  'section',
];

const ZIP_CODE_ALIASES = [
  'zip_code',
  'zipcode',
  'zip',
  'postal_code',
  'postalcode',
  'postal',
  'post_code',
  'postcode',
];

const ADDRESS_ALIASES = [
  'address',
  'facility_site_address',
  'facility_address',
  'site_address',
  'street_address',
  'location_address',
];

export function normalizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '_');
}

export function detectDelimiter(content: string): string {
  const lines = content.replace(/^\uFEFF/, '').trim().split(/\r?\n/).slice(0, 15);
  const candidates = [',', ';', '\t', '|'];
  const scores: Record<string, number> = { ',': 0, ';': 0, '\t': 0, '|': 0 };

  for (const delim of candidates) {
    let countInFirst = -1;
    let consistent = true;
    let totalCount = 0;

    for (const line of lines) {
      if (!line.trim()) continue;
      const count = line.split(delim).length - 1;
      totalCount += count;
      if (countInFirst === -1) {
        countInFirst = count;
      } else if (Math.abs(count - countInFirst) > 2) {
        consistent = false;
      }
    }

    if (countInFirst > 0 && consistent) {
      scores[delim] = totalCount * 2;
    } else if (countInFirst > 0) {
      scores[delim] = totalCount;
    }
  }

  let best = ',';
  let maxScore = 0;
  for (const [delim, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      best = delim;
    }
  }

  return best;
}

export function parseCSVLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && !inQuotes) {
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      if (line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = false;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

export function parseNumericValue(raw: unknown): number | null {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }
  if (typeof raw !== 'string') return null;

  let cleaned = raw.trim();
  if (
    !cleaned ||
    cleaned === '-' ||
    cleaned === '--' ||
    cleaned.toLowerCase() === 'n/a' ||
    cleaned.toLowerCase() === 'null' ||
    cleaned.toLowerCase() === 'none'
  ) {
    return null;
  }

  // Remove surrounding quotes
  cleaned = cleaned.replace(/^["']|["']$/g, '').trim();

  // Remove currency and spaces
  cleaned = cleaned.replace(/[$€£¥\s]/g, '');

  // Handle thousand separators and decimals
  if (cleaned.includes(',') && cleaned.includes('.')) {
    const lastComma = cleaned.lastIndexOf(',');
    const lastPeriod = cleaned.lastIndexOf('.');
    if (lastComma < lastPeriod) {
      cleaned = cleaned.replace(/,/g, '');
    } else {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    }
  } else if (cleaned.includes(',') && !cleaned.includes('.')) {
    if (/^\d{1,3}(,\d{3})+$/.test(cleaned)) {
      cleaned = cleaned.replace(/,/g, '');
    } else if (/^\d+,\d{1,2}$/.test(cleaned)) {
      cleaned = cleaned.replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  }

  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

export function cleanZipCode(raw: unknown): string | undefined {
  if (raw === null || raw === undefined) return undefined;
  let str = String(raw).trim();
  if (
    !str ||
    str === '-' ||
    str === '--' ||
    str.toLowerCase() === 'n/a' ||
    str.toLowerCase() === 'null' ||
    str.toLowerCase() === 'none'
  ) {
    return undefined;
  }

  // Handle floats from Excel exports like 79355.0
  str = str.replace(/\.0+$/, '');

  // Strip non-alphanumeric except hyphen
  str = str.replace(/[^A-Za-z0-9-]/g, '');

  // Pad 3-4 digit US zip codes that lost leading zeros (e.g. 1234 -> 01234)
  if (/^\d{3,4}$/.test(str)) {
    str = str.padStart(5, '0');
  }

  // Common US 5-digit or zip+4, or alphanumeric postal code
  if (/^\d{5}(-\d{4})?$/.test(str) || /^[A-Za-z0-9]{3,10}$/.test(str)) {
    return str;
  }

  return str.length >= 3 && str.length <= 10 ? str : undefined;
}

interface ColumnMapping {
  activity_name: number;
  quantity: number;
  unit?: number;
  facility?: number;
  reportingPeriod?: number;
  zipCode?: number;
  address?: number;
  dataSection?: number;
  inferredUnit?: string;
}

function findHeaderRow(
  lines: string[],
  delimiter: string
): { headerIndex: number; mapping: ColumnMapping } | null {
  const maxScan = Math.min(lines.length, 30);
  let bestResult: { headerIndex: number; mapping: ColumnMapping; score: number } | null = null;

  for (let i = 0; i < maxScan; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#') || line.startsWith('//')) continue;

    const rawHeaders = parseCSVLine(line, delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
    if (rawHeaders.length < 2) continue;

    const normalizedHeaders = rawHeaders.map(normalizeColumnName);

    // 1. Check for quantity column
    let quantityIdx = -1;
    let isEmissionsColumn = false;

    // First try exact matches in QUANTITY_ALIASES
    for (let colIdx = 0; colIdx < normalizedHeaders.length; colIdx++) {
      const h = normalizedHeaders[colIdx];
      if (QUANTITY_ALIASES.includes(h)) {
        quantityIdx = colIdx;
        isEmissionsColumn = h.includes('emission') || h.includes('co2');
        break;
      }
    }

    // Secondary search for quantity if not found
    if (quantityIdx === -1) {
      for (let colIdx = 0; colIdx < normalizedHeaders.length; colIdx++) {
        const h = normalizedHeaders[colIdx];
        if (
          h.startsWith('total_reported_emissions') ||
          h.includes('reported_emissions') ||
          h.includes('total_emissions') ||
          h.includes('co2e')
        ) {
          quantityIdx = colIdx;
          isEmissionsColumn = true;
          break;
        }
      }
    }

    if (quantityIdx === -1) continue;

    // 2. Check for activity column (match by alias priority order so meaningful names take precedence over subpart codes)
    let activityIdx = -1;

    for (const alias of ACTIVITY_ALIASES) {
      const idx = normalizedHeaders.findIndex((h, cIdx) => cIdx !== quantityIdx && h === alias);
      if (idx !== -1) {
        activityIdx = idx;
        break;
      }
    }

    // Secondary fallback: partial match if no exact alias matched
    if (activityIdx === -1) {
      for (const alias of ACTIVITY_ALIASES) {
        const idx = normalizedHeaders.findIndex((h, cIdx) => cIdx !== quantityIdx && (h.includes(alias) || alias.includes(h)));
        if (idx !== -1) {
          activityIdx = idx;
          break;
        }
      }
    }

    // 3. Optional columns
    let unitIdx: number | undefined;
    for (let colIdx = 0; colIdx < normalizedHeaders.length; colIdx++) {
      const h = normalizedHeaders[colIdx];
      if (colIdx !== quantityIdx && colIdx !== activityIdx && UNIT_ALIASES.includes(h)) {
        unitIdx = colIdx;
        break;
      }
    }

    let facilityIdx: number | undefined;
    for (let colIdx = 0; colIdx < normalizedHeaders.length; colIdx++) {
      const h = normalizedHeaders[colIdx];
      if (colIdx !== quantityIdx && FACILITY_ALIASES.includes(h)) {
        facilityIdx = colIdx;
        break;
      }
    }

    let reportingPeriodIdx: number | undefined;
    for (let colIdx = 0; colIdx < normalizedHeaders.length; colIdx++) {
      const h = normalizedHeaders[colIdx];
      if (colIdx !== quantityIdx && PERIOD_ALIASES.includes(h)) {
        reportingPeriodIdx = colIdx;
        break;
      }
    }

    let zipCodeIdx: number | undefined;
    for (let colIdx = 0; colIdx < normalizedHeaders.length; colIdx++) {
      const h = normalizedHeaders[colIdx];
      if (colIdx !== quantityIdx && colIdx !== activityIdx && ZIP_CODE_ALIASES.includes(h)) {
        zipCodeIdx = colIdx;
        break;
      }
    }

    let addressIdx: number | undefined;
    for (let colIdx = 0; colIdx < normalizedHeaders.length; colIdx++) {
      const h = normalizedHeaders[colIdx];
      if (colIdx !== quantityIdx && colIdx !== activityIdx && ADDRESS_ALIASES.includes(h)) {
        addressIdx = colIdx;
        break;
      }
    }

    let dataSectionIdx: number | undefined;
    for (let colIdx = 0; colIdx < normalizedHeaders.length; colIdx++) {
      const h = normalizedHeaders[colIdx];
      if (DATA_SECTION_ALIASES.includes(h)) {
        dataSectionIdx = colIdx;
        break;
      }
    }

    // If activity column not found, but facility exists and this is an emissions report:
    // the facility name or industry can act as the activity
    if (activityIdx === -1 && facilityIdx !== undefined) {
      activityIdx = facilityIdx;
    }

    if (activityIdx === -1) continue;

    // Calculate confidence score for this candidate header row
    let score = 50;
    if (normalizedHeaders.includes('activity_name') || normalizedHeaders.includes('item_name')) score += 30;
    if (normalizedHeaders.includes('quantity') || normalizedHeaders.includes('quantity_or_value')) score += 30;
    if (isEmissionsColumn) score += 20;
    if (unitIdx !== undefined) score += 15;
    if (facilityIdx !== undefined) score += 10;
    if (zipCodeIdx !== undefined) score += 10;
    if (reportingPeriodIdx !== undefined) score += 10;

    // Inferred unit for EPA reports without unit column
    const inferredUnit = unitIdx === undefined && isEmissionsColumn ? 'Metric Tons CO2e' : undefined;

    if (!bestResult || score > bestResult.score) {
      bestResult = {
        headerIndex: i,
        mapping: {
          activity_name: activityIdx,
          quantity: quantityIdx,
          unit: unitIdx,
          facility: facilityIdx,
          reportingPeriod: reportingPeriodIdx,
          zipCode: zipCodeIdx,
          address: addressIdx,
          dataSection: dataSectionIdx,
          inferredUnit,
        },
        score,
      };
    }
  }

  return bestResult ? { headerIndex: bestResult.headerIndex, mapping: bestResult.mapping } : null;
}

export function parseCSV(content: string, filename?: string): UploadValidation {
  const errors: ValidationError[] = [];
  const validRows: ActivityInput[] = [];

  const fallbackYear = filename ? filename.match(/\b(19\d{2}|20\d{2})\b/)?.[1] : undefined;

  if (!content || content.trim().length === 0) {
    return {
      isValid: false,
      errors: [{ row: 0, field: 'file', message: 'File is empty' }],
      validRows: [],
    };
  }

  const rawLines = content.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (rawLines.length < 2) {
    return {
      isValid: false,
      errors: [{ row: 0, field: 'file', message: 'File must contain headers and at least one data row' }],
      validRows: [],
    };
  }

  const delimiter = detectDelimiter(content);
  const headerMatch = findHeaderRow(rawLines, delimiter);

  if (!headerMatch) {
    return {
      isValid: false,
      errors: [{
        row: 0,
        field: 'headers',
        message: 'Could not find required columns (activity/name and quantity/emissions) in uploaded spreadsheet',
      }],
      validRows: [],
    };
  }

  const { headerIndex, mapping: columnMapping } = headerMatch;

  // Check if this is an EPA Subpart W or multi-section filing with EMISSIONS_SOURCE section
  const hasEmissionsSourceSection =
    columnMapping.dataSection !== undefined &&
    rawLines.slice(headerIndex + 1).some(l => {
      const vals = parseCSVLine(l, delimiter);
      return vals[columnMapping.dataSection!]?.trim().toUpperCase() === 'EMISSIONS_SOURCE';
    });

  for (let i = headerIndex + 1; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line, delimiter);
    const rowNum = i + 1;

    // Filter multi-section EPA files for EMISSIONS_SOURCE section
    if (hasEmissionsSourceSection) {
      const section = values[columnMapping.dataSection!]?.trim().toUpperCase();
      if (section !== 'EMISSIONS_SOURCE') {
        continue;
      }
    }

    const rawActivity = values[columnMapping.activity_name]?.trim().replace(/^["']|["']$/g, '');
    const rawQuantity = values[columnMapping.quantity]?.trim().replace(/^["']|["']$/g, '');

    // Skip rollup total lines to avoid double-counting
    if (
      rawActivity &&
      (rawActivity.toLowerCase().startsWith('total facility') ||
        rawActivity.toLowerCase() === 'total emissions' ||
        rawActivity.toLowerCase() === 'facility total' ||
        rawActivity.toLowerCase() === 'total' ||
        rawActivity.toLowerCase() === 'sum')
    ) {
      continue;
    }

    if (!rawActivity) {
      // If activity is blank, skip line silently
      continue;
    }

    const quantity = parseNumericValue(rawQuantity);
    if (quantity === null) {
      // Only record error if there was actually non-numeric content rather than just empty cell
      if (rawQuantity && rawQuantity.trim() !== '') {
        errors.push({
          row: rowNum,
          field: 'quantity',
          message: `Invalid quantity: "${rawQuantity}"`,
        });
      }
      continue;
    }

    if (quantity <= 0) {
      // In emissions reporting files, 0-value lines are skipped silently without error clutter
      continue;
    }

    // Extract unit: from column, or inferred from emissions header, or extracted from activity
    let unit = values[columnMapping.unit]?.trim() || columnMapping.inferredUnit || undefined;
    if (!unit) {
      const unitInParens = rawActivity.match(/\(([^)]+)\)|\[([^\]]+)\]/);
      if (unitInParens) {
        unit = (unitInParens[1] || unitInParens[2]).trim();
      }
    }

    const facility =
      columnMapping.facility !== undefined
        ? values[columnMapping.facility]?.trim()
        : undefined;

    const reportingPeriod =
      columnMapping.reportingPeriod !== undefined
        ? values[columnMapping.reportingPeriod]?.trim()
        : fallbackYear;

    let zipCode =
      columnMapping.zipCode !== undefined
        ? cleanZipCode(values[columnMapping.zipCode])
        : undefined;

    // If direct zipCode was not found, check address column for a 5-digit zip code
    if (!zipCode && columnMapping.address !== undefined) {
      const addr = values[columnMapping.address];
      const match = addr ? addr.match(/\b(\d{5}(?:-\d{4})?)\b/) : null;
      if (match) {
        zipCode = cleanZipCode(match[1]);
      }
    }

    validRows.push({
      activityName: rawActivity,
      quantity,
      unit: unit || undefined,
      facility: facility || undefined,
      reportingPeriod: reportingPeriod || undefined,
      zipCode: zipCode || undefined,
    });
  }

  return {
    isValid: validRows.length > 0,
    errors,
    validRows,
  };
}

export function validateFileType(file: File): boolean {
  const validExtensions = ['.csv', '.tsv', '.txt', '.xlsx', '.xls'];
  const name = file.name.toLowerCase();
  if (validExtensions.some(ext => name.endsWith(ext))) {
    return true;
  }

  const validTypes = [
    'text/csv',
    'text/plain',
    'text/tab-separated-values',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  return validTypes.includes(file.type);
}
