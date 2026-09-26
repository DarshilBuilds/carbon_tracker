import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
import numpy as np

from epa_factors import EPA_FACTORS
from schemas import ActivityInput, MapRequest
from unit_validation import units_match

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
    names = [a.activityName for a in req.activities]
    embeddings = model.encode(names, normalize_embeddings=True)
    sims = embeddings @ EPA_EMBEDDINGS.T

    results = []
    for i, activity in enumerate(req.activities):
        best_idx = int(np.argmax(sims[i]))
        best_sim = float(sims[i][best_idx])
        factor = EPA_FACTORS[best_idx]
        expected_unit = factor["unit"].rsplit("/", maxsplit=1)[-1]
        if activity.unit and not units_match(activity.unit, expected_unit):
            raise HTTPException(
                status_code=422,
                detail=f"{activity.activityName} expects {expected_unit}, but the uploaded unit is {activity.unit}.",
            )
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
            "calculatedEmissions": round(activity.quantity * factor["factor"], 2),
        })

    return results


@app.get("/api/epa-factors")
def get_epa_factors():
    return EPA_FACTORS
