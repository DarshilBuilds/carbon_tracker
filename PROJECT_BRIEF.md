# PROJECT BRIEF: Carbon Compass

---

## 1. Project Name, Tagline & Context

- **Project Name:** Carbon Compass
- **One-Line Tagline:** AI-powered carbon emission calculator for manufacturing compliance reporting.
- **Team Name:** NOT FOUND (Referenced in documentation as "Project Team Carbon Compass")
- **Team Members:** NOT FOUND
- **Institution / Department:** NOT FOUND
- **Event / Hackathon Name:** NOT FOUND
- **Problem Statement ID / Number:** NOT FOUND

---

## 2. Problem Statement

### Who is affected?
Factory plant managers, Environmental Health & Safety (EHS) officers, sustainability leads, and operations directors in industrial manufacturing facilities (such as steel, aluminium, cement, chemicals, paper, and energy).

### What is the pain point?
Industrial facilities produce carbon emissions from dozens of different activities: running boilers, burning natural gas, operating forklift fleets, consuming grid electricity, and chemical process reactions. 
To report these emissions to regulators, factory logs must be mapped to official government emission factors. However:
- Factory operators and technicians write activity names using informal, inconsistent shop-floor language (for example, one writes *"diesel for forklifts"*, another writes *"fuel consumption - vehicle fleet"*).
- Traditional software and spreadsheets require exact word matches and break when words vary.
- Off-the-shelf enterprise ESG platforms (such as Watershed and Persefoni) are built for corporate offices, cost \$50,000 to \$250,000+ per year, take 3 to 6 months to set up, and force companies to send confidential factory data to third-party cloud servers.

### Why it matters?
Governments worldwide and in India are enforcing mandatory monthly and annual carbon reporting (including India's Carbon Credit Trading Scheme - CCTS 2023, the European Union's CBAM carbon tariff, and US EPA rules). Failing to report accurately leads to heavy legal penalties, failed audits, and loss of vendor contracts with large buyers.

### Numbers & Evidence in the Project:
- **73%** of manual industrial compliance workflows take more than 3 months to resolve.
- Compliance officers spend **30 to 50 hours per month** manually searching through regulatory factor tables.
- Enterprise software alternatives cost **\$50,000 to \$250,000+ per year**.
- In the project's real-world benchmark data, a single facility (Civitas Permian Basin) reported **844,548.5 metric tons of $\text{CO}_2\text{e}$** in its EPA GHGRP regulatory filing, proving the enormous scale of data factories must handle.

---

## 3. Our Solution

Carbon Compass is an easy-to-use, on-premise software tool that turns unstandardized factory spreadsheets into clean, audit-ready carbon emission reports in seconds. Instead of requiring exact keywords, it uses a small, embedded artificial intelligence model (`all-MiniLM-L6-v2`) that understands the semantic meaning of human phrases and automatically pairs shop-floor activity notes with official emission standards. It checks physical units (such as liters, kilowatt-hours, or cubic meters), calculates exact carbon footprints ($\text{kg CO}_2\text{e}$), and shows visual charts and color-coded confidence badges. Because the entire system runs locally on the factory's own computer, confidential production numbers never leave the company.

### End-to-End User Flow (Step-by-Step):
1. **Drop File:** The user drags and drops a CSV or Excel (`.xlsx`) operational file into the web browser.
2. **Review & Preview:** The tool checks the file, strips hidden formatting, auto-detects columns, displays a scrollable preview table of valid activities, and blocks negative or invalid numbers.
3. **Run AI Mapping:** The user clicks the **"Map to EPA Factors"** button.
4. **Semantic Matching:** The backend AI encodes the activity text into mathematical vectors and finds the closest official emission factor using cosine similarity.
5. **Unit Guardrail Check:** The system verifies that physical units make sense (for example, preventing electricity from being measured in liters) and performs automatic unit conversions (such as megawatt-hours to kilowatt-hours).
6. **Inspect Results:** The user views total emissions, top carbon hotspots on interactive bar and donut charts, and a table showing per-row match confidence scores (High, Medium, Low).
7. **One-Click Export:** The user clicks **"Export CSV"** to download a clean, structured spreadsheet ready for auditors and regulatory submission.

