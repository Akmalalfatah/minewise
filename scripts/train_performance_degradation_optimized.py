"""
Performance Degradation Model - Optimized with Optuna
Predicts equipment efficiency ratio to enable proactive maintenance scheduling

Target: R² > 0.70
Business Value: Early detection of performance degradation for optimal maintenance timing
"""

import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import xgboost as xgb
import optuna
from optuna.samplers import TPESampler
import pickle
import warnings
warnings.filterwarnings('ignore')

# =============================================================================
# 1. LOAD & PREPARE DATA
# =============================================================================

print("="*80)
print("PERFORMANCE DEGRADATION MODEL - OPTUNA OPTIMIZATION")
print("="*80)
print("\n[1/6] Loading fleet features data...")

# Load feature store
df = pd.read_parquet('data/feature_store/fleet_features.parquet')
print(f"✓ Loaded {len(df):,} records with {len(df.columns)} features")

# =============================================================================
# 2. FEATURE ENGINEERING - CREATE EFFICIENCY RATIO TARGET
# =============================================================================

print("\n[2/6] Engineering efficiency_ratio target variable...")

# Calculate efficiency ratio based on actual vs expected performance
# Efficiency = (Actual Output / Expected Output) * 100
# Expected output = capacity * ritase
# Actual output = total_muatan_ton

# For equipment that's operating, calculate efficiency
df['expected_output_ton'] = df['kapasitas_default_ton'] * df['jumlah_ritase']
df['expected_output_ton'] = df['expected_output_ton'].replace(0, np.nan)

# Efficiency ratio: actual muatan / expected output
df['efficiency_ratio'] = (df['total_muatan_ton'] / df['expected_output_ton']) * 100

# Cap efficiency at reasonable bounds (equipment can't perform > 120% or < 0%)
df['efficiency_ratio'] = df['efficiency_ratio'].clip(0, 120)

# Only consider Beroperasi status for efficiency calculation
# For non-operating status, efficiency is effectively 0 or NA
efficiency_data = df[df['status_operasi'] == 'Beroperasi'].copy()
efficiency_data = efficiency_data.dropna(subset=['efficiency_ratio'])

print(f"✓ Created efficiency_ratio target")
print(f"  - Operating records: {len(efficiency_data):,}")
print(f"  - Efficiency range: [{efficiency_data['efficiency_ratio'].min():.1f}%, {efficiency_data['efficiency_ratio'].max():.1f}%]")
print(f"  - Mean efficiency: {efficiency_data['efficiency_ratio'].mean():.1f}%")
print(f"  - Median efficiency: {efficiency_data['efficiency_ratio'].median():.1f}%")

# =============================================================================
# 3. FEATURE SELECTION
# =============================================================================

print("\n[3/6] Selecting features for degradation prediction...")

# Features that indicate degradation patterns
feature_cols = [
    # Equipment characteristics
    'equipment_age_years',
    'umur_tahun',
    'durasi_jam',
    
    # Usage patterns (key degradation indicators)
    'daily_usage_hours',
    'utilization_rate',
    'cumulative_hours_30d',
    'jumlah_ritase',
    
    # Maintenance indicators
    'days_since_last_op',
    'overdue_maintenance_flag',
    'breakdown_history_count',
    'breakdown_rate_30d',
    
    # Health scores (comprehensive degradation signals)
    'health_score_age',
    'health_score_maintenance',
    'health_score_usage',
    'health_score_breakdown',
    'equipment_health_score',
    
    # Operational context
    'total_muatan_ton',
    'kapasitas_default_ton',
    
    # Risk indicators
    'high_age_risk',
    'high_usage_flag',
    'age_usage_interaction',
    'combined_risk_score',
    
    # Categorical (will be encoded)
    'tipe_alat',
    'shift',
    'kondisi',
    'health_category'
]

# Prepare dataset
X = efficiency_data[feature_cols].copy()
y = efficiency_data['efficiency_ratio'].copy()

