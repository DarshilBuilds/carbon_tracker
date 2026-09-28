# Carbon Compass — Demo Datasets Collection

This directory contains all benchmark and demonstration datasets for **Carbon Compass**, structured for compliance reporting, stress testing, and jury demonstrations.

---

## Dataset Directory

| File Name | Description | Rows | Source / Domain |
| :--- | :--- | :---: | :--- |
| **[`demo-emissions-1000.csv`](./demo-emissions-1000.csv)** | Multi-facility manufacturing benchmark | **1,000** | Synthetic multi-facility industrial log across 5 plants (`Plant 01`–`Plant 05`), 10 reporting months (`2025-01`–`2025-10`), and 20 EPA activity categories. |
| **[`civitas_permian_basin_2023_carbon_compass.csv`](./civitas_permian_basin_2023_carbon_compass.csv)** | Authentic EPA GHGRP Subpart W dataset | **8** | Actual 2023 EPA Greenhouse Gas Reporting Program (GHGRP) Subpart W filing for Civitas Resources - Permian Basin (844,548.5 MT CO₂e across combustion, flaring, storage tanks, and pneumatics). |
| **[`real-household-electricity-1500.csv`](./real-household-electricity-1500.csv)** | Authentic interval electric power data | **1,500** | [UCI Individual Household Electric Power Consumption](https://doi.org/10.24432/C58K54) (CC BY 4.0). 1-minute average kW converted to interval kWh. |
| **[`real-appliance-electricity-1500.csv`](./real-appliance-electricity-1500.csv)** | Measured appliance energy readings | **1,500** | [UCI Appliances Energy Prediction](https://doi.org/10.24432/C5VC8G) (CC BY 4.0). Measured appliance Wh converted to interval kWh. |
| **[`real-client-load-1500.csv`](./real-client-load-1500.csv)** | Industrial utility client load diagrams | **1,500** | [UCI ElectricityLoadDiagrams20112014](https://doi.org/10.24432/C58C86) (CC BY 4.0). 15-minute average kW converted to interval kWh. |

---

## CSV Schema Specification

All files conform to the standard Carbon Compass ingestion contract:

```csv
facility,reporting_period,activity_name,quantity,unit
Plant 01,2025-01,diesel fuel combustion,1200,L
Plant 01,2025-01,natural gas usage,800,m3
Plant 01,2025-01,electricity consumption,4500,kWh
Plant 01,2025-01,steel production,300,kg
```

- **Required Columns:** `activity_name`, `quantity` (must be finite positive numbers $> 0$).
- **Optional Columns:** `unit`, `facility`, `reporting_period`.
- **Accepted Column Aliases:**
  - `activity_name`: `activityname`, `activity`, `name`, `description`
  - `quantity`: `qty`, `amount`, `value`
  - `unit`: `units`, `uom`
  - `facility`: `site`, `plant`
  - `reporting_period`: `reportingperiod`, `reporting_month`, `period`, `month`

---

## Live Demonstration Guide for Jury

1. **For General Manufacturing Flow:**
   - Upload [`demo-emissions-1000.csv`](./demo-emissions-1000.csv).
   - Demonstrates multi-category EPA matching (fuel, metals, freight, refrigerants, electricity) and multi-facility metadata.

2. **For High-Volume Real Observation Testing:**
   - Upload any of the three 1,500-row `real-*.csv` files.
   - Demonstrates sub-second batch inference on authentic sensor measurements.

3. **For EPA Subpart W Petroleum & Natural Gas Reporting:**
   - Upload [`civitas_permian_basin_2023_carbon_compass.csv`](./civitas_permian_basin_2023_carbon_compass.csv).
   - Demonstrates compliance calculation on an authentic 2023 Permian Basin facility filing totaling 844,548.5 MT CO₂e.
