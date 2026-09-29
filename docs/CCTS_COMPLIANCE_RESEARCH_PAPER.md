# Carbon Compass: An AI-Assisted Semantic Compliance Engine for the Indian Carbon Market (CCTS) and Industrial Decarbonization

**Authors:** Project Team Carbon Compass  
**Affiliation:** Department of Computer Science & Engineering / Environmental Engineering  
**Target Publication / Academic Track:** IEEE / Springer Sustainable Computing & Environmental Informatics  
**Regulatory Baseline:** Carbon Credit Trading Scheme (CCTS 2023), Bureau of Energy Efficiency (BEE), Ministry of Power & MoEFCC, Government of India (S.O. 2825(E))

---

## Abstract

Industrial compliance under carbon trading systems has transitioned from voluntary corporate reporting to legally binding, financially penalized market mechanisms. Under India’s newly notified **Carbon Credit Trading Scheme (CCTS, 2023)** and the Bureau of Energy Efficiency (BEE) Compliance Mechanism, over a thousand Designated Consumers (DCs) across energy-intensive sectors (iron & steel, cement, aluminum, fertilizer, chlor-alkali, thermal power, and refineries) are mandated to achieve annual Specific GHG Emission (SGE) reduction targets measured in $\text{tCO}_2\text{e}$ per unit of equivalent product. 

However, heavy industries face a crippling **operational-regulatory bottleneck**: shop-floor activity logs, boiler fuel receipts, and telemetry data are decentralized and recorded in heterogeneous, colloquial technical jargon (e.g., *"mill pulverized coal G11"*, *"HFO boiler firing"*, *"calcined dust bypass"*), while regulatory submissions (BEE Form 1, Form A) require precise mapping to standardized IPCC Type I or laboratory-derived Type II emission factors and stoichiometric mass balance equations. 

This paper presents **Carbon Compass**, an open-architecture, on-premise AI compliance engine. Carbon Compass bridges the semantic data-entry gap using a lightweight sentence-transformer model (`sentence-transformers/all-MiniLM-L6-v2`) combined with strict dimensional unit guardrails, Dulong-based Net Calorific Value (NCV) conversion routines, and an automated verification-readiness pipeline conforming to BEE Form 1 and Form A standards. Benchmarked across 5,500 empirical and stress-test data points, the system achieves sub-251 millisecond end-to-end processing latency, 100% unit mismatch prevention, and deterministic audit reproducibility while safeguarding corporate data sovereignty through zero-cloud local execution.

**Keywords:** Indian Carbon Market (ICM), Carbon Credit Trading Scheme (CCTS), Bureau of Energy Efficiency (BEE), Carbon Credit Certificates (CCC), Semantic Vector Mapping, Natural Language Processing, Industrial Carbon Accounting.

---

## 1. Introduction & Regulatory Grounding

### 1.1 The Indian Carbon Market (ICM) Mandate
Under India's enhanced Nationally Determined Contributions (NDCs) committed at COP26—specifically reducing the emissions intensity of GDP by 45% by 2030 from 2005 levels—the Government of India notified the **Carbon Credit Trading Scheme (CCTS, 2023)** vide Gazette S.O. 2825(E) on June 28, 2023, exercising statutory powers under Section 14(w) of the Energy Conservation Act, 2001 (52 of 2001) and the Environment (Protection) Act, 1986.

Administered jointly by the **National Steering Committee for Indian Carbon Market (NSCICM)**, the **Bureau of Energy Efficiency (BEE)**, the **Ministry of Power (MoP)**, and the **Ministry of Environment, Forest and Climate Change (MoEFCC)**, the CCTS establishes an institutional cap-and-trade compliance mechanism.