---

## 4. Key Features

- **Semantic AI Activity Matching:** Automatically understands informal shop-floor descriptions (like *"yard forklift fuel"*) and matches them to official regulatory factors, eliminating weeks of manual lookup.
- **Dimensional Unit Validation & Conversion:** Automatically converts compatible units (e.g., MWh to kWh, gallons to liters) and blocks incompatible units, preventing massive calculation errors.
- **Per-Row Match Confidence Badges:** Labels every single match as High ($\ge 80\%$), Medium ($60\text{--}79\%$), or Low ($< 60\%$), allowing managers to review uncertain items in seconds.
- **Multi-Format Ingestion with Live Preview:** Supports CSV, TSV, TXT, and multi-sheet Excel files with column auto-detection and an instant preview table, avoiding tedious data reformatting.
- **Interactive Visual Hotspot Analytics:** Displays interactive Recharts bar charts and distribution donuts, showing managers exactly which 2 or 3 activities produce the most carbon.
- **100% On-Premise Execution:** Runs entirely on local computers without sending data to public clouds, ensuring factory production volumes remain confidential.
- **Automatic Offline Fallback Engine:** Features a built-in browser keyword matcher that keeps working even if the backend server is temporarily disconnected.
- **Audit-Ready RFC 4180 CSV Export:** Downloads standardized spreadsheets with full factor provenance and unit flags, ready for third-party auditors and government portals.

---

## 5. Tech Stack & Architecture

### Components & Technologies:
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI), Lucide Icons.
- **Charts & Visualization:** Recharts (responsive bar and donut charts).
- **File Parsing:** Custom client-side CSV parser and SheetJS (`xlsx`) for Excel reading.
- **Backend API:** Python 3.10+, FastAPI, Uvicorn ASGI server, Pydantic V2 for schema validation.
- **AI / ML Model:** `sentence-transformers/all-MiniLM-L6-v2` (compact 80MB language model generating 384-dimensional dense vector embeddings).
- **Math & Matching Engine:** NumPy (vectorized matrix dot-product for cosine similarity).
- **Database:** Stateless / In-Memory (NOT FOUND - no persistent SQL/NoSQL database is used; all processing occurs in memory during the active session).
- **API Endpoints:**
  - `GET /health` — Checks backend availability.
  - `POST /api/map` — Accepts activity rows, performs vector matching, validates units, and returns calculated emissions.
  - `GET /api/epa-factors` — Lists all 22 pre-loaded official emission factors.

### Architecture Description (For Diagrams):
```
[ FACTORY USER / BROWSER ]
       │
       ▼
[ Client Application (React 18 + Vite - Port 8080) ]
  ├── 1. Ingestion: Reads CSV/Excel via SheetJS, checks valid numbers, shows data preview.
  ├── 2. Health Hook: Pings backend /health; if disconnected, falls back to offline demo matcher.
  └── 3. UI Dashboard: Displays Recharts charts, summary cards, and results table.
       │
       ▼ (Sends JSON request via POST /api/map)
[ Backend Analytical Service (FastAPI + Python - Port 8000) ]
  ├── 1. Pydantic Sanitizer: Validates incoming data types, strips whitespace.
  ├── 2. Dimensional Unit Engine: Checks dimensions (Mass, Volume, Energy) & converts units.
  ├── 3. AI Vector Encoder: Encodes activity names using all-MiniLM-L6-v2 (384 dimensions).
  ├── 4. Cosine Similarity Engine: Multiplies vectors against precomputed 22-factor matrix using NumPy.
  └── 5. Calculation Core: Multiplies converted quantity by factor to compute kg CO2e.
       │
       ▼ (Returns enriched results with confidence scores)
[ Output & Export Layer ]
  └── Serializes results into UTF-8 BOM CSV for download and audit submission.
```

---

