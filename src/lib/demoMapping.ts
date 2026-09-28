import { ActivityInput, MappingResult } from '@/types/emissions';

interface DemoFactor {
  activity: string;
  keywords: string[];
  factor: number;
  unit: string;
}

export const DEMO_FACTORS: DemoFactor[] = [
  { 
    activity: 'Steel production - basic oxygen furnace', 
    keywords: ['steel', 'iron', 'furnace', 'metal production'], 
    factor: 1.85, 
    unit: 'kg CO2e/kg' 
  },
  { 
    activity: 'Electricity generation - grid average', 
    keywords: ['electricity', 'grid power', 'power', 'electric', 'kwh', 'energy prediction', 'household', 'client load', 'appliance', 'lighting', 'utility client'], 
    factor: 0.42, 
    unit: 'kg CO2e/kWh' 
  },
  { 
    activity: 'Natural gas combustion - industrial', 
    keywords: ['natural gas', 'gas combustion', 'combustion equipment', 'flare', 'flaring', 'venting', 'storage tanks', 'pneumatic devices', 'gas produced', 'onshore petroleum', 'petroleum and natural gas', 'gas plant', 'compressor station', 'gathering & boosting'], 
    factor: 2.02, 
    unit: 'kg CO2e/m3' 
  },
  { 
    activity: 'Diesel fuel combustion - mobile sources', 
    keywords: ['diesel', 'diesel fuel', 'fuel oil', 'generator', 'heavy diesel'], 
    factor: 2.68, 
    unit: 'kg CO2e/L' 
  },
  { 
    activity: 'Gasoline fuel combustion - mobile sources', 
    keywords: ['gasoline', 'petrol', 'motor gasoline', 'fleet fuel'], 
    factor: 2.31, 
    unit: 'kg CO2e/L' 
  },
  { 
    activity: 'Concrete production - ready-mixed', 
    keywords: ['concrete', 'cement', 'ready-mixed', 'masonry'], 
    factor: 0.13, 
    unit: 'kg CO2e/kg' 
  },
  { 
    activity: 'Aluminum production - primary', 
    keywords: ['aluminum', 'aluminium', 'smelting'], 
    factor: 8.14, 
    unit: 'kg CO2e/kg' 
  },
  { 
    activity: 'Paper production - virgin fiber', 
    keywords: ['paper', 'pulp', 'cardboard', 'packaging'], 
    factor: 1.09, 
    unit: 'kg CO2e/kg' 
  },
  { 
    activity: 'Plastic production - general polymers', 
    keywords: ['plastic', 'polymer', 'resin', 'polyethylene', 'polypropylene'], 
    factor: 2.53, 
    unit: 'kg CO2e/kg' 
  },
  { 
    activity: 'Road freight transport - heavy truck', 
    keywords: ['road freight', 'heavy truck', 'trucking', 'haulage', 'logistics road'], 
    factor: 0.21, 
    unit: 'kg CO2e/t-km' 
  },
  { 
    activity: 'Air travel - short haul', 
    keywords: ['air travel', 'short-haul flight', 'flight', 'airline', 'aviation'], 
    factor: 0.15, 
    unit: 'kg CO2e/passenger-km' 
  },
  { 
    activity: 'Rail freight transport', 
    keywords: ['rail freight', 'rail transport', 'train freight', 'locomotive'], 
    factor: 0.03, 
    unit: 'kg CO2e/t-km' 
  },
  { 
    activity: 'Water consumption - municipal supply', 
    keywords: ['water consumption', 'municipal water', 'tap water', 'utility water'], 
    factor: 0.34, 
    unit: 'kg CO2e/m3' 
  },
  { 
    activity: 'Waste to landfill - mixed municipal', 
    keywords: ['landfill', 'waste disposal', 'solid waste', 'refuse', 'trash', 'disposal facility'], 
    factor: 0.58, 
    unit: 'kg CO2e/kg' 
  },
  { 
    activity: 'Copper production - primary', 
    keywords: ['copper', 'copper cathode', 'mining copper'], 
    factor: 3.83, 
    unit: 'kg CO2e/kg' 
  },
  { 
    activity: 'Glass production - container glass', 
    keywords: ['glass', 'container glass', 'flat glass', 'fiberglass'], 
    factor: 0.85, 
    unit: 'kg CO2e/kg' 
  },
  { 
    activity: 'Cotton textile production', 
    keywords: ['cotton textile', 'cotton fabric', 'textile', 'fabric', 'yarn'], 
    factor: 5.89, 
    unit: 'kg CO2e/kg' 
  },
  { 
    activity: 'District heating - natural gas boiler', 
    keywords: ['district heating', 'district heat', 'steam', 'boiler heat'], 
    factor: 0.18, 
    unit: 'kg CO2e/kWh' 
  },
  { 
    activity: 'Refrigerant use - HFC leakage', 
    keywords: ['refrigerant', 'hfc', 'cooling refrigerant', 'air conditioning leak', 'chiller'], 
    factor: 1430, 
    unit: 'kg CO2e/kg' 
  },
  { 
    activity: 'General industrial activity', 
    keywords: ['general industrial activity', 'industrial', 'completions', 'workovers', 'hydraulic fracturing', 'equipment leaks', 'fugitive counts', 'pneumatic pumps', 'reciprocating compressors', 'station', 'plant', 'facility', 'direct point emitters', 'manufacturing'], 
    factor: 1.5, 
    unit: 'kg CO2e/unit' 
  },
];

