import pandas as pd
import numpy as np
import requests
import time
import os

np.random.seed(42)

CROPS = [
    {"nom": "Maïs",           "type": "Céréale", "base_yield": 8.5,  "quality_sensitivity": 0.8},
    {"nom": "Blé",            "type": "Céréale", "base_yield": 4.2,  "quality_sensitivity": 0.7},
    {"nom": "Orge",           "type": "Céréale", "base_yield": 3.8,  "quality_sensitivity": 0.6},
    {"nom": "Soja",           "type": "Céréale", "base_yield": 2.8,  "quality_sensitivity": 0.7},
    {"nom": "Pomme",          "type": "Fruit",   "base_yield": 25.0, "quality_sensitivity": 0.9},
    {"nom": "Raisin",         "type": "Fruit",   "base_yield": 12.0, "quality_sensitivity": 0.95},
    {"nom": "Pêche",          "type": "Fruit",   "base_yield": 18.0, "quality_sensitivity": 0.9},
    {"nom": "Olive",          "type": "Fruit",   "base_yield": 5.0,  "quality_sensitivity": 0.6},
    {"nom": "Pastèque",       "type": "Fruit",   "base_yield": 35.0, "quality_sensitivity": 0.75},
    {"nom": "Cerise",         "type": "Fruit",   "base_yield": 8.0,  "quality_sensitivity": 0.95},
    {"nom": "Myrtille",       "type": "Fruit",   "base_yield": 6.0,  "quality_sensitivity": 0.9},
    {"nom": "Orange",         "type": "Fruit",   "base_yield": 22.0, "quality_sensitivity": 0.8},
    {"nom": "Fraise",         "type": "Fruit",   "base_yield": 20.0, "quality_sensitivity": 0.9},
    {"nom": "Tomate",         "type": "Légume",  "base_yield": 60.0, "quality_sensitivity": 0.85},
    {"nom": "Pomme de terre", "type": "Légume",  "base_yield": 28.0, "quality_sensitivity": 0.7},
    {"nom": "Poivron",        "type": "Légume",  "base_yield": 18.0, "quality_sensitivity": 0.8},
    {"nom": "Courge",         "type": "Légume",  "base_yield": 22.0, "quality_sensitivity": 0.75},
]

LOCATIONS = [
    {"region": "Tunis",    "lat": 36.8065, "lon": 10.1815},
    {"region": "Sfax",     "lat": 34.7406, "lon": 10.7603},
    {"region": "Sousse",   "lat": 35.8245, "lon": 10.6346},
    {"region": "Béja",     "lat": 36.7333, "lon": 9.1833},
    {"region": "Bizerte",  "lat": 37.2744, "lon": 9.8739},
    {"region": "Nabeul",   "lat": 36.4561, "lon": 10.7376},
    {"region": "Kairouan", "lat": 35.6781, "lon": 10.0964},
    {"region": "Gabès",    "lat": 33.8833, "lon": 10.0833},
]

def fetch_climate(lat, lon, year):
    start = f"{year}-03-01"
    end   = f"{year}-08-31"
    url = (
        f"https://archive-api.open-meteo.com/v1/archive"
        f"?latitude={lat}&longitude={lon}"
        f"&start_date={start}&end_date={end}"
        f"&daily=temperature_2m_mean,precipitation_sum,relative_humidity_2m_mean,shortwave_radiation_sum"
        f"&timezone=Africa%2FTunis"
    )
    try:
        r = requests.get(url, timeout=15)
        d = r.json().get("daily", {})
        def safe_mean(key):
            vals = [v for v in d.get(key, []) if v is not None]
            return round(np.mean(vals), 2) if vals else None
        def safe_sum(key):
            vals = [v for v in d.get(key, []) if v is not None]
            return round(sum(vals), 2) if vals else None
        return {
            "avg_temp":     safe_mean("temperature_2m_mean"),
            "total_rain":   safe_sum("precipitation_sum"),
            "avg_humidity": safe_mean("relative_humidity_2m_mean"),
            "avg_radiation":safe_mean("shortwave_radiation_sum"),
        }
    except Exception as e:
        print(f"  Climate fetch failed ({lat},{lon},{year}): {e}")
        return None

