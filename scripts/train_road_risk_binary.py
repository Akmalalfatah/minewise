"""
Road Risk - Binary Safety Detector
Focus: Detect TERBATAS (dangerous) vs Safe (BAIK + WASPADA)

This is more effective for imbalanced safety-critical detection
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, recall_score, precision_score, accuracy_score
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import joblib
import json
from datetime import datetime
import os

print("="*80)
print("🚨 ROAD RISK - BINARY SAFETY DETECTOR (TERBATAS vs SAFE)")
print("="*80)

# Load data
df = pd.read_parquet('data/feature_store/infra_features.parquet')

# Features
target = 'status_jalan'
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
exclude_cols = ['waktu_tempuh_menit', 'kecepatan_aktual_km_jam']
feature_cols = [col for col in numeric_cols if col not in exclude_cols]

X = df[feature_cols].fillna(0)
y_original = df[target]

# Convert to binary: TERBATAS vs SAFE (BAIK + WASPADA)
y_binary = y_original.apply(lambda x: 'TERBATAS' if x == 'TERBATAS' else 'SAFE')

print(f"\n📊 Binary class distribution:")
print(y_binary.value_counts())
print(f"\nPercentages:")
print(y_binary.value_counts(normalize=True) * 100)

# Stratified split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_binary, test_size=0.2, random_state=42, stratify=y_binary
)

print(f"\n✅ Train: {X_train.shape}, Test: {X_test.shape}")
print(f"Test TERBATAS: {(y_test == 'TERBATAS').sum()} samples")

# Apply SMOTE
print("\n🔧 Applying SMOTE...")
smote = SMOTE(random_state=42, k_neighbors=3)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)
print(f"After SMOTE: {pd.Series(y_train_balanced).value_counts().to_dict()}")

# Train binary classifier with aggressive class weight for TERBATAS
print("\n🎯 Training Binary Classifier (TERBATAS detection)...")

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=25,
    min_samples_split=3,
    min_samples_leaf=1,
    max_features='sqrt',
    class_weight={'SAFE': 1, 'TERBATAS': 5},  # 5x weight for dangerous
    random_state=42,
    n_jobs=-1
)

model.fit(X_train_balanced, y_train_balanced)

# Predict
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)

print("\n" + "="*80)
print("📊 BINARY CLASSIFICATION RESULTS")
print("="*80)

print("\n", classification_report(y_test, y_pred, target_names=['SAFE', 'TERBATAS'], digits=4))

cm = confusion_matrix(y_test, y_pred, labels=['SAFE', 'TERBATAS'])
print(f"\n📈 Confusion Matrix:")
print(f"{'':>15} {'SAFE':>10} {'TERBATAS':>10}")
print(f"{'SAFE':>15} {cm[0][0]:>10} {cm[0][1]:>10}")
print(f"{'TERBATAS':>15} {cm[1][0]:>10} {cm[1][1]:>10}")

# Calculate TERBATAS metrics
terbatas_actual = (y_test == 'TERBATAS').sum()
terbatas_tp = cm[1][1]
terbatas_fp = cm[0][1]
terbatas_fn = cm[1][0]

terbatas_recall = terbatas_tp / (terbatas_tp + terbatas_fn) if (terbatas_tp + terbatas_fn) > 0 else 0
terbatas_precision = terbatas_tp / (terbatas_tp + terbatas_fp) if (terbatas_tp + terbatas_fp) > 0 else 0
accuracy = accuracy_score(y_test, y_pred)

print(f"\n🚨 TERBATAS SAFETY METRICS:")
print(f"   Recall (Detection Rate): {terbatas_recall:.2%} (Target: >90%)")
print(f"   Detected: {terbatas_tp}/{terbatas_actual} dangerous conditions")
print(f"   Missed: {terbatas_fn} dangerous conditions")
print(f"   Precision: {terbatas_precision:.2%}")
print(f"   False Alarms: {terbatas_fp} (acceptable for safety)")
print(f"   Overall Accuracy: {accuracy:.2%}")

if terbatas_recall >= 0.90:
    print(f"\n✅ ✅ ✅ TARGET MET! ✅ ✅ ✅")
    print(f"   Detects {terbatas_recall:.1%} of ALL dangerous conditions!")
    print(f"   Improvement: {(terbatas_recall - 0.133) * 100:.1f} percentage points from baseline!")
    
    # Save binary model
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/road_risk_binary_model.pkl')
    
    metadata = {
        'model_name': 'road_risk_binary_safety_detector',
        'training_date': datetime.now().isoformat(),
        'approach': 'Binary Classification (TERBATAS vs SAFE) + SMOTE + ClassWeight',
        'model_type': 'RandomForest',
        'class_weight': {'SAFE': 1, 'TERBATAS': 5},
        'smote_applied': True,
        'metrics': {
            'terbatas_recall': float(terbatas_recall),
            'terbatas_precision': float(terbatas_precision),
            'overall_accuracy': float(accuracy),
            'false_positives': int(terbatas_fp),
            'false_negatives': int(terbatas_fn)
        },
        'training_samples': len(X_train_balanced),
        'test_samples': len(X_test),
        'safety_critical': True,
        'usage': 'Predicts TERBATAS (dangerous) vs SAFE. Use for safety alerts.'
    }
    
    with open('models/road_risk_binary_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n💾 Binary model saved to: models/road_risk_binary_model.pkl")
    print(f"💾 Metadata saved to: models/road_risk_binary_metadata.json")
    
elif terbatas_recall >= 0.80:
    print(f"\n⚠️ Close to target ({terbatas_recall:.1%})")
    print(f"   Improvement: {(terbatas_recall - 0.133) * 100:.1f} percentage points!")
    print(f"   Consider using with manual review of high-risk cases")
    
    # Still save as it's a major improvement
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/road_risk_binary_model.pkl')
    
    metadata = {
        'model_name': 'road_risk_binary_safety_detector',
        'training_date': datetime.now().isoformat(),
        'approach': 'Binary Classification (TERBATAS vs SAFE) + SMOTE + ClassWeight',
        'metrics': {
            'terbatas_recall': float(terbatas_recall),
            'terbatas_precision': float(terbatas_precision),
            'overall_accuracy': float(accuracy)
        },
        'note': 'Recall <90% but significant improvement from baseline 13.3%'
    }
    
    with open('models/road_risk_binary_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n💾 Model saved (with note about recall)")
else:
    print(f"\n❌ Recall {terbatas_recall:.1%} still below 80%")
    print("   This is a very imbalanced dataset problem")
    print("   Recommendation: Collect more TERBATAS samples or use ensemble approach")

print("\n" + "="*80)
print("🎓 LEARNING: Binary classification better for extreme imbalance!")
print("="*80)
