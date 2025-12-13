import logging
import warnings
from pathlib import Path
import joblib
import pandas as pd

from .feature_engineering import create_feature_engineer

warnings.filterwarnings("ignore")

logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).parent.parent.parent
MODELS_DIR = PROJECT_ROOT / "models"

class ModelRegistry:
    def __init__(self):
        self.models = {}
        self.model_wrappers = {}
        self.load_all_models()

    def _extract_model_from_dict(self, model_data, model_name):
        if isinstance(model_data, dict) and "model" in model_data:
            self.model_wrappers[model_name] = {
                "encoders": model_data.get("label_encoders", {}),
                "features": model_data.get("feature_cols", []),
                "categorical": model_data.get("categorical_cols", []),
            }
            return model_data["model"]
        return model_data

    def _prepare_input_with_encoding(self, model_name, X: pd.DataFrame) -> pd.DataFrame:
        if model_name not in self.model_wrappers:
            return X
        wrapper = self.model_wrappers[model_name]
        encoders = wrapper.get("encoders", {})
        categorical = wrapper.get("categorical", [])
        X_encoded = X.copy()
        for col in categorical:
            if col in X_encoded.columns and col in encoders:
                try:
                    X_encoded[col] = encoders[col].transform(X_encoded[col].astype(str))
                except Exception:
                    X_encoded[col] = 0
        return X_encoded

    def _ensure_feature_order(self, model_name, X: pd.DataFrame) -> pd.DataFrame:
        feats = []
        if model_name in self.model_wrappers and self.model_wrappers[model_name].get("features"):
            feats = list(self.model_wrappers[model_name]["features"])
        elif hasattr(self.models[model_name], "feature_names_in_"):
            feats = list(self.models[model_name].feature_names_in_)
        if feats:
            for f in feats:
                if f not in X.columns:
                    X[f] = 0
            return X[feats]
        return X

    def predict(self, model_name: str, X: pd.DataFrame):
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")
        X = self._ensure_feature_order(model_name, X.copy())
        X = self._prepare_input_with_encoding(model_name, X)
        return self.models[model_name].predict(X)

    def predict_proba(self, model_name: str, X: pd.DataFrame):
        if model_name not in self.models:
            raise ValueError(f"Model {model_name} not found")
        X = self._ensure_feature_order(model_name, X.copy())
        X = self._prepare_input_with_encoding(model_name, X)
        m = self.models[model_name]
        if not hasattr(m, "predict_proba"):
            raise AttributeError(f"Model {model_name} does not support predict_proba")
        return m.predict_proba(X)

    def load_all_models(self):
        self.models["road_speed"] = self._extract_model_from_dict(
            joblib.load(MODELS_DIR / "road_speed_optimized.pkl"), "road_speed"
        )
        self.models["cycle_time"] = self._extract_model_from_dict(
            joblib.load(MODELS_DIR / "cycle_time_optimized.pkl"), "cycle_time"
        )

        try:
            self.models["road_risk"] = self._extract_model_from_dict(
                joblib.load(MODELS_DIR / "road_risk_optimized.pkl"), "road_risk"
            )
        except Exception:
            self.models["road_risk"] = self._extract_model_from_dict(
                joblib.load(MODELS_DIR / "infra_road_risk_classification.pkl"), "road_risk"
            )

        self.models["equipment_failure"] = self._extract_model_from_dict(
            joblib.load(MODELS_DIR / "equipment_failure_optimized.pkl"), "equipment_failure"
        )

        self.models["port_operability"] = self._extract_model_from_dict(
            joblib.load(MODELS_DIR / "port_operability_optimized.pkl"), "port_operability"
        )

registry = ModelRegistry()
feature_engineer = create_feature_engineer()
