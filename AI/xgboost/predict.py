import pickle
import numpy as np
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

with open("models/yield_model.pkl",    "rb") as f: yield_model    = pickle.load(f)
with open("models/quality_model.pkl",  "rb") as f: quality_model  = pickle.load(f)
with open("models/crop_encoder.pkl",   "rb") as f: crop_enc       = pickle.load(f)
with open("models/type_encoder.pkl",   "rb") as f: type_enc       = pickle.load(f)
with open("models/quality_encoder.pkl","rb") as f: quality_enc    = pickle.load(f)
with open("models/features.pkl",       "rb") as f: FEATURES       = pickle.load(f)

class PredictionRequest(BaseModel):
    nom_plante:                  str
    type_plante:                 str
    superficie_hectare:          float
    latitude:                    float
    longitude:                   float
    ph:                          float
    azote_ppm:                   float
    phosphore_ppm:               float
    potassium_ppm:               float
    humidite_percent:            float
    matiere_organique_percent:   Optional[float] = 2.0
    temperature_celsius:         float
    year:                        Optional[int]   = 2024

class PredictionResponse(BaseModel):
    yield_tons_per_hectare: float
    quality:                str
    quality_probabilities:  dict
    climate_used:           dict

def fetch_climate(lat: float, lon: float, year: int) -> dict:
    start = f"{year}-03-01"
    end   = f"{year}-08-31"
    url = (
        f"https://archive-api.open-meteo.com/v1/archive"
        f"?latitude={lat}&longitude={lon}"
        f"&start_date={start}&end_date={end}"
        f"&daily=temperature_2m_mean,precipitation_sum,"
        f"relative_humidity_2m_mean,shortwave_radiation_sum"
        f"&timezone=Africa%2FTunis"
    )
    r = requests.get(url, timeout=15)
    d = r.json().get("daily", {})

    def safe_mean(key):
        vals = [v for v in d.get(key, []) if v is not None]
        return round(float(np.mean(vals)), 2) if vals else 20.0

    def safe_sum(key):
        vals = [v for v in d.get(key, []) if v is not None]
        return round(float(sum(vals)), 2) if vals else 200.0

    return {
        "avg_temp":      safe_mean("temperature_2m_mean"),
        "total_rain":    safe_sum("precipitation_sum"),
        "avg_humidity":  safe_mean("relative_humidity_2m_mean"),
        "avg_radiation": safe_mean("shortwave_radiation_sum"),
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    try:
        nom_enc  = crop_enc.transform([req.nom_plante])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Unknown crop: {req.nom_plante}")
    try:
        type_enc_val = type_enc.transform([req.type_plante])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Unknown type: {req.type_plante}")

    try:
        climate = fetch_climate(req.latitude, req.longitude, req.year)
    except Exception:
        climate = {"avg_temp": 22.0, "total_rain": 250.0, "avg_humidity": 55.0, "avg_radiation": 18.0}

    features = {
        "nom_plante_enc":              nom_enc,
        "type_plante_enc":             type_enc_val,
        "superficie_hectare":          req.superficie_hectare,
        "latitude":                    req.latitude,
        "longitude":                   req.longitude,
        "ph":                          req.ph,
        "azote_ppm":                   req.azote_ppm,
        "phosphore_ppm":               req.phosphore_ppm,
        "potassium_ppm":               req.potassium_ppm,
        "humidite_percent":            req.humidite_percent,
        "matiere_organique_percent":   req.matiere_organique_percent,
        "temperature_celsius":         req.temperature_celsius,
        "avg_temp":                    climate["avg_temp"],
        "total_rain":                  climate["total_rain"],
        "avg_humidity":                climate["avg_humidity"],
        "avg_radiation":               climate["avg_radiation"],
        "year":                        req.year,
    }

    X = np.array([[features[f] for f in FEATURES]])

    yield_pred   = float(yield_model.predict(X)[0])
    quality_pred = quality_model.predict(X)[0]
    quality_proba = quality_model.predict_proba(X)[0]
    quality_label = quality_enc.inverse_transform([quality_pred])[0]
    quality_probs = {
        cls: round(float(prob), 3)
        for cls, prob in zip(quality_enc.classes_, quality_proba)
    }

    return PredictionResponse(
        yield_tons_per_hectare=round(yield_pred, 3),
        quality=quality_label,
        quality_probabilities=quality_probs,
        climate_used=climate,
    )

@app.get("/health")
def health():
    return {"status": "ok"}