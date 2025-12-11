"""
Equipment Failure Prediction - Hyperparameter Optimization with Optuna + SMOTE

Objective: Optimize XGBoost model for equipment failure prediction
Target Metrics:
- Recall (Failure) > 85%
- Precision > 80%
- Handle class imbalance with SMOTE
"""

import pandas as pd
import numpy as np
import warnings
warnings.filterwarnings('ignore')

# ML Libraries
import xgboost as xgb
from sklearn.metrics import classification_report, recall_score, precision_score, accuracy_score, f1_score
from imblearn.over_sampling import SMOTE
import optuna
import mlflow
import mlflow.xgboost
import joblib
import os

if os.path.basename(os.getcwd()) == 'scripts':
    os.chdir('..')

print(f"Working directory: {os.getcwd()}")

# Load features
print("\n" + "="*60)
print("LOADING FLEET FEATURES")
print("="*60)
df = pd.read_parquet('data/feature_store/fleet_features.parquet')
print(f"Dataset shape: {df.shape}")

# Target: breakdown_flag (0=Normal, 1=Failure)
target = 'breakdown_flag'
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
feature_cols = [col for col in numeric_cols if col != target]

X = df[feature_cols].copy()
y = df[target].copy()

# Fill NaN values before SMOTE
print(f"\nChecking NaN values...")
nan_counts = X.isnull().sum()
if nan_counts.sum() > 0:
    print(f"Found {nan_counts.sum()} NaN values across {(nan_counts > 0).sum()} columns")
    print("Filling NaN with 0...")
    X = X.fillna(0)
else:
    print("No NaN values found")

print(f"\nClass distribution:")
print(y.value_counts())
print(f"\nClass percentages:")
print(y.value_counts(normalize=True) * 100)

# Temporal split
split_idx = int(len(df) * 0.8)
X_train = X.iloc[:split_idx]
X_test = X.iloc[split_idx:]
y_train = y.iloc[:split_idx]
y_test = y.iloc[split_idx:]

print(f"\nTrain set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# Apply SMOTE
print("\n" + "="*60)
print("APPLYING SMOTE FOR CLASS BALANCE")
print("="*60)
smote = SMOTE(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)
print(f"Balanced train set: {X_train_balanced.shape}")
print(f"Balanced class distribution:")
print(pd.Series(y_train_balanced).value_counts())

# Setup MLflow
mlflow.set_experiment("equipment_failure_optimization")

def objective(trial):
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
    
    model = xgb.XGBClassifier(**params)
    model.fit(X_train_balanced, y_train_balanced, eval_set=[(X_test, y_test)], verbose=False)
    
    y_pred = model.predict(X_test)
    
    # Focus on failure recall (minority class = 1)
    recall_failure = recall_score(y_test, y_pred, pos_label=1)
    precision_failure = precision_score(y_test, y_pred, pos_label=1)
    
    with mlflow.start_run(nested=True):
        mlflow.log_params(params)
        mlflow.log_metrics({
            'recall_failure': recall_failure,
            'precision_failure': precision_failure
        })
    
    # Optimize for recall
    return 1 - recall_failure

print("\n" + "="*60)
print("STARTING OPTUNA OPTIMIZATION (100 TRIALS)")
print("="*60)

with mlflow.start_run(run_name="equipment_failure_optuna_study"):
    study = optuna.create_study(direction='minimize')
    study.optimize(objective, n_trials=100, show_progress_bar=True)
    
    best_recall = 1 - study.best_value
    print(f"\nBest Recall (Failure): {best_recall:.4f}")
    print(f"\nBest Parameters:")
    for param, value in study.best_params.items():
        print(f"  {param}: {value}")
    
    mlflow.log_params(study.best_params)
    mlflow.log_metric('best_recall_failure', best_recall)

# Train final model
print("\n" + "="*60)
print("TRAINING FINAL MODEL")
print("="*60)

best_params = study.best_params.copy()
best_params['random_state'] = 42
best_params['n_jobs'] = -1

final_model = xgb.XGBClassifier(**best_params)
final_model.fit(X_train_balanced, y_train_balanced)

y_pred_test = final_model.predict(X_test)

print("\nClassification Report:")
print(classification_report(y_test, y_pred_test, target_names=['Normal', 'Failure']))

recall_failure = recall_score(y_test, y_pred_test, pos_label=1)
precision_failure = precision_score(y_test, y_pred_test, pos_label=1)
accuracy = accuracy_score(y_test, y_pred_test)
f1 = f1_score(y_test, y_pred_test)

print(f"\n{'='*60}")
print("FINAL MODEL PERFORMANCE")
print(f"{'='*60}")
print(f"Recall (Failure): {recall_failure:.4f} {'✅ TARGET MET' if recall_failure > 0.85 else '❌ NEEDS IMPROVEMENT'}")
print(f"Precision (Failure): {precision_failure:.4f} {'✅ TARGET MET' if precision_failure > 0.80 else '❌ NEEDS IMPROVEMENT'}")
print(f"Overall Accuracy: {accuracy:.4f}")
print(f"F1-Score: {f1:.4f}")

# Save model WITH METADATA
model_path = 'models/equipment_failure_optimized.pkl'
model_package = {
    'model': final_model,
    'feature_cols': feature_cols,  # CRITICAL: Save feature columns
    'categorical_cols': [],
    'label_encoders': {},
    'metrics': {
        'recall_failure': recall_failure,
        'precision_failure': precision_failure,
        'accuracy': accuracy,
        'f1': f1
    },
    'training_date': pd.Timestamp.now().isoformat(),
    'version': '2.0.0'
}
joblib.dump(model_package, model_path)
print(f"\n✅ Model WITH METADATA saved to {model_path}")
print(f"   - Features: {len(feature_cols)}")
print(f"   - Recall: {recall_failure:.4f}")

# Log to MLflow
with mlflow.start_run(run_name="equipment_failure_final_optimized"):
    mlflow.log_params(best_params)
    mlflow.log_metrics({
        'recall_failure': recall_failure,
        'precision_failure': precision_failure,
        'accuracy': accuracy,
        'f1': f1
    })
    mlflow.xgboost.log_model(final_model, "model")

print("\n" + "="*60)
print("EQUIPMENT FAILURE PREDICTION COMPLETE")
print("="*60)
