import { ActivityInput, ValidationError, UploadValidation } from '@/types/emissions';

const REQUIRED_COLUMNS = ['activity_name', 'quantity'];
const ALTERNATE_COLUMN_NAMES: Record<string, string[]> = {
  activity_name: ['activity_name', 'activityname', 'activity', 'name', 'description'],
  quantity: ['quantity', 'qty', 'amount', 'value'],
};
const OPTIONAL_COLUMN_NAMES: Record<string, string[]> = {
  unit: ['unit', 'units', 'uom'],
  facility: ['facility', 'site', 'plant'],
  reportingPeriod: ['reporting_period', 'reportingperiod', 'reporting_month', 'period', 'month'],
};

function normalizeColumnName(name: string): string {
  return name.toLowerCase().trim().replace(/[\s_-]+/g, '_');
}

function findColumnMapping(headers: string[]): Record<string, number> | null {
  const mapping: Record<string, number> = {};
  const normalizedHeaders = headers.map(normalizeColumnName);

  for (const [required, alternates] of Object.entries(ALTERNATE_COLUMN_NAMES)) {
    const index = normalizedHeaders.findIndex(h => alternates.includes(h));
    if (index === -1) return null;
    mapping[required] = index;
  }

  for (const [optional, alternates] of Object.entries(OPTIONAL_COLUMN_NAMES)) {
    const index = normalizedHeaders.findIndex(h => alternates.includes(h));
    if (index !== -1) mapping[optional] = index;
  }

  return mapping;
}

export function parseCSV(content: string): UploadValidation {
  const errors: ValidationError[] = [];
  const validRows: ActivityInput[] = [];

  // Handle empty file
  if (!content || content.trim().length === 0) {
    return {
      isValid: false,
      errors: [{ row: 0, field: 'file', message: 'File is empty' }],
      validRows: [],
    };
  }

  const lines = content.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  
  if (lines.length < 2) {
    return {
      isValid: false,
      errors: [{ row: 0, field: 'file', message: 'File must contain headers and at least one data row' }],
      validRows: [],
    };
  }

  // Parse headers
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const columnMapping = findColumnMapping(headers);

  if (!columnMapping) {
    return {
      isValid: false,
      errors: [{
        row: 0,
        field: 'headers',
        message: `Missing required columns. Expected: ${REQUIRED_COLUMNS.join(', ')}`,
      }],
      validRows: [],
    };
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCSVLine(line);
    const rowNum = i + 1;

    // Extract values
    const activityName = values[columnMapping.activity_name]?.trim().replace(/^["']|["']$/g, '');
    const quantityStr = values[columnMapping.quantity]?.trim().replace(/^["']|["']$/g, '');

    // Validate activity name
    if (!activityName) {
      errors.push({
        row: rowNum,
        field: 'activity_name',
        message: 'Activity name is required',
      });
      continue;
    }

    // Validate quantity
    const quantity = Number(quantityStr);
    if (!Number.isFinite(quantity)) {
      errors.push({
        row: rowNum,
        field: 'quantity',
        message: `Invalid quantity: "${quantityStr}"`,
      });
      continue;
    }

    if (quantity <= 0) {
      errors.push({
        row: rowNum,
        field: 'quantity',
        message: 'Quantity must be greater than zero',
      });
      continue;
    }

    validRows.push({
      activityName,
      quantity,
      unit: values[columnMapping.unit]?.trim() || undefined,
      facility: values[columnMapping.facility]?.trim() || undefined,
      reportingPeriod: values[columnMapping.reportingPeriod]?.trim() || undefined,
    });
  }

  return {
    isValid: validRows.length > 0,
    errors,
    validRows,
  };
}

function parseCSVLine(line: string): string[] {
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
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

export function validateFileType(file: File): boolean {
  const validTypes = ['text/csv', 'application/vnd.ms-excel'];
  const validExtensions = ['.csv'];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  
  return hasValidType || hasValidExtension;
}