const DIRECT_EMISSIONS_UNITS: Record<string, number> = {
  metrictonsco2e: 1000,
  metrictonco2e: 1000,
  metrictons: 1000,
  metricton: 1000,
  mtco2e: 1000,
  tco2e: 1000,
  tonneco2e: 1000,
  tonnesco2e: 1000,
  mt: 1000,
  tonne: 1000,
  tonnes: 1000,
  kgco2e: 1,
  kgco2: 1,
  gco2e: 0.001,
  lbco2e: 0.45359237,
};

const DIMENSIONS: Record<string, [string, number]> = {
  // Mass (base: kg)
  kg: ['mass', 1.0],
  kilogram: ['mass', 1.0],
  kilograms: ['mass', 1.0],
  g: ['mass', 0.001],
  gram: ['mass', 0.001],
  grams: ['mass', 0.001],
  mg: ['mass', 1e-6],
  t: ['mass', 1000.0],
  mt: ['mass', 1000.0],
  tonne: ['mass', 1000.0],
  tonnes: ['mass', 1000.0],
  metricton: ['mass', 1000.0],
  metrictons: ['mass', 1000.0],
  ton: ['mass', 907.18474],
  tons: ['mass', 907.18474],
  shortton: ['mass', 907.18474],
  shorttons: ['mass', 907.18474],
  lb: ['mass', 0.45359237],
  lbs: ['mass', 0.45359237],
  pound: ['mass', 0.45359237],
  pounds: ['mass', 0.45359237],
  oz: ['mass', 0.0283495],
  ounce: ['mass', 0.0283495],
  ounces: ['mass', 0.0283495],

  // Liquid Volume (base: L)
  l: ['liquid_vol', 1.0],
  liter: ['liquid_vol', 1.0],
  liters: ['liquid_vol', 1.0],
  litre: ['liquid_vol', 1.0],
  litres: ['liquid_vol', 1.0],
  ml: ['liquid_vol', 0.001],
  milliliter: ['liquid_vol', 0.001],
  milliliters: ['liquid_vol', 0.001],
  gal: ['liquid_vol', 3.78541],
  gallon: ['liquid_vol', 3.78541],
  gallons: ['liquid_vol', 3.78541],
  bbl: ['liquid_vol', 158.9873],
  barrel: ['liquid_vol', 158.9873],
  barrels: ['liquid_vol', 158.9873],
  barrelsbbl: ['liquid_vol', 158.9873],
  mbbl: ['liquid_vol', 158987.3],

  // Gas Volume (base: m3)
  m3: ['gas_vol', 1.0],
  cubicmeter: ['gas_vol', 1.0],
  cubicmeters: ['gas_vol', 1.0],
  cubicmetre: ['gas_vol', 1.0],
  cubicmetres: ['gas_vol', 1.0],
  scf: ['gas_vol', 0.0283168],
  cf: ['gas_vol', 0.0283168],
  cubicfeet: ['gas_vol', 0.0283168],
  ccf: ['gas_vol', 2.83168],
  kcf: ['gas_vol', 28.3168],
  mcf: ['gas_vol', 28.3168],
  mcfthousandscf: ['gas_vol', 28.3168],
  mmcf: ['gas_vol', 28316.8],
  bcf: ['gas_vol', 28316800.0],

  // Energy (base: kWh)
  kwh: ['energy', 1.0],
  kilowatthour: ['energy', 1.0],
  kilowatthours: ['energy', 1.0],
  wh: ['energy', 0.001],
  watthour: ['energy', 0.001],
  watthours: ['energy', 0.001],
  mwh: ['energy', 1000.0],
  megawatthour: ['energy', 1000.0],
  megawatthours: ['energy', 1000.0],
  gwh: ['energy', 1000000.0],
  gigawatthour: ['energy', 1000000.0],
  mj: ['energy', 0.277778],
  megajoule: ['energy', 0.277778],
  megajoules: ['energy', 0.277778],
  gj: ['energy', 277.778],
  gigajoule: ['energy', 277.778],
  gigajoules: ['energy', 277.778],
  btu: ['energy', 0.000293071],
  mmbtu: ['energy', 293.071],
  therm: ['energy', 29.3001],
  therms: ['energy', 29.3001],

  // Transport
  't-km': ['transport_freight', 1.0],
  'tonne-km': ['transport_freight', 1.0],
  'ton-mile': ['transport_freight', 1.45997],
  'ton-miles': ['transport_freight', 1.45997],
  'passenger-km': ['transport_pass', 1.0],
  'passengerkilometer': ['transport_pass', 1.0],
  'passenger-mile': ['transport_pass', 1.60934],
  'passengermile': ['transport_pass', 1.60934],
  'p-km': ['transport_pass', 1.0],
  'pkm': ['transport_pass', 1.0],

  // Count / General
  unit: ['count', 1.0],
  units: ['count', 1.0],
  ea: ['count', 1.0],
  each: ['count', 1.0],
  count: ['count', 1.0],
  pcs: ['count', 1.0],
  pieces: ['count', 1.0],
  item: ['count', 1.0],
  items: ['count', 1.0],
  device: ['count', 1.0],
  devices: ['count', 1.0],
  well: ['count', 1.0],
  wells: ['count', 1.0],
  pump: ['count', 1.0],
  pumps: ['count', 1.0],
  compressor: ['count', 1.0],
  compressors: ['count', 1.0],
};