## 6. What is Actually Implemented vs. Planned

### What is Actually Implemented & Working in the Codebase:
- Working React 18 + TypeScript web application with dark/light industrial UI.
- File uploader supporting `.csv`, `.tsv`, `.txt`, and `.xlsx` with auto-detected headers and row preview.
- FastAPI backend server with `/health`, `/api/map`, and `/api/epa-factors` endpoints.
- Embedded `all-MiniLM-L6-v2` AI model running locally on CPU.
- Unit dimension classification and conversion across Mass, Volume, Energy, Transport, and Direct Emissions.
- Compatibility fallback matching to alternative factors when units require it.
- Per-row confidence scoring with High, Medium, and Low visual badges.
- Dynamic Recharts emission hotspot bar chart and distribution pie chart.
- Search filter and expandable view inside the results table.
- One-click CSV export with UTF-8 BOM encoding for Excel compatibility.
- Client-side offline fallback engine for demonstrations without an active backend.
- 5 pre-packaged benchmark datasets (1,000 synthetic rows, 300 plant rows, and 4,500 real sensor rows from UCI archives).

### What is Planned / Future Scope (Found in Docs/Roadmap, Not Yet in Code):
- Persistent database storage (PostgreSQL, TimescaleDB, or SQLite) — **NOT IMPLEMENTED**.
- User login, authentication, and Role-Based Access Control (RBAC) — **NOT IMPLEMENTED**.
- Direct connection to live factory sensors or SCADA systems (OPC-UA, Modbus, MQTT) — **NOT IMPLEMENTED**.
- In-browser manual override/editing of factor matches — **NOT IMPLEMENTED**.
- Automated XML export formatted for the European Union CBAM portal — **NOT IMPLEMENTED**.
- Mobile camera app with OCR for reading physical meters — **NOT IMPLEMENTED**.
- Automated lookup of US eGRID subregions by zip code — **NOT IMPLEMENTED** (zip code is accepted as a field, but regional grid factor lookup logic is not implemented).

---

## 7. Unique Points

1. **Semantic Understanding Instead of Exact Matching:** Unlike standard software that fails when someone writes *"red diesel for yard cranes"*, Carbon Compass uses continuous vector geometry to recognize the underlying meaning of words.
2. **Local CPU Optimization:** The AI model is only 80MB and runs on ordinary desktop processors in milliseconds without needing expensive GPU graphics cards or cloud subscriptions.
3. **Absolute Data Privacy (Air-Gapped):** Because processing happens 100% locally, sensitive manufacturing formulas, energy bills, and daily production numbers are never exposed to external cloud vendors.
4. **Physical Activity-Based Accuracy:** Rather than guessing emissions from money spent on invoices (which changes with inflation), Carbon Compass multiplies real physical quantities by physical factors, giving audit-grade results.
5. **Physical Unit Safety Net:** Combines natural language processing with strict physical dimension checks, preventing the AI from accidentally calculating nonsensical figures (such as multiplying liters by a per-kilowatt factor).

---

## 8. Impact

### Who Benefits?
- **Factory Environmental Managers:** Turn a 3-month manual spreadsheet ordeal into a 2-minute automated task.
- **Factory Owners & Executives:** Avoid expensive regulatory non-compliance fines and save \$50,000+ per plant every year in enterprise software fees.
- **Third-Party Auditors:** Get transparent spreadsheets with clear match scores and factor sources, making verification fast and painless.

### Expected Outcomes:
- Reduces monthly compliance preparation time by over **90%**.
- Prevents human typos and unit conversion errors from slipping into official filings.
- Gives factory engineers clear visual proof of their biggest emission hotspots so they know where to reduce energy use.

### Scalability:
- Benchmarking shows the system processes **1,000 activities in 184 milliseconds** and **5,500 activities in under 255 milliseconds** on a basic computer.
- Because it is built with FastAPI and NumPy vectorized batching, it can easily handle tens of thousands of factory records per minute.

### Feasibility:
- Highly practical and working right now. It does not require high-end servers, expensive cloud contracts, or months of technical training.

