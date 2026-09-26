import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const activities = [
  ['Steel production - basic oxygen furnace', 'kg', 18500],
  ['Electricity generation - grid average', 'kWh', 42000],
  ['Natural gas combustion - industrial', 'm3', 7600],
  ['Diesel fuel combustion - mobile sources', 'L', 1450],
  ['Gasoline fuel combustion - mobile sources', 'L', 620],
  ['Concrete production - ready-mixed', 'kg', 12000],
  ['Aluminum production - primary', 'kg', 1850],
  ['Paper production - virgin fiber', 'kg', 2700],
  ['Plastic production - general polymers', 'kg', 2300],
  ['Road freight transport - heavy truck', 't-km', 42000],
  ['Air travel - short haul', 'passenger-km', 8700],
  ['Rail freight transport', 't-km', 36000],
  ['Water consumption - municipal supply', 'm3', 5200],
  ['Waste to landfill - mixed municipal', 'kg', 920],
  ['Copper production - primary', 'kg', 540],
  ['Glass production - container glass', 'kg', 2100],
  ['Cotton textile production', 'kg', 450],
  ['District heating - natural gas boiler', 'kWh', 17500],
  ['Refrigerant use - HFC leakage', 'kg', 2.4],
  ['General industrial activity', 'unit', 640],
];

const escapeCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
const rows = ['facility,reporting_period,activity_name,quantity,unit'];

for (let facility = 1; facility <= 5; facility++) {
  for (let month = 1; month <= 10; month++) {
    for (let activityIndex = 0; activityIndex < activities.length; activityIndex++) {
      const [activityName, unit, baseQuantity] = activities[activityIndex];
      const variation = 1 + facility * 0.07 + month * 0.025 + (((facility * 7 + month * 3 + activityIndex * 11) % 9) - 4) * 0.01;
      const quantity = (baseQuantity * variation).toFixed(2);
      const period = `2025-${String(month).padStart(2, '0')}`;
      rows.push([
        `Plant ${String(facility).padStart(2, '0')}`,
        period,
        activityName,
        quantity,
        unit,
      ].map(escapeCsv).join(','));
    }
  }
}

if (rows.length !== 1001) {
  throw new Error(`Expected 1,000 data rows, generated ${rows.length - 1}`);
}

const outputPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'demo-emissions-1000.csv');
writeFileSync(outputPath, `${rows.join('\n')}\n`, 'utf8');
console.log(`Generated ${rows.length - 1} data rows at ${outputPath}`);