function normalizeActivity(activity: string): string {
  return activity.toLowerCase().trim();
}

function cleanUnit(unit: string): string {
  return unit
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/³/g, '3')
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '');
}

function isDirectEmissionsUnit(unit?: string): boolean {
  if (!unit) return false;
  const c = cleanUnit(unit);
  return c in DIRECT_EMISSIONS_UNITS || c.includes('co2') || c.includes('co2e') || c.includes('ghg');
}

function getDirectEmissionsMultiplier(unit: string): number {
  const c = cleanUnit(unit);
  return DIRECT_EMISSIONS_UNITS[c] ?? (c.includes('ton') || c.includes('mt') || c.includes('t') ? 1000 : 1);
}

function convertQuantity(quantity: number, fromUnit: string, toUnit: string): { quantity: number; success: boolean } {
  const cFrom = cleanUnit(fromUnit);
  const cTo = cleanUnit(toUnit);

  if (cFrom === cTo) {
    return { quantity, success: true };
  }

  if (cFrom in DIMENSIONS && cTo in DIMENSIONS) {
    const [dimFrom, multFrom] = DIMENSIONS[cFrom];
    const [dimTo, multTo] = DIMENSIONS[cTo];
    if (dimFrom === dimTo) {
      return { quantity: quantity * (multFrom / multTo), success: true };
    }
  }

  return { quantity, success: false };
}

export interface MapOptions {
  strict?: boolean;
}