---

## 9. Demo Material

### Screens in the Application:
1. **Upload & Setup Screen:** Drag-and-drop file zone, sheet selector, live data preview table, and API connection indicator.
2. **Executive Summary Cards:** Cards displaying Total Emissions (kg CO2e), Number of Activities, Average Match Score, and counts of High vs. Low confidence rows.
3. **Hotspot Charts:** Side-by-side Recharts bar chart showing top carbon contributors and donut chart showing category percentages.
4. **Detailed Mapping Results Table:** Searchable table showing every user activity, matched official factor, quantity, unit, emissions, and color-coded confidence badge.

### Sample Input & Output:
- **Sample Input (CSV):**
  ```csv
  facility,reporting_period,activity_name,quantity,unit
  Plant 01,2025-01,diesel for forklifts,1000,L
  Plant 01,2025-01,natural gas usage,800,m3
  Plant 01,2025-01,grid electricity,4500,kWh
  ```
- **Sample Output (Screen / Export):**
  - *"diesel for forklifts"* $\rightarrow$ Matched to **Diesel fuel combustion - mobile sources** | Factor: 2.68 kg CO2e/L | Confidence: 89% | Emissions: **2,680.0 kg CO2e**
  - *"natural gas usage"* $\rightarrow$ Matched to **Natural gas combustion - industrial** | Factor: 2.02 kg CO2e/m3 | Confidence: 91% | Emissions: **1,616.0 kg CO2e**
  - *"grid electricity"* $\rightarrow$ Matched to **Electricity generation - grid average** | Factor: 0.42 kg CO2e/kWh | Confidence: 90% | Emissions: **1,890.0 kg CO2e**
  - **Total Facility Footprint:** **6,186.0 kg CO2e**

### 3 Points Worth Showing Live to the Jury:
1. **Live Semantic Mapping of Informal Slang:** Type or upload colloquial terms (like *"yard forklift fuel"* or *"boiler natural gas burn"*) and watch the system instantly map them to formal EPA categories with green confidence badges.
2. **Automated Unit Conversion & Guardrails:** Demonstrate how the system automatically converts `MWh` to `kWh` or `gallons` to `liters`, while safely flagging incompatible units without crashing.
3. **Instant Hotspot Discovery & CSV Download:** Show how the bar chart immediately highlights the top emitting activity, followed by clicking **"Export CSV"** to generate an auditor-ready file with one click.

---

## 10. Limitations and Honest Risks

- **Static Factor List:** The backend currently includes 22 built-in EPA demonstration emission factors. It is not yet connected to a dynamic online library containing thousands of regional global factors.
- **Uncalibrated Similarity Scores:** The 0–100% confidence score is based on mathematical vector distance (cosine similarity), not a calibrated statistical probability.
- **Stateless Session (No Database):** There is no persistent database. If the user refreshes the web browser or closes the tab, the uploaded data is cleared.
- **No Direct Machine Telemetry:** Data must currently be uploaded as a file; the system does not yet pull readings directly from physical factory sensors or SCADA systems.
- **Zip Code Grid Lookup Incomplete:** While the data schema accepts a `zip_code` column, the backend does not yet automatically adjust electricity emission factors based on specific local power grid zones.

---

## 11. Future Scope & Roadmap

- **Phase 1 (Near-Term, 3–6 Months):**
  - Expand the factor catalog to include international and Indian databases (such as full US EPA Hub, UK DEFRA, IPCC, and Bureau of Energy Efficiency CCTS factors).
  - Allow users to manually edit or override factor matches directly in the table.
  - Add one-click export for European Union CBAM compliance declarations.
- **Phase 2 (Mid-Term, 6–18 Months):**
  - Add direct connectors for factory automation protocols (Modbus, OPC-UA, MQTT) to read energy meters automatically.
  - Implement a persistent database (PostgreSQL) with user login and Role-Based Access Control (RBAC).
