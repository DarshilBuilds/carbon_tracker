# Other Demo Data (Manufacturing Benchmark Datasets)

This folder contains three benchmark datasets designed to demonstrate **three completely distinct analytical emission profiles** in Carbon Compass:

---

### Comparison of the 3 Analytical Profiles

| Dataset | Profile & Facility Focus | Rows | Top #1 Hotspot in Bar Chart | Top #2 Hotspot | Top #3 Hotspot | Donut Chart Distribution |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **[`demo-emissions-1000.csv`](./demo-emissions-1000.csv)** | **Heavy Foundry & Steel Operations**<br>(Plant 01 – Plant 05) | 1,000 | **Steel production** (~27%) | **Electricity generation** (~14%) | **Natural gas combustion** (~12%) | Dominated by Steel (27%), Electricity (14%), and Gas (12%) |
| **[`plant_monthly_activities_300.csv`](./plant_monthly_activities_300.csv)** | **Petrochemical, Polymer & Energy Facilities**<br>(Baton Rouge, Baytown, Geismar, Plaquemine, Lake Charles) | 300 | **Natural gas combustion** (~41.5%) | **Plastic production** (~24.7%) | **District heating** (~12.8%) | Dominated by Natural Gas (41.5%) and Plastics (24.7%) |
| **[`plant_monthly_activities_1000.csv`](./plant_monthly_activities_1000.csv)** | **Smelting, Packaging & Freight Logistics**<br>(Massena, Savannah, Chicago, Morenci, Allentown) | 1,000 | **Aluminum production** (~35.6%) | **Paper production** (~20.8%) | **Road freight transport** (~17.2%) | Dominated by Aluminum (35.6%), Paper (20.8%), and Truck Freight (17.2%) |

---

### Columns
All three CSV files use standard column headers for effortless upload into the Carbon Compass calculation engine:
`facility,reporting_period,zip_code,activity_name,quantity,unit`