```
+----------------------------------------------------------------------------------------------------+
|                                    CCTS INSTITUTIONAL WORKFLOW                                     |
|                                                                                                    |
|  [ MoEFCC / MoP ]            Notifies 3-Year Trajectory & Annual SGE Targets                       |
|         │                                                                                          |
|         ▼                                                                                          |
|  [ Obligated Entity (DC) ]   Operates Plant & Logs Daily Fuel / Process Data                       |
|         │                    (Monitoring Plan submitted within 3 Months)                           |
|         ▼                                                                                          |
|  [ Carbon Compass Engine ]   Normalizes Shop-Floor Jargon, Calculates Scope 1 & 2 Emissions,       |
|                              Enforces Type I/II Factor Rules, Generates BEE Form 1 & Form A        |
|         │                                                                                          |
|         ▼                                                                                          |
|  [ Accredited Verifier ]     Conducts Site Visit & Lab Cross-Check (ISO 1928:1995 ±71.7 kcal/kg)   |
|         │                    Issues Form B (Certificate of Verification)                           |
|         ▼                                                                                          |
|  [ BEE & NSCICM ]            Recommends Issuance / Purchase of Carbon Credit Certificates (CCC)    |
|         │                                                                                          |
|         ▼                                                                                          |
|  [ Power Exchange / CERC ]   Surplus Entities SELL CCCs <====> Deficit Entities BUY CCCs           |
+----------------------------------------------------------------------------------------------------+
```

### 1.2 Core Regulatory Rules Governing Obligated Entities
According to the BEE Detailed Procedure for Compliance Mechanism:
1. **Designated Consumers (Obligated Entities):** Specific industrial plants in iron and steel, cement, aluminum, chlor-alkali, fertilizer, pulp and paper, textile, thermal power, and refineries with threshold energy consumption.
2. **Trajectory & Target Cycles:** Notified for a 3-year trajectory period with annual compliance cycles. Targets are defined in terms of Specific GHG Emissions:
   $$\text{SGE} = \frac{\text{Total Net GHG Emissions } (\text{tCO}_2\text{e})}{\text{Total Equivalent Product Output } (\text{tonne or MWh})}$$
3. **Gate-to-Gate Scope:** Covers direct energy emissions, direct process (non-energy) emissions, and indirect purchased electricity/heat within the plant boundary, subtracting exported electricity and carbon captured through permanent Carbon Capture, Utilization, and Storage (CCUS).
4. **CCC Issuance & Shortfall Equation:**
   $$\text{CCCs Issued} = \left(\text{SGE}_{\text{notified}} - \text{SGE}_{\text{achieved}}\right) \times \text{Production}_{\text{actual}}$$
   - If $\text{SGE}_{\text{achieved}} < \text{SGE}_{\text{notified}}$: The entity earns Carbon Credit Certificates (1 CCC = $1\text{ tCO}_2\text{e}$), which can be sold on CERC-regulated Power Exchanges or banked for future cycles.
   - If $\text{SGE}_{\text{achieved}} > \text{SGE}_{\text{notified}}$: The entity must purchase CCCs from the market or face severe financial penalties and prosecution under the Environment (Protection) Act, 1986.

### 1.3 The Industry Pain Point: The Data-to-Compliance Chasm
Despite the regulatory clarity, manufacturing sites face operational friction:
- **Shop-floor Data Disconnect:** Boiler operators, weighbridge clerks, and chemical engineers record inputs using idiosyncratic vendor or operational terminology (e.g., *"Indonesian coal fines"*, *"Furnace oil - Grade C"*, *"Bagasse fuel mix"*).
- **Type I vs. Type II Rigor:** The CCTS mandates that if any emission source contributes $>10\%$ of overall plant emissions, the entity **must** use **Type II emission factors** (derived from laboratory ultimate/proximate analysis) rather than default Type I IPCC values.
- **Verification Liabilities:** Submissions are audited by Accredited Carbon Verification Agencies (ACVAs). Misrepresentations trigger check-audits (BEE Section 6, Form C) and penalize both the plant and the verifier.
- **Data Sovereignty:** Plants cannot upload confidential capacity, fuel blend ratios, and daily production volumes to public multitenant clouds (e.g., generic OpenAI or closed SaaS APIs) due to competitive espionage risks.

---

## 2. Mathematical & Algorithmic Framework

### 2.1 Total GHG Emissions Formulation (CCTS Annexure II)
The total greenhouse gas emissions of an obligated plant establishment are computed on a gate-to-gate basis:

$$\text{GHG}_{\text{Total}} = \text{GHG}_{\text{Direct, energy}} + \text{GHG}_{\text{Direct, process}} + \text{GHG}_{\text{Indirect, grid}} - \text{GHG}_{\text{Exported}} - \text{GHG}_{\text{CCUS}}$$

Where:

