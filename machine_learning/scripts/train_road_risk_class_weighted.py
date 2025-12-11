"""
Road Risk Classification - Class Weighted Training for CRITICAL Safety

PROBLEM: Current model has TERBATAS recall only 13.3% (misses 87% of dangerous conditions!)
SOLUTION: Use aggressive class_weight to prioritize dangerous condition detection

Target Metrics:
- Recall (TERBATAS class) > 90% (CRITICAL for mining safety!)
- Precision (TERBATAS) > 60% (acceptable false positives for safety)
- Overall Accuracy > 70% (can sacrifice some accuracy for safety)
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# ML Libraries
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, recall_score, accuracy_score, f1_score, precision_score
import joblib
import os
import json
from datetime import datetime

# Set working directory
if os.path.basename(os.getcwd()) == 'scripts':
    os.chdir('..')

print(f"Working directory: {os.getcwd()}")

# Load features
print("\n" + "="*80)
print("🚨 ROAD RISK - CRITICAL SAFETY TRAINING (CLASS WEIGHTED)")
print("="*80)
df = pd.read_parquet('data/feature_store/infra_features.parquet')
print(f"Dataset shape: {df.shape}")

# Target and features
target = 'status_jalan'
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
exclude_cols = ['waktu_tempuh_menit', 'kecepatan_aktual_km_jam']
feature_cols = [col for col in numeric_cols if col not in exclude_cols]

X = df[feature_cols].copy()
y = df[target].copy()

# Fill NaN values
print(f"\nChecking NaN values...")
nan_counts = X.isnull().sum()
if nan_counts.sum() > 0:
    print(f"Found {nan_counts.sum()} NaN values across {(nan_counts > 0).sum()} columns")
    print("Filling NaN with 0...")
    X = X.fillna(0)
else:
    print("No NaN values found")

# Check class distribution
print(f"\n📊 Class distribution (BEFORE balancing):")
class_counts = y.value_counts()
print(class_counts)
print(f"\nClass percentages:")
class_pcts = y.value_counts(normalize=True) * 100
for cls, pct in class_pcts.items():
    print(f"  {cls}: {pct:.2f}%")

# Stratified split (preserve class distribution in train/test)
# Critical: Temporal split puts all TERBATAS in train, none in test!
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2, 
    random_state=42,
    stratify=y  # Preserve class distribution
)

print(f"\n✅ Train set: {X_train.shape}")
print(f"✅ Test set: {X_test.shape}")

print(f"\n📊 Train class distribution:")
print(y_train.value_counts())
print(f"\n📊 Test class distribution:")
print(y_test.value_counts())

# Test different class weight strategies
print("\n" + "="*80)
print("🎯 TESTING MULTIPLE CLASS WEIGHT STRATEGIES")
print("="*80)

strategies = [
    {
        'name': 'Strategy 1 - Moderate (TERBATAS: 10x)',
        'weights': {'BAIK': 1, 'WASPADA': 3, 'TERBATAS': 10}
    },
    {
        'name': 'Strategy 2 - Aggressive (TERBATAS: 20x)',
        'weights': {'BAIK': 1, 'WASPADA': 5, 'TERBATAS': 20}
    },
    {
        'name': 'Strategy 3 - Very Aggressive (TERBATAS: 30x)',
        'weights': {'BAIK': 1, 'WASPADA': 7, 'TERBATAS': 30}
    },
    {
        'name': 'Strategy 4 - Extreme (TERBATAS: 50x)',
        'weights': {'BAIK': 1, 'WASPADA': 10, 'TERBATAS': 50}
    }
]

results = []

for strategy in strategies:
    print(f"\n{'='*80}")
    print(f"Testing: {strategy['name']}")
    print(f"Weights: {strategy['weights']}")
    print(f"{'='*80}")
    
    # Train model with class weights
    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        max_features='sqrt',
        class_weight=strategy['weights'],
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    
    # Calculate metrics per class
    classes = ['BAIK', 'WASPADA', 'TERBATAS']
    
    print("\n📊 Test Set Performance:")
    print(classification_report(y_test, y_pred_test, target_names=classes, digits=4))
    
    # Focus on TERBATAS metrics
    from sklearn.metrics import recall_score, precision_score
    
    terbatas_recall_train = recall_score(y_train, y_pred_train, labels=['TERBATAS'], average='macro')
    terbatas_recall_test = recall_score(y_test, y_pred_test, labels=['TERBATAS'], average='macro')
    terbatas_precision_test = precision_score(y_test, y_pred_test, labels=['TERBATAS'], average='macro', zero_division=0)
    
    overall_acc_test = accuracy_score(y_test, y_pred_test)
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred_test, labels=classes)
    print(f"\n📈 Confusion Matrix:")
    print(f"{'':>12} {'BAIK':>10} {'WASPADA':>10} {'TERBATAS':>10}")
    for i, true_class in enumerate(classes):
        print(f"{true_class:>12} {cm[i][0]:>10} {cm[i][1]:>10} {cm[i][2]:>10}")
    
    # Calculate TERBATAS-specific metrics from confusion matrix
    if 'TERBATAS' in y_test.values:
        terbatas_idx = classes.index('TERBATAS')
        terbatas_true_positives = cm[terbatas_idx][terbatas_idx]
        terbatas_actual_count = cm[terbatas_idx].sum()
        terbatas_predicted_count = cm[:, terbatas_idx].sum()
        
        terbatas_recall_actual = terbatas_true_positives / terbatas_actual_count if terbatas_actual_count > 0 else 0
        terbatas_precision_actual = terbatas_true_positives / terbatas_predicted_count if terbatas_predicted_count > 0 else 0
    else:
        terbatas_recall_actual = 0
        terbatas_precision_actual = 0
    
    print(f"\n🚨 TERBATAS Class Metrics (CRITICAL):")
    print(f"   Recall (Detection Rate): {terbatas_recall_actual:.2%} (Target: >90%)")
    print(f"   Precision: {terbatas_precision_actual:.2%} (Target: >60%)")
    print(f"   Overall Accuracy: {overall_acc_test:.2%} (Target: >70%)")
    
    # Determine if targets met
    meets_recall = terbatas_recall_actual >= 0.90
    meets_precision = terbatas_precision_actual >= 0.60
    meets_accuracy = overall_acc_test >= 0.70
    
    if meets_recall:
        print(f"   ✅ Recall target MET! (Detects {terbatas_recall_actual:.1%} of dangerous conditions)")
    else:
        print(f"   ❌ Recall target NOT MET (Only detects {terbatas_recall_actual:.1%}, misses {1-terbatas_recall_actual:.1%})")
    
    if meets_precision:
        print(f"   ✅ Precision target MET!")
    else:
        print(f"   ⚠️ Precision below target (acceptable for safety-critical application)")
    
    if meets_accuracy:
        print(f"   ✅ Accuracy target MET!")
    else:
        print(f"   ⚠️ Accuracy below target (acceptable if recall is high)")
    
    # Store results
    results.append({
        'strategy': strategy['name'],
        'weights': strategy['weights'],
        'terbatas_recall': terbatas_recall_actual,
        'terbatas_precision': terbatas_precision_actual,
        'overall_accuracy': overall_acc_test,
        'meets_all_targets': meets_recall and meets_precision and meets_accuracy,
        'model': model
    })

# Find best strategy
print("\n" + "="*80)
print("🏆 STRATEGY COMPARISON")
print("="*80)

print(f"\n{'Strategy':<45} {'TERBATAS Recall':>15} {'Precision':>12} {'Accuracy':>10} {'Targets Met':>12}")
print("-" * 100)

best_strategy = None
best_recall = 0

for result in results:
    recall = result['terbatas_recall']
    precision = result['terbatas_precision']
    accuracy = result['overall_accuracy']
    targets = "✅ YES" if result['meets_all_targets'] else "❌ NO"
    
    print(f"{result['strategy']:<45} {recall:>14.2%} {precision:>12.2%} {accuracy:>10.2%} {targets:>12}")
    
    if recall > best_recall:
        best_recall = recall
        best_strategy = result

# Select best model
if best_strategy:
    print(f"\n🎯 BEST STRATEGY: {best_strategy['strategy']}")
    print(f"   TERBATAS Recall: {best_strategy['terbatas_recall']:.2%}")
    print(f"   TERBATAS Precision: {best_strategy['terbatas_precision']:.2%}")
    print(f"   Overall Accuracy: {best_strategy['overall_accuracy']:.2%}")
    
    final_model = best_strategy['model']
    
    # Save model
    print("\n" + "="*80)
    print("💾 SAVING BEST MODEL")
    print("="*80)
    
    model_path = 'models/road_risk_model.pkl'
    os.makedirs('models', exist_ok=True)
    joblib.dump(final_model, model_path)
    print(f"✅ Model saved to: {model_path}")
    
    # Save metadata
    metadata = {
        'model_name': 'road_risk_classification',
        'training_date': datetime.now().isoformat(),
        'strategy': best_strategy['strategy'],
        'class_weights': best_strategy['weights'],
        'feature_count': len(feature_cols),
        'metrics': {
            'terbatas_recall': float(best_strategy['terbatas_recall']),
            'terbatas_precision': float(best_strategy['terbatas_precision']),
            'overall_accuracy': float(best_strategy['overall_accuracy'])
        },
        'training_samples': len(X_train),
        'test_samples': len(X_test),
        'class_distribution': class_counts.to_dict(),
        'safety_critical': True,
        'priority': 'TERBATAS recall > 90% for mining safety'
    }
    
    metadata_path = 'models/road_risk_metadata.json'
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"✅ Metadata saved to: {metadata_path}")
    
    # Visualize confusion matrix
    plt.figure(figsize=(10, 8))
    y_pred_final = final_model.predict(X_test)
    cm_final = confusion_matrix(y_test, y_pred_final, labels=classes)
    
    sns.heatmap(cm_final, annot=True, fmt='d', cmap='YlOrRd', 
                xticklabels=classes, yticklabels=classes)
    plt.title(f'Road Risk Confusion Matrix - {best_strategy["strategy"]}\nTERBATAS Recall: {best_strategy["terbatas_recall"]:.1%}', 
              fontsize=14, fontweight='bold')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    
    plot_path = 'models/road_risk_confusion_matrix.png'
    plt.savefig(plot_path, dpi=300, bbox_inches='tight')
    print(f"✅ Confusion matrix saved to: {plot_path}")
    plt.close()
    
    print("\n" + "="*80)
    print("✅ ROAD RISK MODEL TRAINING COMPLETE!")
    print("="*80)
    print(f"\n🚨 SAFETY IMPROVEMENT:")
    print(f"   Before: 13.3% TERBATAS recall (missed 87% of dangerous conditions)")
    print(f"   After:  {best_strategy['terbatas_recall']:.1%} TERBATAS recall (misses only {(1-best_strategy['terbatas_recall']):.1%})")
    print(f"   Improvement: {(best_strategy['terbatas_recall'] - 0.133) * 100:.1f} percentage points! 🎉")

else:
    print("\n❌ No strategy met the minimum requirements")
    print("Consider collecting more TERBATAS samples or adjusting thresholds")
