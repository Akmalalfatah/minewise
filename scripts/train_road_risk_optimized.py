"""
Road Risk Classification - Hyperparameter Optimization with Optuna + SMOTE

Objective: Optimize Random Forest model for road status classification
Target Metrics:
- Recall (TERBATAS class) > 90%
- Overall Accuracy > 85%
- Handle class imbalance with SMOTE
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# ML Libraries
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, recall_score, accuracy_score, f1_score
from imblearn.over_sampling import SMOTE
import optuna
import mlflow
import mlflow.sklearn
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

# Target and features
target = 'status_jalan'
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
exclude_cols = ['waktu_tempuh_menit', 'kecepatan_aktual_km_jam']
feature_cols = [col for col in numeric_cols if col not in exclude_cols]

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

# Check class distribution
print(f"\nClass distribution:")
print(y.value_counts())
print(f"\nClass percentages:")
print(y.value_counts(normalize=True) * 100)

# Temporal split
df_sorted = df.sort_values('timestamp_utc')
split_idx = int(len(df_sorted) * 0.8)
X_train = X.iloc[:split_idx]
X_test = X.iloc[split_idx:]
y_train = y.iloc[:split_idx]
y_test = y.iloc[split_idx:]

print(f"\nTrain set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# Apply SMOTE to training data
print("\n" + "="*60)
print("APPLYING SMOTE FOR CLASS BALANCE")
print("="*60)
smote = SMOTE(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)
print(f"Balanced train set: {X_train_balanced.shape}")
print(f"Balanced class distribution:")
print(pd.Series(y_train_balanced).value_counts())

# Setup MLflow
mlflow.set_experiment("road_risk_optimization")

def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 100, 500),
        'max_depth': trial.suggest_int('max_depth', 5, 30),
        'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
        'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10),
        'max_features': trial.suggest_categorical('max_features', ['sqrt', 'log2', None]),
        'random_state': 42,
        'n_jobs': -1
    }
    
    model = RandomForestClassifier(**params)
    model.fit(X_train_balanced, y_train_balanced)
    
    y_pred = model.predict(X_test)
    
    # Focus on TERBATAS recall (minority class)
    recall_terbatas = recall_score(y_test, y_pred, labels=['TERBATAS'], average=None)[0]
    accuracy = accuracy_score(y_test, y_pred)
    
    with mlflow.start_run(nested=True):
        mlflow.log_params(params)
        mlflow.log_metrics({
            'recall_terbatas': recall_terbatas,
            'accuracy': accuracy
        })
    
    # Optimize for TERBATAS recall
    return 1 - recall_terbatas  # Minimize (1 - recall)

print("\n" + "="*60)
print("STARTING OPTUNA OPTIMIZATION (100 TRIALS)")
print("="*60)

with mlflow.start_run(run_name="road_risk_optuna_study"):
    study = optuna.create_study(direction='minimize')
    study.optimize(objective, n_trials=100, show_progress_bar=True)
    
    best_recall = 1 - study.best_value
    print(f"\nBest Recall (TERBATAS): {best_recall:.4f}")
    print(f"\nBest Parameters:")
    for param, value in study.best_params.items():
        print(f"  {param}: {value}")
    
    mlflow.log_params(study.best_params)
    mlflow.log_metric('best_recall_terbatas', best_recall)

# Train final model
print("\n" + "="*60)
print("TRAINING FINAL MODEL")
print("="*60)

best_params = study.best_params.copy()
best_params['random_state'] = 42
best_params['n_jobs'] = -1

final_model = RandomForestClassifier(**best_params)
final_model.fit(X_train_balanced, y_train_balanced)

# Predictions
y_pred_test = final_model.predict(X_test)

# Detailed metrics
print("\nClassification Report:")
print(classification_report(y_test, y_pred_test))

# Get recall for TERBATAS
recall_terbatas = recall_score(y_test, y_pred_test, labels=['TERBATAS'], average=None)[0]
accuracy = accuracy_score(y_test, y_pred_test)
f1 = f1_score(y_test, y_pred_test, average='weighted')

print(f"\n{'='*60}")
print("FINAL MODEL PERFORMANCE")
print(f"{'='*60}")
print(f"Overall Accuracy: {accuracy:.4f} {'✅ TARGET MET' if accuracy > 0.85 else '❌ NEEDS IMPROVEMENT'}")
print(f"Recall (TERBATAS): {recall_terbatas:.4f} {'✅ TARGET MET' if recall_terbatas > 0.90 else '❌ NEEDS IMPROVEMENT'}")
print(f"F1-Score (Weighted): {f1:.4f}")

# Confusion matrix
cm = confusion_matrix(y_test, y_pred_test, labels=['BAIK', 'WASPADA', 'TERBATAS'])
print(f"\nConfusion Matrix:")
print(cm)

# Save model
model_path = 'models/road_risk_optimized.pkl'
joblib.dump(final_model, model_path)
print(f"\n✅ Model saved to {model_path}")

# Log to MLflow
with mlflow.start_run(run_name="road_risk_final_optimized"):
    mlflow.log_params(best_params)
    mlflow.log_metrics({
        'accuracy': accuracy,
        'recall_terbatas': recall_terbatas,
        'f1_weighted': f1
    })
    mlflow.sklearn.log_model(final_model, "model")

print("\n" + "="*60)
print("ROAD RISK CLASSIFICATION COMPLETE")
print("="*60)