export function mapDemoActivity(input: ActivityInput, options: MapOptions = { strict: true }): MappingResult {
  const normalizedActivity = normalizeActivity(input.activityName);
  const exactMatch = DEMO_FACTORS.find(factor => normalizedActivity === factor.activity.toLowerCase());
  const match = exactMatch ?? DEMO_FACTORS.find(factor =>
    factor.keywords.some(keyword => normalizedActivity.includes(keyword))
  );
  const factor = match ?? DEMO_FACTORS[DEMO_FACTORS.length - 1];
  const expectedUnit = factor.unit.split('/').at(-1) ?? 'unit';

  // 1. Direct emissions input (e.g. Metric Tons CO2e, kg CO2e)
  if (input.unit && isDirectEmissionsUnit(input.unit)) {
    const multiplier = getDirectEmissionsMultiplier(input.unit);
    const calculatedEmissions = Math.round(input.quantity * multiplier * 100) / 100;

    return {
      userActivity: input.activityName,
      matchedEpaActivity: `${factor.activity} (Direct GHG Emissions)`,
      emissionFactor: multiplier,
      emissionFactorUnit: `kg CO2e/${input.unit}`,
      confidenceScore: exactMatch ? 100 : 90,
      quantity: input.quantity,
      quantityUnit: input.unit,
      unitAssumed: false,
      facility: input.facility,
      reportingPeriod: input.reportingPeriod,
      zipCode: input.zipCode,
      calculatedEmissions,
    };
  }

  // 2. Standard activity with unit conversion
  let effectiveQuantity = input.quantity;
  let unitAssumed = !input.unit;

  if (input.unit) {
    const { quantity: converted, success } = convertQuantity(input.quantity, input.unit, expectedUnit);
    if (!success) {
      // Check if another factor in DEMO_FACTORS matches this activity and accepts the input unit
      const candidateFactors = DEMO_FACTORS.filter(f => {
        const factorUnit = f.unit.split('/').at(-1) ?? 'unit';
        return convertQuantity(input.quantity, input.unit!, factorUnit).success;
      });

      const altFactorMatch = candidateFactors.find(f =>
        f.keywords.some(keyword => normalizedActivity.includes(keyword))
      );

      if (altFactorMatch) {
        const altExpectedUnit = altFactorMatch.unit.split('/').at(-1) ?? 'unit';
        const { quantity: altConverted } = convertQuantity(input.quantity, input.unit, altExpectedUnit);
        return {
          userActivity: input.activityName,
          matchedEpaActivity: altFactorMatch.activity,
          emissionFactor: altFactorMatch.factor,
          emissionFactorUnit: altFactorMatch.unit,
          confidenceScore: 75,
          quantity: input.quantity,
          quantityUnit: input.unit,
          unitAssumed: false,
          facility: input.facility,
          reportingPeriod: input.reportingPeriod,
          zipCode: input.zipCode,
          calculatedEmissions: Math.round(altConverted * altFactorMatch.factor * 100) / 100,
        };
      }

      if (options.strict) {
        throw new Error(`Activity "${input.activityName}" expects ${expectedUnit}, but the uploaded unit is ${input.unit}`);
      }

      // Graceful non-strict fallback
      unitAssumed = true;
    } else {
      effectiveQuantity = converted;
    }
  }

  const confidenceScore = exactMatch ? 100 : match ? 80 : unitAssumed ? 40 : 35;

  return {
    userActivity: input.activityName,
    matchedEpaActivity: factor.activity,
    emissionFactor: factor.factor,
    emissionFactorUnit: factor.unit,
    confidenceScore,
    quantity: input.quantity,
    quantityUnit: input.unit ?? expectedUnit,
    unitAssumed,
    facility: input.facility,
    reportingPeriod: input.reportingPeriod,
    zipCode: input.zipCode,
    calculatedEmissions: Math.round(effectiveQuantity * factor.factor * 100) / 100,
  };
}

/**
 * Safe version of mapDemoActivity that will NEVER throw an exception,
 * ensuring seamless user uploads without application crashes.
 */
export function safeMapDemoActivity(input: ActivityInput): MappingResult {
  try {
    return mapDemoActivity(input, { strict: false });
  } catch (err: any) {
    // Ultimate fallback if any unexpected error occurs
    return {
      userActivity: input.activityName || 'Unspecified Activity',
      matchedEpaActivity: 'General industrial activity (Assumed)',
      emissionFactor: 1.5,
      emissionFactorUnit: 'kg CO2e/unit',
      confidenceScore: 25,
      quantity: input.quantity || 1,
      quantityUnit: input.unit || 'unit',
      unitAssumed: true,
      facility: input.facility,
      reportingPeriod: input.reportingPeriod,
      zipCode: input.zipCode,
      calculatedEmissions: Math.round((input.quantity || 1) * 1.5 * 100) / 100,
    };
  }
}