# convert_models.py
import pickle
import joblib
import xgboost as xgb
import os

def convert_models():
    """Convert pickle models to stable formats"""
    
    models_to_convert = [
        "models/yield_model.pkl",
        "models/quality_model.pkl",
        "models/crop_encoder.pkl",
        "models/type_encoder.pkl",
        "models/quality_encoder.pkl",
    ]
    
    for model_path in models_to_convert:
        if not os.path.exists(model_path):
            print(f"⚠️  Not found: {model_path}")
            continue
            
        print(f"📦 Converting: {model_path}")
        
        # Load with pickle (compatibility mode)
        try:
            import sys
            try:
                import numpy._core
            except ImportError:
                try:
                    from numpy import core as _core
                    sys.modules['numpy._core'] = _core
                except:
                    pass
            
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
        except Exception as e:
            print(f"❌ Failed to load {model_path}: {e}")
            continue
        
        # Save in stable format
        if isinstance(model, (xgb.Booster, xgb.XGBModel)):
            # XGBoost model - save as JSON
            json_path = model_path.replace('.pkl', '.json')
            if isinstance(model, xgb.XGBModel):
                model.get_booster().save_model(json_path)
            else:
                model.save_model(json_path)
            print(f"✅ Saved XGBoost model: {json_path}")
        
        # Save all models as joblib (works for sklearn, encoders, etc.)
        joblib_path = model_path.replace('.pkl', '.joblib')
        joblib.dump(model, joblib_path)
        print(f"✅ Saved joblib copy: {joblib_path}")

if __name__ == "__main__":
    os.makedirs("models", exist_ok=True)
    convert_models()
    print("\n✨ Conversion complete! You can now use the .joblib or .json files.")