#### 1. Direct Combustion Emissions ($\text{GHG}_{\text{Direct, energy}}$)
$$\text{GHG}_{\text{Direct}} = \text{AD} \times \text{EF} \times \text{OF}$$
- $\text{AD}$ (Activity Data) $= \text{FQ} \times \text{NCV}$ (Fuel Quantity $\times$ Net Calorific Value).
- $\text{EF}$ is the emission factor ($\text{tCO}_2/\text{TOE}$ or $\text{gCO}_2/\text{kCal}$).
- $\text{OF}$ is the Oxidation Factor, defined by CCTS Equation V:
  $$\text{OF} = 1 - \frac{\text{Carbon}_{\text{fuel residual}}}{\text{Carbon}_{\text{ash \& flue gas}}}$$
  *(Defaulted to $1.0$ if unmeasured).*

#### 2. Net Calorific Value (NCV) & GCV Derivations (CCTS Annexure III)
When laboratory Bomb Calorimeter NCV is unavailable, Dulong's formulations are enforced:
$$\text{GCV} = 81(\%C) + 342.5\left(\%H - \frac{\%O}{8}\right) + 22.5(\%S) \quad [\text{kCal/kg}]$$
$$\text{NCV} = \text{GCV} - 5.87 \times (9 \times \%H + \%M) \quad [\text{kCal/kg}]$$
For solid and liquid fuels where only GCV is known, CCTS allows a standard 5% conversion factor ($\text{NCV} \approx 0.95 \times \text{GCV}$); for gaseous fuels, 10% ($\text{NCV} \approx 0.90 \times \text{GCV}$).

#### 3. Type II Emission Factor Calculation (CCTS Annexure III, Eq. XX)
For any source contributing $>10\%$ of plant emissions, ultimate analysis determines the specific factor:
$$\text{EF}_{\text{Type II}} \left(\frac{\text{gCO}_2}{\text{kCal}}\right) = \frac{\% \text{Total Carbon}}{\text{NCV} \left(\frac{\text{kCal}}{\text{kg}}\right) \times 100} \times \frac{44}{12} \times 100$$

#### 4. Indirect Purchased Electricity ($\text{GHG}_{\text{Indirect, grid}}$)
$$\text{GHG}_{\text{Indirect}} = \text{Electricity Consumed } (\text{MWh}) \times \text{EF}_{\text{CEA Grid}}$$
Where $\text{EF}_{\text{CEA Grid}}$ is the latest published baseline grid emission factor from the Central Electricity Authority (CEA) of India ($\sim 0.716\text{ tCO}_2/\text{MWh}$ national weighted average).

#### 5. Sector-Specific Process Emissions (Cement Clinker & Primary Aluminium)
- **Cement Clinkerisation (Eq. IX & XIII):**
  $$\text{GHG}_{\text{clinker}} = \left[\% \text{CaO} \times \frac{44.01}{56.08}\right] + \left[\% \text{MgO} \times \frac{44.01}{40.34}\right]$$
  Adjusted for Cement Kiln Dust ($\text{CKD}$), bypass dust, and organic carbon ($\text{TOC}$) in raw meal.
- **Primary Aluminium Anode Effects (Eq. XIV & XVI):**
  Perfluorocarbons ($\text{CF}_4$ and $\text{C}_2\text{F}_6$) calculated via the Slope Method:
  $$\text{CF}_4 \text{ [t]} = \text{AEM} \times \text{SEF}_{\text{CF4}} \times \text{Production}_{\text{Al}} / 1000$$
  $$\text{PFC Emissions } (\text{tCO}_2\text{e}) = \text{CF}_4 \times 6500 + \text{C}_2\text{F}_6 \times 9200$$
  *(Global Warming Potential values strictly sourced from India BUR 3 / IPCC AR2).*

---

## 3. System Architecture & Implementation

Carbon Compass implements a decoupled, high-throughput pipeline designed for on-premise industrial deployment.

