import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { parseCSV, detectDelimiter } from '@/lib/csvParser';
import { mapDemoActivity, safeMapDemoActivity } from '@/lib/demoMapping';
import { buildEmissionsChartData } from '@/lib/emissionsAnalytics';

describe('Complete Dataset and Format Robustness Tests', () => {
  const demoDataDir = fs.existsSync(path.resolve(__dirname, '../../../demo_data'))
    ? path.resolve(__dirname, '../../../demo_data')
    : path.resolve(__dirname, '../../public/demo-data');
  const otherDemoDataDir = fs.existsSync(path.resolve(__dirname, '../../../Other_Demo_Data'))
    ? path.resolve(__dirname, '../../../Other_Demo_Data')
    : path.resolve(__dirname, '../../public/demo-data');
  const spreadsheetsDir = path.join(demoDataDir, '2023_data_summary_spreadsheets');

  it('successfully processes civitas_permian_basin_2023_carbon_compass.csv', () => {
    const content = fs.readFileSync(path.join(demoDataDir, 'civitas_permian_basin_2023_carbon_compass.csv'), 'utf-8');
    const result = parseCSV(content);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(8);
    const mapped = result.validRows.map(safeMapDemoActivity);
    expect(mapped.length).toBe(8);
    expect(mapped.every(r => r.calculatedEmissions > 0)).toBe(true);
  });

  
  it('successfully processes civitas_permian_basin_2023_all_data.csv', () => {
    const content = fs.readFileSync(path.join(demoDataDir, 'civitas_permian_basin_2023_all_data.csv'), 'utf-8');
    const result = parseCSV(content);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(8);
    const mapped = result.validRows.map(safeMapDemoActivity);
    expect(mapped.length).toBe(8);
    expect(mapped.every(r => r.calculatedEmissions > 0)).toBe(true);
  });

  it('successfully processes real-appliance-electricity-1500.csv', () => {
    const content = fs.readFileSync(path.join(demoDataDir, 'real-appliance-electricity-1500.csv'), 'utf-8');
    const result = parseCSV(content);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(1500);
    const mapped = result.validRows.map(safeMapDemoActivity);
    expect(mapped.length).toBe(1500);
  });

  it('successfully processes real-client-load-1500.csv', () => {
    const content = fs.readFileSync(path.join(demoDataDir, 'real-client-load-1500.csv'), 'utf-8');
    const result = parseCSV(content);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(1500);
    const mapped = result.validRows.map(safeMapDemoActivity);
    expect(mapped.length).toBe(1500);
  });

  it('successfully processes real-household-electricity-1500.csv', () => {
    const content = fs.readFileSync(path.join(demoDataDir, 'real-household-electricity-1500.csv'), 'utf-8');
    const result = parseCSV(content);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(1500);
    const mapped = result.validRows.map(safeMapDemoActivity);
    expect(mapped.length).toBe(1500);
  });

  it('successfully processes demo-emissions-1000.csv', () => {
    const content = fs.readFileSync(path.join(otherDemoDataDir, 'demo-emissions-1000.csv'), 'utf-8');
    const result = parseCSV(content);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(1000);
    const mapped = result.validRows.map(safeMapDemoActivity);
    expect(mapped.length).toBe(1000);
    const chart = buildEmissionsChartData(mapped);
    expect(chart.barData[0].activityName).toBe('Steel production - basic oxygen furnace');
  });

  it('successfully processes plant_monthly_activities_300.csv', () => {
    const content = fs.readFileSync(path.join(otherDemoDataDir, 'plant_monthly_activities_300.csv'), 'utf-8');
    const result = parseCSV(content);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(300);
    const mapped = result.validRows.map(safeMapDemoActivity);
    expect(mapped.length).toBe(300);
    expect(mapped.every(r => r.calculatedEmissions > 0)).toBe(true);
    expect(mapped.every(r => !!r.zipCode)).toBe(true);
    const chart = buildEmissionsChartData(mapped);
    expect(chart.barData[0].activityName).toBe('Natural gas combustion - industrial');
  });

  it('successfully processes plant_monthly_activities_1000.csv', () => {
    const content = fs.readFileSync(path.join(otherDemoDataDir, 'plant_monthly_activities_1000.csv'), 'utf-8');
    const result = parseCSV(content);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(1000);
    const mapped = result.validRows.map(safeMapDemoActivity);
    expect(mapped.length).toBe(1000);
    expect(mapped.every(r => r.calculatedEmissions > 0)).toBe(true);
    expect(mapped.every(r => !!r.zipCode)).toBe(true);
    const chart = buildEmissionsChartData(mapped);
    expect(chart.barData[0].activityName).toBe('Aluminum production - primary');
  });

  it('successfully parses EPA summary spreadsheet exported to CSV with title/comment rows at top', () => {
    const sampleCsv = path.join(__dirname, 'fixtures/sample_ghgp_direct_point_emitters.csv');
    if (fs.existsSync(sampleCsv)) {
      const content = fs.readFileSync(sampleCsv, 'utf-8');
      const result = parseCSV(content);
      expect(result.isValid).toBe(true);
      expect(result.validRows.length).toBeGreaterThan(0);
      const mapped = result.validRows.map(safeMapDemoActivity);
      expect(mapped.length).toBe(result.validRows.length);
      // Emissions should be calculated as direct emissions (Metric Tons CO2e * 1000)
      expect(mapped[0].calculatedEmissions).toBeGreaterThan(0);
    }
  });

  it('successfully reads and processes ghgp_data_2023.xlsx directly', () => {
    const xlsxPath = path.join(spreadsheetsDir, 'ghgp_data_2023.xlsx');
    if (fs.existsSync(xlsxPath)) {
      const workbook = XLSX.readFile(xlsxPath);
      // Pick first non-FAQ sheet
      const sheetName = workbook.SheetNames.find(n => !n.toLowerCase().includes('faq')) || workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const csvContent = XLSX.utils.sheet_to_csv(sheet);
      
      const result = parseCSV(csvContent);
      expect(result.isValid).toBe(true);
      expect(result.validRows.length).toBeGreaterThan(100);
      
      // Test sample of rows for mapping
      const sampleMapped = result.validRows.slice(0, 50).map(safeMapDemoActivity);
      expect(sampleMapped.length).toBe(50);
      expect(sampleMapped.every(r => r.calculatedEmissions > 0)).toBe(true);
    }
  }, 45000);

  it('auto-detects semicolon delimiters commonly used in European CSVs', () => {
    const semicolonCsv = `facility;reporting_period;activity_name;quantity;unit\nPlant Alpha;2024-Q1;Natural gas combustion;1250,5;m3\nPlant Beta;2024-Q1;Electricity grid;4500;kWh`;
    expect(detectDelimiter(semicolonCsv)).toBe(';');
    const result = parseCSV(semicolonCsv);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(2);
    expect(result.validRows[0].activityName).toBe('Natural gas combustion');
    expect(result.validRows[0].quantity).toBe(1250.5);
  });

  it('auto-detects tab delimiters in TSV files', () => {
    const tsvContent = `activity_name\tquantity\tunit\nDiesel fuel\t500\tL\nElectricity\t2500\tkWh`;
    expect(detectDelimiter(tsvContent)).toBe('\t');
    const result = parseCSV(tsvContent);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(2);
  });

  it('cleans formatted numbers with thousand commas and currency signs', () => {
    const csv = `activity_name,quantity,unit\nSteel production,"1,250,000",kg\nElectricity,"$ 45,500.75",kWh`;
    const result = parseCSV(csv);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(2);
    expect(result.validRows[0].quantity).toBe(1250000);
    expect(result.validRows[1].quantity).toBe(45500.75);
  });

  it('skips non-data metadata/comment rows before the actual table header', () => {
    const csvWithNotes = `
# Annual Environmental Compliance Data
# Prepared for Department of Energy
# Units: Metric Tons CO2e
Facility Name,Total reported direct emissions
Alpha Gas Plant,"45,200.5"
Beta Power Station,"120,400.0"
`;
    const result = parseCSV(csvWithNotes);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(2);
    expect(result.validRows[0].facility).toBe('Alpha Gas Plant');
    expect(result.validRows[0].quantity).toBe(45200.5);
    expect(result.validRows[0].unit).toBe('Metric Tons CO2e');
  });

  it('safeMapDemoActivity gracefully handles unknown units without crashing', () => {
    const row = {
      activityName: 'Custom Unrecognized Process',
      quantity: 50,
      unit: 'exotic_unit',
    };
    // Should never throw
    const mapped = safeMapDemoActivity(row);
    expect(mapped).toBeDefined();
    expect(mapped.unitAssumed).toBe(true);
    expect(mapped.calculatedEmissions).toBeGreaterThan(0);
  });

  it('correctly parses and cleans various zip code formats', () => {
    const csvWithZips = `Facility Name,Zip Code,Activity,Quantity,Unit
30-30 Gas Plant,79355,Natural gas,100,m3
East Coast Facility,1234,Electricity,500,kWh
Midwest Station,79355.0,Diesel,200,L
Metro Site,90210-1234,Combustion,150,kg
Remote Post,-,Natural gas,50,m3`;

    const result = parseCSV(csvWithZips);
    expect(result.isValid).toBe(true);
    expect(result.validRows.length).toBe(5);
    expect(result.validRows[0].zipCode).toBe('79355');
    expect(result.validRows[1].zipCode).toBe('01234'); // Padded to 5 digits
    expect(result.validRows[2].zipCode).toBe('79355'); // .0 removed
    expect(result.validRows[3].zipCode).toBe('90210-1234'); // zip+4 preserved
    expect(result.validRows[4].zipCode).toBeUndefined(); // dash handled

    // Ensure safeMapDemoActivity preserves zipCode
    const mapped = result.validRows.map(safeMapDemoActivity);
    expect(mapped[0].zipCode).toBe('79355');
    expect(mapped[1].zipCode).toBe('01234');
    expect(mapped[2].zipCode).toBe('79355');
  });
});
