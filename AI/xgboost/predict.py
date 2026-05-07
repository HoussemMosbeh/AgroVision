import pickle
import numpy as np
import requests
import joblib  # Add this for stable loading
import xgboost as xgb
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import warnings

app = FastAPI()

# Try to load with stable formats first, fallback to pickle
def load_model_safely(filepath):
    """Load model with priority: joblib > json > pickle"""
    # Try joblib first (good for sklearn models)
    joblib_path = filepath.replace('.pkl', '.joblib')
    if filepath.endswith('.joblib') or os.path.exists(joblib_path):
        try:
            return joblib.load(joblib_path)
        except:
            pass
    
    # Try JSON for XGBoost
    json_path = filepath.replace('.pkl', '.json')
    if os.path.exists(json_path):
        try:
            booster = xgb.Booster()
            booster.load_model(json_path)
            return booster
        except:
            pass
    
    # Fallback to pickle with compatibility patch
    try:
        # Patch for numpy compatibility
        try:
            import numpy._core
        except ImportError:
            try:
                from numpy import core as _core
                import sys
                sys.modules['numpy._core'] = _core
            except ImportError:
                pass
        
        with open(filepath, "rb") as f:
            return pickle.load(f)
    except Exception as e:
        warnings.warn(f"Failed to load {filepath}: {e}")
        return None

# Load all models
yield_model = load_model_safely("models/yield_model.pkl")
quality_model = load_model_safely("models/quality_model.pkl")
crop_enc = load_model_safely("models/crop_encoder.pkl")
type_enc = load_model_safely("models/type_encoder.pkl")
quality_enc = load_model_safely("models/quality_encoder.pkl")

# Load features list (usually safe with pickle)
with open("models/features.pkl", "rb") as f:
    FEATURES = pickle.load(f)

# Verify all models loaded successfully
if any(m is None for m in [yield_model, quality_model, crop_enc, type_enc, quality_enc]):
    raise RuntimeError("Failed to load one or more models. Please retrain or convert models.")

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
    try:
        r = requests.get(url, timeout=15)
        r.raise_for_status()
        d = r.json().get("daily", {})
    except:
        # Return default values if API fails
        return {
            "avg_temp": 22.0,
            "total_rain": 250.0,
            "avg_humidity": 55.0,
            "avg_radiation": 18.0,
        }

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
    # Encode categorical variables
    try:
        nom_enc = crop_enc.transform([req.nom_plante])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Unknown crop: {req.nom_plante}")
    
    try:
        type_enc_val = type_enc.transform([req.type_plante])[0]
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Unknown type: {req.type_plante}")

    # Fetch climate data
    try:
        climate = fetch_climate(req.latitude, req.longitude, req.year)
    except Exception:
        climate = {"avg_temp": 22.0, "total_rain": 250.0, "avg_humidity": 55.0, "avg_radiation": 18.0}

    # Prepare features in the exact order expected by the model
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

    # Create feature array
    X = np.array([[features[f] for f in FEATURES]])
    
    # Make predictions
    yield_pred = float(yield_model.predict(X)[0])
    
    # Handle both sklearn and XGBoost models for quality prediction
    if hasattr(quality_model, 'predict_proba'):
        quality_pred = quality_model.predict(X)[0]
        quality_proba = quality_model.predict_proba(X)[0]
    else:
        # For XGBoost Booster objects
        quality_pred = quality_model.predict(X)[0]
        quality_proba = None
    
    quality_label = quality_enc.inverse_transform([quality_pred])[0]
    
    # Create probability dictionary
    if quality_proba is not None:
        quality_probs = {
            cls: round(float(prob), 3)
            for cls, prob in zip(quality_enc.classes_, quality_proba)
        }
    else:
        quality_probs = {quality_label: 1.0}

    return PredictionResponse(
        yield_tons_per_hectare=round(yield_pred, 3),
        quality=quality_label,
        quality_probabilities=quality_probs,
        climate_used=climate,
    )

@app.get("/health")
def health():
    return {"status": "ok"}