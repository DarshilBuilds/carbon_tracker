import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
import numpy as np

from epa_factors import EPA_FACTORS
from schemas import ActivityInput, MapRequest
from unit_validation import (
    can_convert_unit,
    convert_quantity,
    get_direct_emissions_multiplier,
    is_direct_emissions_unit,
    units_match,
)

app = FastAPI(title="Carbon Compass API")

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:8080,http://127.0.0.1:8080",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
EPA_NAMES = [f["activity"] for f in EPA_FACTORS]
EPA_EMBEDDINGS = model.encode(EPA_NAMES, normalize_embeddings=True)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/map")
def map_activities(req: MapRequest):
    if not req.activities:
        return []

    names = [a.activityName for a in req.activities]
    unique_names = list(dict.fromkeys(names))
    unique_embeddings = model.encode(unique_names, batch_size=64, normalize_embeddings=True)
    unique_sims = unique_embeddings @ EPA_EMBEDDINGS.T
    name_to_sims = {name: unique_sims[k] for k, name in enumerate(unique_names)}

    results = []
    for i, activity in enumerate(req.activities):
        sims_i = name_to_sims[activity.activityName]

        # 1. Direct GHG emissions case (e.g. Metric Tons CO2e, kg CO2e)
        if activity.unit and is_direct_emissions_unit(activity.unit):
            mult = get_direct_emissions_multiplier(activity.unit)
            calc_emissions = round(activity.quantity * mult, 2)

            best_idx = int(np.argmax(sims_i))
            best_sim = float(sims_i[best_idx])
            matched_name = EPA_FACTORS[best_idx]["activity"]
            confidence = max(85, round(max(0.0, min(1.0, best_sim)) * 100))

            results.append({
                "userActivity": activity.activityName,
                "matchedEpaActivity": f"{matched_name} (Direct GHG Emissions)",
                "emissionFactor": mult,
                "emissionFactorUnit": f"kg CO2e/{activity.unit}",
                "confidenceScore": confidence,
                "quantity": activity.quantity,
                "quantityUnit": activity.unit,
                "unitAssumed": False,
                "facility": activity.facility,
                "reportingPeriod": activity.reportingPeriod,
                "zipCode": activity.zipCode,
                "calculatedEmissions": calc_emissions,
            })
            continue

        # 2. Activity with standard activity unit
        best_idx = int(np.argmax(sims_i))
        factor = EPA_FACTORS[best_idx]
        expected_unit = factor["unit"].rsplit("/", maxsplit=1)[-1]

        converted_qty, can_convert = (
            convert_quantity(activity.quantity, activity.unit, expected_unit)
            if activity.unit
            else (activity.quantity, True)
        )

        if activity.unit and not can_convert:
            # Check if any other factor in EPA_FACTORS is compatible and has reasonable similarity
            compatible_indices = [
                idx
                for idx, f in enumerate(EPA_FACTORS)
                if can_convert_unit(activity.unit, f["unit"].rsplit("/", maxsplit=1)[-1])
            ]
            if compatible_indices:
                best_comp_subidx = int(np.argmax(sims_i[compatible_indices]))
                best_comp_idx = compatible_indices[best_comp_subidx]
                comp_sim = float(sims_i[best_comp_idx])
                unconstrained_sim = float(sims_i[best_idx])
                if comp_sim >= 0.20 and (unconstrained_sim - comp_sim) < 0.40:
                    best_idx = best_comp_idx
                    factor = EPA_FACTORS[best_idx]
                    expected_unit = factor["unit"].rsplit("/", maxsplit=1)[-1]
                    converted_qty, can_convert = convert_quantity(
                        activity.quantity, activity.unit, expected_unit
                    )

        if activity.unit and not can_convert:
            results.append({
                "userActivity": activity.activityName,
                "matchedEpaActivity": f"Skipped - Unit Mismatch (Expected {expected_unit})",
                "emissionFactor": 0,
                "emissionFactorUnit": expected_unit,
                "confidenceScore": 0,
                "quantity": activity.quantity,
                "quantityUnit": activity.unit,
                "unitAssumed": False,
                "facility": activity.facility,
                "reportingPeriod": activity.reportingPeriod,
                "zipCode": activity.zipCode,
                "calculatedEmissions": 0,
            })
            continue

        best_sim = float(sims_i[best_idx])
        confidence = round(max(0.0, min(1.0, best_sim)) * 100)

        results.append({
            "userActivity": activity.activityName,
            "matchedEpaActivity": factor["activity"],
            "emissionFactor": factor["factor"],
            "emissionFactorUnit": factor["unit"],
            "confidenceScore": confidence,
            "quantity": activity.quantity,
            "quantityUnit": activity.unit or expected_unit,
            "unitAssumed": activity.unit is None,
            "facility": activity.facility,
            "reportingPeriod": activity.reportingPeriod,
            "zipCode": activity.zipCode,
            "calculatedEmissions": round(converted_qty * factor["factor"], 2),
        })

    return results


@app.get("/api/epa-factors")
def get_epa_factors():
    return EPA_FACTORS