- **Phase 3 (Long-Term, 18+ Months):**
  - AI Decarbonization Assistant to suggest specific engineering upgrades for top emitting equipment.
  - Mobile phone scanning app with OCR to read analog factory gauges and meters.
  - Cryptographic tamper-proofing to prove reports have not been altered after generation.

---

## 12. 10 Tough Jury Questions & Short Answers

**Q1: Why do you need AI for this? Why not just use Excel dropdowns or VLOOKUP?**  
**Answer:** In busy 24/7 factories, operators hate rigid dropdowns and enter inconsistent notes. VLOOKUP fails whenever there is a typo or abbreviation (like *"G11 coal"* vs. *"sub-bituminous coal"*). Our AI matches the semantic meaning of human phrases in milliseconds and enforces unit safety rules that Excel cannot.

**Q2: If the AI makes a wrong match and calculates the wrong emissions, who is responsible?**  
**Answer:** In environmental regulation, legal liability always stays with the factory and its certified auditor. That is why Carbon Compass is an *assistive decision-support tool*, not an autonomous submitter. Every row displays an explicit confidence score, and low-confidence items are flagged for human sign-off.

**Q3: Why would a factory trust your software with confidential production data?**  
**Answer:** That is our primary competitive advantage. Unlike cloud platforms, Carbon Compass runs 100% locally on the factory's own computers. Zero bytes of operational data ever leave the plant's private network.

**Q4: Isn't `all-MiniLM-L6-v2` just an open-source model? What did your team actually build?**  
**Answer:** We engineered the entire end-to-end industrial compliance engine: the multi-format file parser, the dimensional unit validation system, the vectorized matrix similarity engine, the interactive analytics dashboard, and the audit export pipeline.

**Q5: What prevents a factory from uploading fake numbers to look green?**  
**Answer:** Software calculates based on inputs; fraud prevention happens through third-party audits. In statutory systems (like India's CCTS or EPA GHGRP), accredited verifiers cross-check reported fuel totals against physical utility bills and weighbridge receipts. Our tool provides an auditable paper trail to make that verification fast.

**Q6: What happens if an operator uploads an activity with a unit that doesn't match the factor?**  
**Answer:** If the units are in the same physical category (like gallons and liters), our engine converts them automatically. If the units are completely incompatible (like measuring electricity in kilograms), the engine checks for alternative compatible factors or flags the row with zero emissions to prevent false numbers.

**Q7: Can this tool work if the factory has no internet connection?**  
**Answer:** Yes. The AI model and backend run locally on the factory network. Additionally, the web frontend has a built-in offline matching engine that allows full demonstration and review even if the server is offline.

**Q8: Why did you benchmark on UCI electricity datasets instead of real Indian factory logs?**  
**Answer:** Real factory SCADA data is protected by corporate non-disclosure agreements (NDAs). To test system speed and mathematical stability in a scientifically repeatable way, we used verified public datasets from the UCI Machine Learning Repository containing 4,500 real sensor observations.

**Q9: Is the confidence percentage a true mathematical probability?**  
**Answer:** No. It is a normalized cosine similarity score reflecting distance in 384-dimensional vector space. We display it on a 0–100% scale as an intuitive guide so factory managers know which rows need human review.

**Q10: If a factory wanted to use this tomorrow, what is currently missing?**  
**Answer:** The core calculation and AI matching engine are fully functional. To be commercial-ready, we need to connect a broader live database of regional emission factors and add user accounts with login permissions.

---

## Items NOT FOUND in the Project (To Fill In Yourself)

Please fill in the following details before submitting to your jury:
1. **Your Team Members' Names and Roles:** (e.g., Lead Developer, ML Engineer, UI/UX Designer).
2. **Your College / University / Department Name:** (e.g., Department of Computer Science & Engineering).
3. **Your Project Mentor / Guide / Teacher ("Mam") Name.**
4. **Hackathon / Competition / Capstone Course Code & Title.**
5. **Problem Statement Number / ID:** (If your college or hackathon assigned an official problem statement number).
6. **Date of Submission / Presentation.**