def compute_yield(crop, soil, climate, superficie):
    base = crop["base_yield"]

    # pH score: optimal 6.0-7.0
    ph = soil["ph"]
    ph_score = max(0, 1 - abs(ph - 6.5) / 3.5)

    # NPK score
    n_score  = min(1.0, soil["azote_ppm"] / 150)
    p_score  = min(1.0, soil["phosphore_ppm"] / 60)
    k_score  = min(1.0, soil["potassium_ppm"] / 250)
    npk_score = (n_score + p_score + k_score) / 3

    # Moisture
    hum_score = max(0, 1 - abs(soil["humidite_percent"] - 40) / 40)

    # Organic matter
    om_score = min(1.0, soil["matiere_organique_percent"] / 5.0) if soil["matiere_organique_percent"] else 0.5

    # Climate
    temp_score = max(0, 1 - abs(climate["avg_temp"] - 22) / 20)
    rain_score = min(1.0, climate["total_rain"] / 400)
    rad_score  = min(1.0, climate["avg_radiation"] / 20)

    soil_score    = (ph_score * 0.25 + npk_score * 0.4 + hum_score * 0.2 + om_score * 0.15)
    climate_score = (temp_score * 0.4 + rain_score * 0.4 + rad_score * 0.2)
    combined      = (soil_score * 0.5 + climate_score * 0.5)

    noise        = np.random.normal(0, 0.05)
    yield_val    = base * combined * (1 + noise)
    yield_val    = max(0.1, yield_val)

    return round(yield_val, 3)

def compute_quality(crop, soil, climate, yield_val, base_yield):
    sensitivity = crop["quality_sensitivity"]
    yield_ratio = min(1.0, yield_val / base_yield)

    ph_ok  = 1 if 5.5 <= soil["ph"] <= 7.5 else 0.4
    npk_ok = min(1.0, (soil["azote_ppm"] + soil["phosphore_ppm"] + soil["potassium_ppm"]) / 450)
    clim_ok = max(0, 1 - abs(climate["avg_temp"] - 22) / 15)

    score = (yield_ratio * 0.4 + ph_ok * 0.2 + npk_ok * 0.2 + clim_ok * 0.2) * sensitivity
    score += np.random.normal(0, 0.08)
    score  = max(0, min(1, score))

    if score >= 0.70:
        return "high"
    elif score >= 0.45:
        return "medium"
    else:
        return "low"

def generate_soil(rng=np.random):
    return {
        "ph":                      round(rng.uniform(4.5, 8.5), 2),
        "azote_ppm":               round(rng.uniform(30, 250), 1),
        "phosphore_ppm":           round(rng.uniform(10, 100), 1),
        "potassium_ppm":           round(rng.uniform(50, 400), 1),
        "humidite_percent":        round(rng.uniform(10, 70), 1),
        "matiere_organique_percent": round(rng.uniform(0.5, 8.0), 2),
        "temperature_celsius":     round(rng.uniform(10, 40), 1),
    }

def main():
    os.makedirs("data", exist_ok=True)

    print("Fetching climate data from Open-Meteo...")
    climate_cache = {}
    years = [2022, 2023, 2024]
    for loc in LOCATIONS:
        for year in years:
            key = (loc["lat"], loc["lon"], year)
            print(f"  Fetching {loc['region']} {year}...")
            climate_cache[key] = fetch_climate(loc["lat"], loc["lon"], year)
            time.sleep(0.5)

    print("Generating synthetic samples...")
    rows = []
    SAMPLES_PER_COMBO = 20

    for crop in CROPS:
        for loc in LOCATIONS:
            for year in years:
                key = (loc["lat"], loc["lon"], year)
                climate = climate_cache.get(key)
                if climate is None or any(v is None for v in climate.values()):
                    continue
                for _ in range(SAMPLES_PER_COMBO):
                    soil       = generate_soil()
                    superficie = round(np.random.uniform(1, 50), 2)
                    y          = compute_yield(crop, soil, climate, superficie)
                    q          = compute_quality(crop, soil, climate, y, crop["base_yield"])

                    rows.append({
                        "nom_plante":                  crop["nom"],
                        "type_plante":                 crop["type"],
                        "superficie_hectare":          superficie,
                        "latitude":                    loc["lat"],
                        "longitude":                   loc["lon"],
                        "region":                      loc["region"],
                        "ph":                          soil["ph"],
                        "azote_ppm":                   soil["azote_ppm"],
                        "phosphore_ppm":               soil["phosphore_ppm"],
                        "potassium_ppm":               soil["potassium_ppm"],
                        "humidite_percent":            soil["humidite_percent"],
                        "matiere_organique_percent":   soil["matiere_organique_percent"],
                        "temperature_celsius":         soil["temperature_celsius"],
                        "avg_temp":                    climate["avg_temp"],
                        "total_rain":                  climate["total_rain"],
                        "avg_humidity":                climate["avg_humidity"],
                        "avg_radiation":               climate["avg_radiation"],
                        "year":                        year,
                        "yield_tons_per_hectare":      y,
                        "quality":                     q,
                    })

    df = pd.DataFrame(rows)
    out = "data/agrovision_dataset.csv"
    df.to_csv(out, index=False)
    print(f"Dataset saved: {out}")
    print(f"Total rows: {len(df)}")
    print(df["quality"].value_counts())
    print(df[["yield_tons_per_hectare"]].describe())

if __name__ == "__main__":
    main()