# Encode categorical features
categorical_cols = ['tipe_alat', 'shift', 'kondisi', 'health_category']
label_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    label_encoders[col] = le

print(f"✓ Selected {len(feature_cols)} features")
print(f"  - Numerical: {len(feature_cols) - len(categorical_cols)}")
print(f"  - Categorical (encoded): {len(categorical_cols)}")

# =============================================================================
# 4. TRAIN/TEST SPLIT
# =============================================================================

print("\n[4/6] Splitting data...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"✓ Train set: {len(X_train):,} samples")
print(f"✓ Test set: {len(X_test):,} samples")

# =============================================================================
# 5. OPTUNA HYPERPARAMETER OPTIMIZATION
# =============================================================================

print("\n[5/6] Starting Optuna hyperparameter optimization...")
print("Target: R² > 0.70")
print("Optimization metric: Maximize R² score")
print("Expected runtime: ~15-20 minutes for 100 trials")

def objective(trial):
    """Optuna objective function for XGBoost regression"""
    
    params = {
        'objective': 'reg:squarederror',
        'eval_metric': 'rmse',
        'booster': 'gbtree',
        'tree_method': 'hist',
        'random_state': 42,
        
        # Hyperparameters to optimize
        'max_depth': trial.suggest_int('max_depth', 3, 12),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
        'n_estimators': trial.suggest_int('n_estimators', 100, 1000, step=50),
        'min_child_weight': trial.suggest_int('min_child_weight', 1, 10),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
        'gamma': trial.suggest_float('gamma', 0, 5),
        'reg_alpha': trial.suggest_float('reg_alpha', 0, 5),
        'reg_lambda': trial.suggest_float('reg_lambda', 0, 5),
    }
    
    model = xgb.XGBRegressor(**params)
    
    # Cross-validation score
    cv_scores = cross_val_score(
        model, X_train, y_train, 
        cv=5, scoring='r2', n_jobs=-1
    )
    
    return cv_scores.mean()

# Create study
study = optuna.create_study(
    direction='maximize',
    sampler=TPESampler(seed=42)
)

# Optimize
study.optimize(objective, n_trials=100, show_progress_bar=True)

print("\n✓ Optimization complete!")
print(f"  - Best R² (CV): {study.best_value:.4f}")
print(f"  - Best trial: #{study.best_trial.number}")
print("\nBest hyperparameters:")
for key, value in study.best_params.items():
    print(f"  - {key}: {value}")

# =============================================================================
# 6. TRAIN FINAL MODEL & EVALUATE
# =============================================================================

print("\n[6/6] Training final model with best parameters...")

# Train final model
best_params = study.best_params.copy()
best_params.update({
    'objective': 'reg:squarederror',
    'eval_metric': 'rmse',
    'booster': 'gbtree',
    'tree_method': 'hist',
    'random_state': 42
})

final_model = xgb.XGBRegressor(**best_params)
final_model.fit(X_train, y_train)

# Predictions
y_pred_train = final_model.predict(X_train)
y_pred_test = final_model.predict(X_test)

# Metrics
train_r2 = r2_score(y_train, y_pred_train)
test_r2 = r2_score(y_test, y_pred_test)
train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
train_mae = mean_absolute_error(y_train, y_pred_train)
test_mae = mean_absolute_error(y_test, y_pred_test)

# =============================================================================
# FINAL RESULTS
# =============================================================================

print("\n" + "="*80)
print("FINAL MODEL PERFORMANCE")
print("="*80)

print("\n📊 Regression Metrics:")
print(f"{'Metric':<20} {'Train':<15} {'Test':<15} {'Target':<15}")
print("-" * 65)
print(f"{'R² Score':<20} {train_r2:<15.4f} {test_r2:<15.4f} {'>0.70':<15}")
print(f"{'RMSE':<20} {train_rmse:<15.2f} {test_rmse:<15.2f} {'Lower better':<15}")
print(f"{'MAE':<20} {train_mae:<15.2f} {test_mae:<15.2f} {'Lower better':<15}")

# Target achievement
target_met = test_r2 > 0.70
status_symbol = "✅" if target_met else "⚠️"
print(f"\n{status_symbol} Target Achievement: {'MET' if target_met else 'BELOW TARGET'}")

if target_met:
    improvement = ((test_r2 - 0.70) / 0.70) * 100
    print(f"   R² is {improvement:.1f}% above target!")
else:
    gap = ((0.70 - test_r2) / 0.70) * 100
    print(f"   R² is {gap:.1f}% below target")

# Feature importance
print("\n🔍 Top 10 Most Important Features:")
feature_importance = pd.DataFrame({
    'feature': feature_cols,
    'importance': final_model.feature_importances_
}).sort_values('importance', ascending=False)

for idx, row in feature_importance.head(10).iterrows():
    print(f"   {row['feature']:<35} {row['importance']:.4f}")

# =============================================================================
# SAVE MODEL
# =============================================================================

print("\n💾 Saving model artifacts...")

# Create models directory
Path('models').mkdir(exist_ok=True)

# Save model and encoders
model_artifact = {
    'model': final_model,
    'label_encoders': label_encoders,
    'feature_cols': feature_cols,
    'categorical_cols': categorical_cols,
    'metrics': {
        'train_r2': float(train_r2),
        'test_r2': float(test_r2),
        'train_rmse': float(train_rmse),
        'test_rmse': float(test_rmse),
        'train_mae': float(train_mae),
        'test_mae': float(test_mae),
        'target_met': bool(target_met)
    },
    'best_params': best_params,
    'feature_importance': feature_importance.to_dict('records')
}

model_path = 'models/performance_degradation_optimized.pkl'
with open(model_path, 'wb') as f:
    pickle.dump(model_artifact, f)

print(f"✓ Model saved: {model_path}")
print(f"✓ File size: {Path(model_path).stat().st_size / 1024:.2f} KB")

# =============================================================================
# BUSINESS INSIGHTS
# =============================================================================

print("\n" + "="*80)
print("💼 BUSINESS VALUE & INSIGHTS")
print("="*80)

print("\n🎯 Key Findings:")
print("   1. Model can predict equipment efficiency with R² =", f"{test_r2:.4f}")
print("   2. Prediction error (RMSE) =", f"{test_rmse:.2f}% efficiency points")
print("   3. Top degradation indicators:")

for idx, row in feature_importance.head(5).iterrows():
    print(f"      - {row['feature']}: {row['importance']:.4f}")

print("\n📈 Business Applications:")
print("   • Proactive Maintenance Scheduling:")
print("     - Predict when equipment efficiency drops below 80%")
print("     - Schedule maintenance before major degradation")
print("   • Resource Optimization:")
print("     - Identify underperforming equipment for reassignment")
print("     - Optimize fleet utilization based on efficiency trends")
print("   • Cost Savings:")
print("     - Reduce fuel consumption from inefficient operations")
print("     - Minimize production delays from unexpected degradation")

print("\n🔧 Recommended Actions:")
if test_r2 >= 0.75:
    print("   ✅ Model ready for production deployment")
    print("   → Integrate into maintenance scheduling system")
    print("   → Setup automated alerts for efficiency < 80%")
elif test_r2 >= 0.70:
    print("   ✅ Model meets target, ready for pilot deployment")
    print("   → Test with maintenance team for 1-2 weeks")
    print("   → Gather feedback for refinement")
else:
    print("   ⚠️ Model below target, consider:")
    print("   → Collect more historical maintenance data")
    print("   → Engineer additional temporal features")
    print("   → Try ensemble methods (LightGBM, CatBoost)")

print("\n" + "="*80)
print("✅ PERFORMANCE DEGRADATION MODEL - TRAINING COMPLETE")
print("="*80)