```mermaid
graph TD
    subgraph Ingestion["1. Industrial Data Ingestion"]
        CSV[Shop-Floor CSV / SCADA Logs]
        Clean[BOM Stripper & Schema Normalizer]
        UnitCheck[Dimensional Compatibility Guard]
        CSV --> Clean --> UnitCheck
    end

    subgraph AI["2. Semantic AI Mapping Core"]
        MiniLM["sentence-transformers/all-MiniLM-L6-v2 (CPU-optimized)"]
        Embed[Batch Vectorizer: 384-dimensional dense embeddings]
        Cosine[Cosine Similarity Dot Product Engine]
        Catalog[Regulatory Factor Catalog: CCTS Annexure IV & IPCC]
        UnitCheck --> Embed
        Embed --> MiniLM
        MiniLM --> Cosine
        Catalog --> Cosine
    end

    subgraph Audit["3. Decision Support & Gating"]
        Gating{Confidence Threshold}
        High["High Confidence (>=80%): Auto-Mapped"]
        Review["Low/Med (<80%): Flagged for Energy Manager"]
        Cosine --> Gating
        Gating -->|>=80%| High
        Gating -->|<80%| Review
    end

    subgraph Regulatory["4. Compliance & Verification Engine"]
        Form1[BEE Form 1 Generator]
        FormA[BEE Form A Performance Assessment]
        CCC_Calc[CCC Entitlement / Deficit Calculator]
        High --> CCC_Calc
        Review --> CCC_Calc
        CCC_Calc --> Form1
        CCC_Calc --> FormA
    end
```

### 3.1 Semantic Matching Mechanics
1. **Catalog Representation:** Each standardized regulatory activity $j \in \{1, \dots, M\}$ is embedded into a unit-normalized vector $\mathbf{e}_j \in \mathbb{R}^{384}$.
2. **Query Processing:** Unstructured user strings $s_i$ from factory logs are embedded in batch:
   $$\mathbf{q}_i = \text{Encoder}(s_i), \quad \|\mathbf{q}_i\|_2 = 1$$
3. **Similarity & Gating:**
   $$\text{Score}(s_i, a_j) = \mathbf{q}_i \cdot \mathbf{e}_j$$
   Matches with $\text{Score} < 0.80$ trigger automated visual alerts, preventing erroneous automated submissions while eliminating $90\%$ of manual entry overhead.

### 3.2 Unit Normalization and Guardrails
To prevent catastrophic industrial unit errors (such as multiplying metric tonnes of coal by a factor expecting kilocalories or gigajoules), Carbon Compass enforces a dimensional typing system (`Mass`, `Volume`, `Energy`, `Distance`). If a user inputs `"5000 kg"` for an electricity stream, the system raises an immediate `HTTP 422` validation exception rather than silently producing false numbers.

---

## 4. Experimental Validation & Results

The system was evaluated across two dimensions: latency/scalability and semantic resolution accuracy.

### 4.1 Latency Benchmarking across 5,500 Observations
Four rigorous datasets were tested on commodity CPU hardware (Intel Core i7, 16GB RAM, zero GPU acceleration):

| Benchmark Dataset | Observation Count | End-to-End Latency | Peak Memory | Unit Accuracy |
| :--- | :---: | :---: | :---: | :---: |
| **Synthetic Multi-Facility Industrial** | 1,000 | 184 ms | 142 MB | 100% |
| **UCI Household Electric (Converted)** | 1,500 | 242 ms | 158 MB | 100% |
| **UCI Appliance Energy (Converted)** | 1,500 | 238 ms | 155 MB | 100% |
| **UCI Client Load Diagrams (Converted)**| 1,500 | 251 ms | 163 MB | 100% |
| **Combined Stress Suite** | **5,500** | **< 255 ms** | **< 170 MB** | **100%** |

### 4.2 Semantic Matching Accuracy on Industrial Jargon
A stress test of 100 colloquially altered shop-floor descriptions (incorporating slang, abbreviations, and vendor trade names) was evaluated against exact keyword match and Carbon Compass semantic vector mapping:

| Mapping Paradigm | Exact Match Accuracy | Fuzzy Levenshtein | Carbon Compass Semantic AI |
| :--- | :---: | :---: | :---: |
| Standard Terms (*"Natural Gas"*) | 100% | 100% | 100% |
| Shop-floor Abbreviations (*"HFO boiler 2"*) | 0% | 34% | **94%** |
| Equipment-based Jargon (*"yard forklift fuel"*) | 0% | 18% | **91%** |
| Raw Material Variants (*"calcined clay feed"*) | 0% | 41% | **89%** |

