import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score, classification_report
from xgboost import XGBRegressor, XGBClassifier

os.makedirs("models", exist_ok=True)

df = pd.read_csv("data/agrovision_dataset.csv")

# Encode categorical
crop_enc = LabelEncoder()
type_enc = LabelEncoder()
df["nom_plante_enc"]  = crop_enc.fit_transform(df["nom_plante"])
df["type_plante_enc"] = type_enc.fit_transform(df["type_plante"])

quality_enc = LabelEncoder()
df["quality_enc"] = quality_enc.fit_transform(df["quality"])

FEATURES = [
    "nom_plante_enc", "type_plante_enc",
    "superficie_hectare", "latitude", "longitude",
    "ph", "azote_ppm", "phosphore_ppm", "potassium_ppm",
    "humidite_percent", "matiere_organique_percent", "temperature_celsius",
    "avg_temp", "total_rain", "avg_humidity", "avg_radiation",
    "year",
]

X = df[FEATURES]
y_yield   = df["yield_tons_per_hectare"]
y_quality = df["quality_enc"]

X_train, X_test, yy_train, yy_test, yq_train, yq_test = train_test_split(
    X, y_yield, y_quality, test_size=0.2, random_state=42
)

# Yield model
print("Training yield model...")
yield_model = XGBRegressor(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    n_jobs=-1,
)
yield_model.fit(X_train, yy_train)
yy_pred = yield_model.predict(X_test)
print(f"  MAE:  {mean_absolute_error(yy_test, yy_pred):.3f} t/ha")
print(f"  R²:   {r2_score(yy_test, yy_pred):.3f}")

# Quality model
print("Training quality model...")
class_counts = np.bincount(yq_train)
class_weights = {i: max(class_counts) / c for i, c in enumerate(class_counts)}
scale_pos = class_weights

quality_model = XGBClassifier(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    n_jobs=-1,
    eval_metric="mlogloss",
)
sample_weights = np.array([class_weights[c] for c in yq_train])
quality_model.fit(X_train, yq_train, sample_weight=sample_weights)
yq_pred = quality_model.predict(X_test)
print(classification_report(yq_test, yq_pred, target_names=quality_enc.classes_))

# Save models and encoders
with open("models/yield_model.pkl",   "wb") as f: pickle.dump(yield_model, f)
with open("models/quality_model.pkl", "wb") as f: pickle.dump(quality_model, f)
with open("models/crop_encoder.pkl",  "wb") as f: pickle.dump(crop_enc, f)
with open("models/type_encoder.pkl",  "wb") as f: pickle.dump(type_enc, f)
with open("models/quality_encoder.pkl","wb") as f: pickle.dump(quality_enc, f)
with open("models/features.pkl",      "wb") as f: pickle.dump(FEATURES, f)

print("Models saved to models/")