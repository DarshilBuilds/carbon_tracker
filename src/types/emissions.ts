export interface ActivityInput {
  activityName: string;
  quantity: number;
  unit?: string;
  facility?: string;
  reportingPeriod?: string;
}

export interface MappingResult {
  userActivity: string;
  matchedEpaActivity: string;
  emissionFactor: number;
  emissionFactorUnit: string;
  confidenceScore: number;
  quantity: number;
  quantityUnit?: string;
  unitAssumed?: boolean;
  facility?: string;
  reportingPeriod?: string;
  calculatedEmissions: number;
}

export interface EmissionsSummary {
  totalEmissions: number;
  activityCount: number;
  avgConfidence: number;
  highConfidenceCount: number;
  lowConfidenceCount: number;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface UploadValidation {
  isValid: boolean;
  errors: ValidationError[];
  validRows: ActivityInput[];
}

export interface ApiStatus {
  isConnected: boolean;
  lastCheck: Date | null;
  baseUrl: string;
}
