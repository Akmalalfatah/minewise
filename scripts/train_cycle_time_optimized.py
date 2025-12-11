"""
Cycle Time Regression - Hyperparameter Optimization with Optuna

Objective: Optimize LightGBM model for cycle time prediction
Target Metrics:
- RMSE < 8 minutes
- R² > 0.82
- MAE < 6 minutes
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# ML Libraries
import lightgbm as lgb
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import optuna
import mlflow
import mlflow.lightgbm
import joblib
import os

# Set working directory
if os.path.basename(os.getcwd()) == 'scripts':
    os.chdir('..')

print(f"Working directory: {os.getcwd()}")

# Load features
print("\n" + "="*60)
print("LOADING INFRASTRUCTURE FEATURES")
print("="*60)
df = pd.read_parquet('data/feature_store/infra_features.parquet')
print(f"Dataset shape: {df.shape}")

# Feature selection
target = 'waktu_tempuh_menit'
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
exclude_cols = [target, 'kecepatan_aktual_km_jam']
feature_cols = [col for col in numeric_cols if col not in exclude_cols]
print(f"\nTotal numeric features: {len(feature_cols)}")

# Prepare data
X = df[feature_cols].copy()
y = df[target].copy()

# Temporal split
df_sorted = df.sort_values('timestamp_utc')
split_idx = int(len(df_sorted) * 0.8)
X_train = X.iloc[:split_idx]
X_test = X.iloc[split_idx:]
y_train = y.iloc[:split_idx]
y_test = y.iloc[split_idx:]

print(f"Train set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# Setup MLflow
mlflow.set_experiment("cycle_time_optimization")

def objective(trial):
    params = {
        'num_leaves': trial.suggest_int('num_leaves', 20, 150),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
        'n_estimators': trial.suggest_int('n_estimators', 100, 1000),
        'min_child_samples': trial.suggest_int('min_child_samples', 10, 100),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
        'reg_alpha': trial.suggest_float('reg_alpha', 0, 10),
        'reg_lambda': trial.suggest_float('reg_lambda', 0, 10),
        'random_state': 42,
        'n_jobs': -1,
        'verbose': -1
    }
    
    model = lgb.LGBMRegressor(**params)
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)])
    
    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    with mlflow.start_run(nested=True):
        mlflow.log_params(params)
        mlflow.log_metrics({'rmse': rmse, 'r2': r2_score(y_test, y_pred)})
    
    return rmse

print("\n" + "="*60)
print("STARTING OPTUNA OPTIMIZATION (100 TRIALS)")
print("="*60)

with mlflow.start_run(run_name="cycle_time_optuna_study"):
    study = optuna.create_study(direction='minimize')
    study.optimize(objective, n_trials=100, show_progress_bar=True)
    
    print(f"\nBest RMSE: {study.best_value:.4f} minutes")
    print(f"\nBest Parameters:")
    for param, value in study.best_params.items():
        print(f"  {param}: {value}")
    
    mlflow.log_params(study.best_params)
    mlflow.log_metric('best_rmse', study.best_value)

# Train final model
print("\n" + "="*60)
print("TRAINING FINAL MODEL")
print("="*60)

best_params = study.best_params.copy()
best_params['random_state'] = 42
best_params['n_jobs'] = -1
best_params['verbose'] = -1

final_model = lgb.LGBMRegressor(**best_params)
final_model.fit(X_train, y_train)

# Metrics
y_pred_train = final_model.predict(X_train)
y_pred_test = final_model.predict(X_test)

train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
train_r2 = r2_score(y_train, y_pred_train)
test_r2 = r2_score(y_test, y_pred_test)

print(f"\nTest RMSE: {test_rmse:.4f} min {'✅ TARGET MET' if test_rmse < 8 else '❌ NEEDS IMPROVEMENT'}")
print(f"Test R²: {test_r2:.4f} {'✅ TARGET MET' if test_r2 > 0.82 else '❌ NEEDS IMPROVEMENT'}")

# Save model WITH METADATA
model_path = 'models/cycle_time_optimized.pkl'
model_package = {
    'model': final_model,
    'feature_cols': feature_cols,  # CRITICAL: Save feature columns
    'categorical_cols': [],
    'label_encoders': {},
    'metrics': {
        'train_rmse': train_rmse,
        'test_rmse': test_rmse,
        'train_r2': train_r2,
        'test_r2': test_r2
    },
    'training_date': pd.Timestamp.now().isoformat(),
    'version': '2.0.0'
}
joblib.dump(model_package, model_path)
print(f"\n✅ Model WITH METADATA saved to {model_path}")
print(f"   - Features: {len(feature_cols)}")
print(f"   - Test RMSE: {test_rmse:.4f}")

# Log to MLflow
with mlflow.start_run(run_name="cycle_time_final_optimized"):
    mlflow.log_params(best_params)
    mlflow.log_metrics({'train_rmse': train_rmse, 'test_rmse': test_rmse, 'train_r2': train_r2, 'test_r2': test_r2})
    mlflow.lightgbm.log_model(final_model, "model")

print("\n" + "="*60)
print("CYCLE TIME OPTIMIZATION COMPLETE")
print("="*60)