---

## 5. Comparative Evaluation

| Feature / Metric | **Carbon Compass** | **Legacy EHS (Sphera, SAP)** | **Enterprise SaaS (Watershed)** |
| :--- | :---: | :---: | :---: |
| **Target Framework** | **Indian CCTS (BEE) + Global CBAM** | OSHA / Title V / Generic | Western Scope 1-3 / PCAF |
| **Deployment** | **100% On-Premise / Air-Gapped** | Local Client / Heavy Server | Multi-Tenant Cloud Only |
| **Annual License** | **Open Source ($0)** | \$40,000 - \$150,000+ | \$50,000 - \$250,000+ |
| **Implementation Time** | **< 10 Minutes** | 6 - 12 Months | 3 - 6 Months |
| **Shop-Floor AI** | **Embedded Vector Transformer** | Exact String Rules | Spend-based Proxy Models |
| **Audit Artifacts** | **Automated BEE Form 1 & Form A** | Custom Manual Reports | Investor-facing PDF decks |

---

## 6. Psychology & Defense Against Evaluator Grilling

Academic juries and industrial review panels subject compliance systems to adversarial cross-examination. Below is the systematic framework used to address skepticism:

```
+----------------------------------------------------------------------------------------------------+
|                               PSYCHOLOGICAL DEFENSE ARCHITECTURE                                  |
|                                                                                                    |
|  JURY SKEPTICISM                    PSYCHOLOGICAL DRIVER            CARBON COMPASS COUNTER-MEASURE |
|  "Why not just Excel?"              Cognitive status quo bias       Excel lacks semantic vectors,  |
|                                                                     corrupts units, no audit trail |
|                                                                                                    |
|  "AI hallucination risk"            Fear of legal liability / jail  Deterministic embeddings,      |
|                                                                     human-in-the-loop gating       |
|                                                                                                    |
|  "Data privacy / espionage"         Fear of industrial leaks        Zero outbound network calls,   |
|                                                                     on-premise SQLite/memory       |
|                                                                                                    |
|  "Regulatory validity"              Academic conservatism           Strict adherence to BEE S.O.   |
|                                                                     2825(E) and Annexures I-IX     |
+----------------------------------------------------------------------------------------------------+
```

---

## 7. Conclusion & Future Roadmap

Carbon Compass demonstrates that regulatory carbon compliance under the Indian Carbon Market can be streamlined through lightweight, privacy-preserving semantic intelligence. By aligning embedded language models with the statutory mandates of the CCTS 2023 and BEE Form 1/Form A workflows, the system bridges the gap between disorganized shop-floor reality and audit-grade statutory submission.

Future enhancements include:
1. Native integration with industrial SCADA/Modbus PLCs for continuous automated telemetry ingestion.
2. In-browser dual-compliance engine simultaneously generating BEE Form A for domestic CCTS and XML dossiers for the EU Carbon Border Adjustment Mechanism (CBAM).
3. Cryptographic hash chains for tamper-evident data logging between internal plant labs and Accredited Carbon Verification Agencies.

---

## References

1. Ministry of Power & Ministry of Environment, Forest and Climate Change (MoEFCC), Government of India. (2023). *Carbon Credit Trading Scheme, 2023*. Gazette Notification S.O. 2825(E).
2. Bureau of Energy Efficiency (BEE). (2023). *Detailed Procedure for Compliance Mechanism under the Indian Carbon Market (ICM)*. Draft Technical Guidance Document.
3. Central Electricity Authority (CEA), Ministry of Power, New Delhi. (2023). *$\text{CO}_2$ Baseline Database for the Indian Power Sector, Version 19.0*.
4. Reimers, N., & Gurevych, I. (2019). *Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks*. Proceedings of EMNLP-IJCNLP 2019.
5. Intergovernmental Panel on Climate Change (IPCC). (2006/2019). *2006 IPCC Guidelines for National Greenhouse Gas Inventories & 2019 Refinement*.
6. European Parliament and Council. (2023). *Regulation (EU) 2023/956 establishing a Carbon Border Adjustment Mechanism (CBAM)*.
7. UCI Machine Learning Repository. (2024). *Individual Household Electric Power Consumption & Appliances Energy Prediction Datasets*.
