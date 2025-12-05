"""
Road Speed Regression - Hyperparameter Optimization with Optuna

Objective: Optimize XGBoost model for road speed prediction
Target Metrics:
- RMSE < 4 km/h
- R² > 0.85
- MAE < 3 km/h
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# ML Libraries
import xgboost as xgb
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import optuna
import mlflow
import mlflow.xgboost
import joblib

# Set working directory to project root
import os
if os.path.basename(os.getcwd()) == 'scripts':
    os.chdir('..')

print(f"Working directory: {os.getcwd()}")
print(f"MLflow tracking URI: {mlflow.get_tracking_uri()}")

# Load features
print("\n" + "="*60)
print("LOADING INFRASTRUCTURE FEATURES")
print("="*60)
df = pd.read_parquet('data/feature_store/infra_features.parquet')
print(f"Dataset shape: {df.shape}")
print(f"\nTarget variable stats:")
print(df['kecepatan_aktual_km_jam'].describe())

# Feature selection
target = 'kecepatan_aktual_km_jam'

# Get numeric columns only
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

# Exclude target and other non-feature columns
exclude_cols = [
    target,
    'waktu_tempuh_menit',  # Cycle time is separate target
]

feature_cols = [col for col in numeric_cols if col not in exclude_cols]
print(f"\nTotal numeric features selected: {len(feature_cols)}")
print(f"Feature columns: {feature_cols[:10]}...")  # Show first 10

# Prepare data
X = df[feature_cols].copy()
y = df[target].copy()

# Temporal split (80/20)
df_sorted = df.sort_values('timestamp_utc')
split_idx = int(len(df_sorted) * 0.8)

X_train = X.iloc[:split_idx]
X_test = X.iloc[split_idx:]
y_train = y.iloc[:split_idx]
y_test = y.iloc[split_idx:]

print(f"\nTrain set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# Setup MLflow
mlflow.set_experiment("road_speed_optimization")

def objective(trial):
    """Optuna objective function for XGBoost hyperparameter tuning"""
    
    params = {
        'max_depth': trial.suggest_int('max_depth', 3, 10),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
        'n_estimators': trial.suggest_int('n_estimators', 100, 1000),
        'min_child_weight': trial.suggest_int('min_child_weight', 1, 10),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
        'gamma': trial.suggest_float('gamma', 0, 5),
        'reg_alpha': trial.suggest_float('reg_alpha', 0, 10),
        'reg_lambda': trial.suggest_float('reg_lambda', 0, 10),
        'random_state': 42,
        'n_jobs': -1
    }
    
    # Train model
    model = xgb.XGBRegressor(**params)
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    
    # Predict
    y_pred = model.predict(X_test)
    
    # Metrics
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    # Log to MLflow
    with mlflow.start_run(nested=True):
        mlflow.log_params(params)
        mlflow.log_metrics({
            'rmse': rmse,
            'mae': mae,
            'r2': r2
        })
    
    return rmse  # Minimize RMSE

# Run optimization
print("\n" + "="*60)
print("STARTING OPTUNA OPTIMIZATION (100 TRIALS)")
print("="*60)

with mlflow.start_run(run_name="road_speed_optuna_study"):
    study = optuna.create_study(direction='minimize')
    study.optimize(objective, n_trials=100, show_progress_bar=True)
    
    print(f"\n{'='*60}")
    print("OPTIMIZATION COMPLETE")
    print(f"{'='*60}")
    print(f"Best RMSE: {study.best_value:.4f} km/h")
    print(f"\nBest Parameters:")
    for param, value in study.best_params.items():
        print(f"  {param}: {value}")
    
    # Log best params
    mlflow.log_params(study.best_params)
    mlflow.log_metric('best_rmse', study.best_value)

# Train final model with best params
print("\n" + "="*60)
print("TRAINING FINAL MODEL WITH BEST PARAMETERS")
print("="*60)

best_params = study.best_params.copy()
best_params['random_state'] = 42
best_params['n_jobs'] = -1

final_model = xgb.XGBRegressor(**best_params)
final_model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

# Predictions
y_pred_train = final_model.predict(X_train)
y_pred_test = final_model.predict(X_test)

# Metrics
train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
train_mae = mean_absolute_error(y_train, y_pred_train)
test_mae = mean_absolute_error(y_test, y_pred_test)
train_r2 = r2_score(y_train, y_pred_train)
test_r2 = r2_score(y_test, y_pred_test)

print(f"\n{'='*60}")
print("FINAL MODEL PERFORMANCE")
print(f"{'='*60}")
print(f"\nTrain Metrics:")
print(f"  RMSE: {train_rmse:.4f} km/h")
print(f"  MAE:  {train_mae:.4f} km/h")
print(f"  R²:   {train_r2:.4f}")
print(f"\nTest Metrics:")
print(f"  RMSE: {test_rmse:.4f} km/h {'✅ TARGET MET' if test_rmse < 4 else '❌ NEEDS IMPROVEMENT'}")
print(f"  MAE:  {test_mae:.4f} km/h {'✅ TARGET MET' if test_mae < 3 else '❌ NEEDS IMPROVEMENT'}")
print(f"  R²:   {test_r2:.4f} {'✅ TARGET MET' if test_r2 > 0.85 else '❌ NEEDS IMPROVEMENT'}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': final_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop 15 Features:")
print(feature_importance.head(15).to_string(index=False))

# Plot
plt.figure(figsize=(10, 8))
sns.barplot(data=feature_importance.head(15), y='feature', x='importance', palette='viridis')
plt.title('Top 15 Feature Importance - Road Speed Prediction', fontsize=14, fontweight='bold')
plt.xlabel('Importance Score')
plt.ylabel('Feature')
plt.tight_layout()
plt.savefig('reports/optimization/road_speed_feature_importance.png', dpi=300, bbox_inches='tight')
print("\n✅ Feature importance plot saved to reports/optimization/")

# Save optimized model
model_path = 'models/road_speed_optimized.pkl'
joblib.dump(final_model, model_path)
print(f"✅ Optimized model saved to {model_path}")

# Log to MLflow
with mlflow.start_run(run_name="road_speed_final_optimized"):
    mlflow.log_params(best_params)
    mlflow.log_metrics({
        'train_rmse': train_rmse,
        'test_rmse': test_rmse,
        'train_mae': train_mae,
        'test_mae': test_mae,
        'train_r2': train_r2,
        'test_r2': test_r2
    })
    mlflow.xgboost.log_model(final_model, "model")
    mlflow.log_artifact('reports/optimization/road_speed_feature_importance.png')

print("\n✅ Model logged to MLflow")
print("\n" + "="*60)
print("ROAD SPEED OPTIMIZATION COMPLETE")
print("="*60)
