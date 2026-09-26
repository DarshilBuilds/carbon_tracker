# Carbon Compass

**AI-powered carbon emission calculator for manufacturing compliance reporting.**

Carbon Compass helps manufacturing factories meet government-mandated monthly carbon emission reporting requirements. It accepts unstructured activity data (CSV uploads), uses a small language model to intelligently map activities to EPA emission factors, calculates precise CO₂e emissions, and exports a structured Excel-ready report — all in one workflow.

---

## What it does

Manufacturing facilities generate carbon emissions from dozens of activity types: fuel combustion, steel production, electricity use, freight, refrigerants, and more. Describing these consistently is hard — one operator writes "diesel for forklifts," another writes "fuel consumption - vehicle fleet." Traditional tools break on this inconsistency.

Carbon Compass solves this with an embedded ML model (`all-MiniLM-L6-v2`, a compact sentence-transformer) that understands the *semantic meaning* of any activity description and matches it to the correct EPA emission factor — even when wording varies.

### Core workflow

1. **Upload** — Drop in a CSV file with activity names and quantities (e.g., `"natural gas combustion", 500, m³`)
2. **AI Mapping** — The `all-MiniLM-L6-v2` model encodes each activity as a vector and finds the closest EPA emission factor via cosine similarity
3. **Calculation** — Emissions are computed as `quantity × emission_factor` (kg CO₂e)
4. **Review** — Interactive table and charts show results, confidence scores, and totals
5. **Export** — Download a structured report suitable for government submission

### Example

| User Input | Matched EPA Activity | Factor | Qty | Emissions |
|---|---|---|---|---|
| diesel for forklifts | Diesel fuel combustion - mobile sources | 2.68 kg CO₂e/L | 1000 L | 2680 kg CO₂e |
| grid electricity | Electricity generation - grid average | 0.42 kg CO₂e/kWh | 5000 kWh | 2100 kg CO₂e |
| steel beam production | Steel production - basic oxygen furnace | 1.85 kg CO₂e/kg | 2000 kg | 3700 kg CO₂e |

---

## Tech stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **shadcn/ui** + **Tailwind CSS** — component library
- **Recharts** — emissions visualization
- **React Query** — API state management

### Backend
- **FastAPI** (Python) — REST API
- **sentence-transformers** (`all-MiniLM-L6-v2`) — semantic activity matching
- **NumPy** — cosine similarity scoring
- EPA emission factors dataset (20+ industrial activity categories)

---

## Getting started

### Prerequisites
- Node.js 18+
- Python 3.10+
- pip or conda

### Frontend

```powershell
npm install
npm run dev
```

App runs at `http://localhost:8080`

### Backend

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

API runs at `http://localhost:8000`

By default, the API accepts browser requests from `http://localhost:8080` and `http://127.0.0.1:8080`. Set `CORS_ORIGINS` to a comma-separated allowlist when deploying the frontend elsewhere.

> The frontend includes a **demo mode** that works without the backend. It uses deterministic keyword matching; connect the backend for semantic matching. Neither score is a calibrated probability.

Run backend input-validation tests from `backend` with `python -m unittest discover -s tests -v`.

---

## CSV input format

A synthetic 1,000-row dataset is available for testing: [demo-emissions-1000.csv](public/demo-emissions-1000.csv). It covers 20 activity categories across five facilities and ten reporting months. The results view can export the mapped rows as a spreadsheet-friendly CSV.

Three additional, real electricity-consumption datasets are provided under [`public/real-data`](public/real-data). Each contains 1,500 measured records in the app's CSV format. They are residential/utility measurements, not manufacturing-facility data; their purpose is to test importing, unit handling, mapping, charts, and exports with authentic observations.

| File | Source and conversion |
|---|---|
| [real-household-electricity-1500.csv](public/real-data/real-household-electricity-1500.csv) | [UCI Individual Household Electric Power Consumption](https://doi.org/10.24432/C58K54), CC BY 4.0. One-minute average kW converted to interval kWh by dividing by 60. |
| [real-appliance-electricity-1500.csv](public/real-data/real-appliance-electricity-1500.csv) | [UCI Appliances Energy Prediction](https://doi.org/10.24432/C5VC8G), CC BY 4.0. Measured appliance Wh converted to kWh by dividing by 1,000. |
| [real-client-load-1500.csv](public/real-data/real-client-load-1500.csv) | [UCI ElectricityLoadDiagrams20112014](https://doi.org/10.24432/C58C86), CC BY 4.0. Fifteen-minute average kW converted to interval kWh by dividing by 4. |

The real datasets are derived subsets with original timestamps and source identifiers retained. Rebuild them with `python scripts/prepare-real-datasets.py`; the script downloads the original UCI archives and selects the first 1,500 positive measurements from each. See the linked UCI pages for citations and full license details.

```csv
facility,reporting_period,activity_name,quantity,unit
Plant 01,2025-01,diesel fuel combustion,1200,L
Plant 01,2025-01,natural gas usage,800,m3
Plant 01,2025-01,electricity consumption,4500,kWh
Plant 01,2025-01,steel production,300,kg
```

Required columns: `activity_name`, `quantity`  
Optional columns: `unit`, `facility`, `reporting_period`. Quantities must be positive finite numbers. Units must match the selected factor; the app does not convert between different units. If omitted, the factor's base unit is assumed and marked in the results.

---

## API reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/map` | Map activities → emissions |
| GET | `/api/epa-factors` | List all EPA factors |

### POST /api/map

**Request:**
```json
{
  "activities": [
    { "activityName": "diesel combustion", "quantity": 500, "unit": "L" }
  ]
}
```

**Response:**
```json
[
  {
    "userActivity": "diesel combustion",
    "matchedEpaActivity": "Diesel fuel combustion - mobile sources",
    "emissionFactor": 2.68,
    "emissionFactorUnit": "kg CO2e/L",
    "confidenceScore": 92,
    "quantity": 500,
    "quantityUnit": "L",
    "unitAssumed": false,
    "facility": null,
    "reportingPeriod": null,
    "calculatedEmissions": 1340.0
  }
]
```

---

## Compliance context

Many governments require manufacturing facilities to submit **monthly carbon emission reports** with activity-level breakdowns and CO₂e totals. Carbon Compass supports organizing and exporting activity-level data, but the bundled factors currently have no recorded source, year, or geography. Treat them as demo values and verify every factor against the applicable official source before using the report for compliance.

- Preserving facility, reporting-period, and unit metadata
- Reporting match scores to help prioritize human review
- Exporting mapped results to CSV for spreadsheet review

---

## Project structure

```
carbon-compass/
├── backend/
│   ├── main.py           # FastAPI app + /api/map endpoint
│   ├── epa_factors.py    # EPA emission factors dataset
│   └── requirements.txt
├── src/
│   ├── components/       # UI components (FileUploader, MappingResultsTable, EmissionsChart…)
│   ├── hooks/            # useEmissionsMapping, useApiStatus
│   ├── types/            # TypeScript interfaces
│   ├── lib/              # CSV parser, utilities
│   └── pages/            # Index, NotFound
└── package.json
```

---

## License

MIT
