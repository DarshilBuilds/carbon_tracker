import { ActivityInput, MappingResult } from '@/types/emissions';

interface DemoFactor {
  activity: string;
  keywords: string[];
  factor: number;
  unit: string;
}

export const DEMO_FACTORS: DemoFactor[] = [
  { activity: 'Steel production - basic oxygen furnace', keywords: ['steel'], factor: 1.85, unit: 'kg CO2e/kg' },
  { activity: 'Electricity generation - grid average', keywords: ['electricity', 'grid power'], factor: 0.42, unit: 'kg CO2e/kWh' },
  { activity: 'Natural gas combustion - industrial', keywords: ['natural gas'], factor: 2.02, unit: 'kg CO2e/m3' },
  { activity: 'Diesel fuel combustion - mobile sources', keywords: ['diesel'], factor: 2.68, unit: 'kg CO2e/L' },
  { activity: 'Gasoline fuel combustion - mobile sources', keywords: ['gasoline', 'petrol'], factor: 2.31, unit: 'kg CO2e/L' },
  { activity: 'Concrete production - ready-mixed', keywords: ['concrete'], factor: 0.13, unit: 'kg CO2e/kg' },
  { activity: 'Aluminum production - primary', keywords: ['aluminum', 'aluminium'], factor: 8.14, unit: 'kg CO2e/kg' },
  { activity: 'Paper production - virgin fiber', keywords: ['paper'], factor: 1.09, unit: 'kg CO2e/kg' },
  { activity: 'Plastic production - general polymers', keywords: ['plastic', 'polymer'], factor: 2.53, unit: 'kg CO2e/kg' },
  { activity: 'Road freight transport - heavy truck', keywords: ['road freight', 'heavy truck'], factor: 0.21, unit: 'kg CO2e/t-km' },
  { activity: 'Air travel - short haul', keywords: ['air travel', 'short-haul flight'], factor: 0.15, unit: 'kg CO2e/passenger-km' },
  { activity: 'Rail freight transport', keywords: ['rail freight', 'rail transport'], factor: 0.03, unit: 'kg CO2e/t-km' },
  { activity: 'Water consumption - municipal supply', keywords: ['water consumption', 'municipal water'], factor: 0.34, unit: 'kg CO2e/m3' },
  { activity: 'Waste to landfill - mixed municipal', keywords: ['landfill', 'waste disposal'], factor: 0.58, unit: 'kg CO2e/kg' },
  { activity: 'Copper production - primary', keywords: ['copper'], factor: 3.83, unit: 'kg CO2e/kg' },
  { activity: 'Glass production - container glass', keywords: ['glass'], factor: 0.85, unit: 'kg CO2e/kg' },
  { activity: 'Cotton textile production', keywords: ['cotton textile', 'cotton fabric'], factor: 5.89, unit: 'kg CO2e/kg' },
  { activity: 'District heating - natural gas boiler', keywords: ['district heating', 'district heat'], factor: 0.18, unit: 'kg CO2e/kWh' },
  { activity: 'Refrigerant use - HFC leakage', keywords: ['refrigerant', 'hfc'], factor: 1430, unit: 'kg CO2e/kg' },
  { activity: 'General industrial activity', keywords: ['general industrial activity'], factor: 1.5, unit: 'kg CO2e/unit' },
];

function normalizeActivity(activity: string): string {
  return activity.toLowerCase().trim();
}

function normalizeUnit(unit: string): string {
  const normalized = unit.toLowerCase().trim().replace(/\s+/g, '').replace(/³/g, '3');
  const aliases: Record<string, string> = {
    cubicmeter: 'm3',
    cubicmeters: 'm3',
    cubicmetre: 'm3',
    cubicmetres: 'm3',
    liter: 'l',
    liters: 'l',
    litre: 'l',
    litres: 'l',
    kilogram: 'kg',
    kilograms: 'kg',
    kilowatthour: 'kwh',
    kilowatthours: 'kwh',
    passengerkilometer: 'passenger-km',
    passengerkilometers: 'passenger-km',
    passengerkilometre: 'passenger-km',
    passengerkilometres: 'passenger-km',
    tonnekilometer: 't-km',
    tonnekilometre: 't-km',
  };
  return aliases[normalized] ?? normalized;
}

export function mapDemoActivity(input: ActivityInput): MappingResult {
  const normalizedActivity = normalizeActivity(input.activityName);
  const exactMatch = DEMO_FACTORS.find(factor => normalizedActivity === factor.activity.toLowerCase());
  const match = exactMatch ?? DEMO_FACTORS.find(factor =>
    factor.keywords.some(keyword => normalizedActivity.includes(keyword))
  );
  const factor = match ?? DEMO_FACTORS[DEMO_FACTORS.length - 1];
  const expectedUnit = factor.unit.split('/').at(-1) ?? 'unit';

  if (input.unit && normalizeUnit(input.unit) !== normalizeUnit(expectedUnit)) {
    throw new Error(`${input.activityName} expects ${expectedUnit}, but the uploaded unit is ${input.unit}.`);
  }

  const confidenceScore = exactMatch ? 100 : match ? 80 : 35;

  return {
    userActivity: input.activityName,
    matchedEpaActivity: factor.activity,
    emissionFactor: factor.factor,
    emissionFactorUnit: factor.unit,
    confidenceScore,
    quantity: input.quantity,
    quantityUnit: input.unit ?? expectedUnit,
    unitAssumed: !input.unit,
    facility: input.facility,
    reportingPeriod: input.reportingPeriod,
    calculatedEmissions: Math.round(input.quantity * factor.factor * 100) / 100,
  };
}