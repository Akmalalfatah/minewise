"""
SHAP Explainability Analysis for All Optimized Models
=====================================================

Generate SHAP summary plots, force plots, and dependence plots
for interpreting model predictions and feature importance.

Author: Capstone Team
Date: 2025-12-03
"""

import pandas as pd
import numpy as np
import pickle
import shap
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Matplotlib settings
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.size'] = 10
sns.set_style("whitegrid")

# Paths
DATA_DIR = Path("data/feature_store")
MODEL_DIR = Path("models")
OUTPUT_DIR = Path("reports/explainability")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def load_model(model_path):
    """Load pickled model"""
    with open(model_path, 'rb') as f:
        return pickle.load(f)

def generate_shap_summary(model, X, feature_names, model_name, output_dir):
    """
    Generate SHAP summary plots:
    - Beeswarm plot (feature impact distribution)
    - Bar plot (mean absolute SHAP values)
    """
    print(f"\n{'='*60}")
    print(f"GENERATING SHAP EXPLANATIONS FOR {model_name}")
    print('='*60)
    
    # Create SHAP explainer
    print("Creating TreeExplainer...")
    explainer = shap.TreeExplainer(model)
    
    # Calculate SHAP values (sample if dataset too large)
    sample_size = min(500, len(X))
    X_sample = X.sample(n=sample_size, random_state=42) if len(X) > sample_size else X
    print(f"Computing SHAP values for {len(X_sample)} samples...")
    shap_values = explainer.shap_values(X_sample)
    
    # Handle multi-class output (take class 1 for binary, or all classes)
    if isinstance(shap_values, list):
        if len(shap_values) == 2:  # Binary classification
            shap_values_plot = shap_values[1]  # Positive class
            print("Binary classification detected - using positive class SHAP values")
        else:  # Multiclass
            shap_values_plot = shap_values
            print(f"Multiclass classification detected - {len(shap_values)} classes")
    else:
        shap_values_plot = shap_values
    
    # SHAP Beeswarm Plot
    print(f"Generating beeswarm plot...")
    plt.figure(figsize=(12, 8))
    if isinstance(shap_values_plot, list):
        # For multiclass, show first few classes
        for i in range(min(3, len(shap_values_plot))):
            plt.subplot(min(3, len(shap_values_plot)), 1, i+1)
            shap.summary_plot(shap_values_plot[i], X_sample, feature_names=feature_names, 
                            plot_type="dot", show=False, max_display=15)
            plt.title(f"Class {i} SHAP Values")
    else:
        shap.summary_plot(shap_values_plot, X_sample, feature_names=feature_names, 
                        plot_type="dot", show=False, max_display=15)
    plt.tight_layout()
    plt.savefig(output_dir / f"{model_name}_shap_beeswarm.png", dpi=150, bbox_inches='tight')
    plt.close()
    print(f"✅ Saved: {model_name}_shap_beeswarm.png")
    
    # SHAP Bar Plot (Mean Absolute Values)
    print(f"Generating bar plot...")
    plt.figure(figsize=(10, 6))
    if isinstance(shap_values_plot, list):
        shap.summary_plot(shap_values_plot[1] if len(shap_values_plot) == 2 else shap_values_plot[0], 
                        X_sample, feature_names=feature_names, 
                        plot_type="bar", show=False, max_display=15)
    else:
        shap.summary_plot(shap_values_plot, X_sample, feature_names=feature_names, 
                        plot_type="bar", show=False, max_display=15)
    plt.tight_layout()
    plt.savefig(output_dir / f"{model_name}_shap_bar.png", dpi=150, bbox_inches='tight')
    plt.close()
    print(f"✅ Saved: {model_name}_shap_bar.png")
    
    # Return SHAP values for further analysis
    return explainer, shap_values, X_sample

def generate_dependence_plots(shap_values, X, feature_names, top_n, model_name, output_dir):
    """
    Generate SHAP dependence plots for top N features
    Shows how feature value affects prediction
    """
    print(f"\nGenerating dependence plots for top {top_n} features...")
    
    # Handle multiclass (take first class)
    if isinstance(shap_values, list):
        shap_vals = shap_values[1] if len(shap_values) == 2 else shap_values[0]
    else:
        shap_vals = shap_values
    
    # Get top N features by mean absolute SHAP value
    mean_abs_shap = np.abs(shap_vals).mean(axis=0)
    top_indices = np.argsort(mean_abs_shap)[-top_n:][::-1]
    
    fig, axes = plt.subplots(top_n, 1, figsize=(10, 4*top_n))
    if top_n == 1:
        axes = [axes]
    
    for idx, feat_idx in enumerate(top_indices):
        feat_name = feature_names[feat_idx]
        
        # SHAP dependence plot
        plt.sca(axes[idx])
        shap.dependence_plot(feat_idx, shap_vals, X, 
                            feature_names=feature_names, 
                            show=False, ax=axes[idx])
        axes[idx].set_title(f"Dependence: {feat_name}", fontsize=12, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig(output_dir / f"{model_name}_dependence_plots.png", dpi=150, bbox_inches='tight')
    plt.close()
    print(f"✅ Saved: {model_name}_dependence_plots.png")

def analyze_road_speed():
    """Model #1: Road Speed Prediction"""
    print("\n" + "="*60)
    print("MODEL #1: ROAD SPEED PREDICTION")
    print("="*60)
    
    # Load data
    df = pd.read_parquet(DATA_DIR / "infra_features.parquet")
    
    # Load model
    model = load_model(MODEL_DIR / "road_speed_optimized.pkl")
    
    # Prepare features (same as training)
    target = 'kecepatan_aktual_km_jam'
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    exclude_cols = ['waktu_tempuh_menit', target]
    feature_cols = [col for col in numeric_cols if col not in exclude_cols]
    
    X = df[feature_cols].fillna(0)
    
    # Generate SHAP
    explainer, shap_values, X_sample = generate_shap_summary(
        model, X, feature_cols, "road_speed", OUTPUT_DIR
    )
    
    # Dependence plots for top 5 features
    generate_dependence_plots(shap_values, X_sample, feature_cols, 5, "road_speed", OUTPUT_DIR)
    
    return {
        'model_name': 'Road Speed Prediction',
        'n_features': len(feature_cols),
        'sample_size': len(X_sample),
        'top_features': feature_cols[:5]  # Will update with actual SHAP rankings
    }

def analyze_cycle_time():
    """Model #2: Cycle Time Prediction"""
    print("\n" + "="*60)
    print("MODEL #2: CYCLE TIME PREDICTION")
    print("="*60)
    
    # Load data
    df = pd.read_parquet(DATA_DIR / "infra_features.parquet")
    
    # Load model
    model = load_model(MODEL_DIR / "cycle_time_optimized.pkl")
    
    # Prepare features
    target = 'waktu_tempuh_menit'
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    exclude_cols = ['kecepatan_aktual_km_jam', target]
    feature_cols = [col for col in numeric_cols if col not in exclude_cols]
    
    X = df[feature_cols].fillna(0)
    
    # Generate SHAP
    explainer, shap_values, X_sample = generate_shap_summary(
        model, X, feature_cols, "cycle_time", OUTPUT_DIR
    )
    
    # Dependence plots
    generate_dependence_plots(shap_values, X_sample, feature_cols, 5, "cycle_time", OUTPUT_DIR)
    
    return {
        'model_name': 'Cycle Time Prediction',
        'n_features': len(feature_cols),
        'sample_size': len(X_sample)
    }

def analyze_road_risk():
    """Model #3: Road Risk Classification"""
    print("\n" + "="*60)
    print("MODEL #3: ROAD RISK CLASSIFICATION")
    print("="*60)
    
    # Load data
    df = pd.read_parquet(DATA_DIR / "infra_features.parquet")
    
    # Load model
    model = load_model(MODEL_DIR / "road_risk_optimized.pkl")
    
    # Prepare features
    target = 'status_jalan'
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    exclude_cols = ['waktu_tempuh_menit', 'kecepatan_aktual_km_jam']
    feature_cols = [col for col in numeric_cols if col not in exclude_cols]
    
    X = df[feature_cols].fillna(0)
    
    # Generate SHAP
    explainer, shap_values, X_sample = generate_shap_summary(
        model, X, feature_cols, "road_risk", OUTPUT_DIR
    )
    
    # Dependence plots
    generate_dependence_plots(shap_values, X_sample, feature_cols, 5, "road_risk", OUTPUT_DIR)
    
    return {
        'model_name': 'Road Risk Classification',
        'n_features': len(feature_cols),
        'sample_size': len(X_sample),
        'classes': ['BAIK', 'WASPADA', 'TERBATAS']
    }

def analyze_equipment_failure():
    """Model #4: Equipment Failure Prediction"""
    print("\n" + "="*60)
    print("MODEL #4: EQUIPMENT FAILURE PREDICTION")
    print("="*60)
    
    # Load data
    df = pd.read_parquet(DATA_DIR / "fleet_features.parquet")
    
    # Load model
    model = load_model(MODEL_DIR / "equipment_failure_optimized.pkl")
    
    # Prepare features
    target = 'breakdown_flag'
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    exclude_cols = [target]
    feature_cols = [col for col in numeric_cols if col not in exclude_cols]
    
    X = df[feature_cols].fillna(0)
    
    # Generate SHAP
    explainer, shap_values, X_sample = generate_shap_summary(
        model, X, feature_cols, "equipment_failure", OUTPUT_DIR
    )
    
    # Dependence plots
    generate_dependence_plots(shap_values, X_sample, feature_cols, 5, "equipment_failure", OUTPUT_DIR)
    
    return {
        'model_name': 'Equipment Failure Prediction',
        'n_features': len(feature_cols),
        'sample_size': len(X_sample)
    }

def analyze_port_operability():
    """Model #5: Port Operability Forecast"""
    print("\n" + "="*60)
    print("MODEL #5: PORT OPERABILITY FORECAST")
    print("="*60)
    
    # Load data
    df = pd.read_parquet(DATA_DIR / "fleet_features.parquet")
    
    # Load model
    model = load_model(MODEL_DIR / "port_operability_optimized.pkl")
    
    # Prepare features (same as training)
    # Create operability categories
    if 'weather_operability_score' in df.columns:
        df['operability_category'] = pd.cut(
            df['weather_operability_score'],
            bins=[0, 40, 70, 100],
            labels=['LOW', 'MODERATE', 'HIGH'],
            include_lowest=True
        )
    elif 'equipment_health_score' in df.columns:
        df['operability_category'] = pd.cut(
            df['equipment_health_score'],
            bins=[0, 40, 70, 100],
            labels=['LOW', 'MODERATE', 'HIGH'],
            include_lowest=True
        )
    
    target = 'operability_category'
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    exclude_cols = ['weather_operability_score', 'equipment_health_score']
    feature_cols = [col for col in numeric_cols if col not in exclude_cols]
    
    # Remove NaN target rows
    df_clean = df.dropna(subset=[target]).copy()
    X = df_clean[feature_cols].fillna(0)
    
    # Generate SHAP
    explainer, shap_values, X_sample = generate_shap_summary(
        model, X, feature_cols, "port_operability", OUTPUT_DIR
    )
    
    # Dependence plots
    generate_dependence_plots(shap_values, X_sample, feature_cols, 5, "port_operability", OUTPUT_DIR)
    
    return {
        'model_name': 'Port Operability Forecast',
        'n_features': len(feature_cols),
        'sample_size': len(X_sample),
        'classes': ['LOW', 'MODERATE', 'HIGH']
    }

def create_summary_report(results):
    """Create markdown summary of SHAP analysis"""
    report = """# SHAP Explainability Analysis - Summary Report

**Generated:** 2025-12-03  
**Purpose:** Model interpretability and feature importance analysis

---

## Overview

SHAP (SHapley Additive exPlanations) analysis provides:
- **Global Interpretability:** Which features are most important across all predictions
- **Local Interpretability:** Why a specific prediction was made
- **Feature Interactions:** How features interact to influence predictions

---

## Analysis Results

"""
    
    for i, result in enumerate(results, 1):
        report += f"### Model #{i}: {result['model_name']}\n\n"
        report += f"- **Features Analyzed:** {result['n_features']}\n"
        report += f"- **Sample Size:** {result['sample_size']}\n"
        if 'classes' in result:
            report += f"- **Classes:** {', '.join(result['classes'])}\n"
        report += f"- **Output Files:**\n"
        model_slug = result['model_name'].lower().replace(' ', '_')
        report += f"  - `{model_slug}_shap_beeswarm.png` - Feature impact distribution\n"
        report += f"  - `{model_slug}_shap_bar.png` - Mean absolute SHAP values\n"
        report += f"  - `{model_slug}_dependence_plots.png` - Top 5 feature dependencies\n\n"
    
    report += """---

## How to Interpret

### Beeswarm Plot
- **X-axis:** SHAP value (impact on prediction)
- **Y-axis:** Features (sorted by importance)
- **Color:** Feature value (red=high, blue=low)
- **Dot density:** Distribution of impacts

### Bar Plot
- Shows average absolute impact of each feature
- Higher bars = more important features globally

### Dependence Plot
- Shows relationship between feature value and SHAP value
- Color shows interaction with most correlated feature
- Non-linear patterns indicate complex relationships

---

## Business Implications

SHAP values enable:
1. **Feature Engineering:** Identify which engineered features add value
2. **Data Collection:** Prioritize sensors/data sources with high impact
3. **Model Debugging:** Detect unexpected feature influences
4. **Stakeholder Communication:** Explain AI decisions transparently
5. **Regulatory Compliance:** Document decision-making process

---

**Next Steps:** Integrate SHAP explanations into API for real-time interpretability
"""
    
    with open(OUTPUT_DIR / "SHAP_ANALYSIS_SUMMARY.md", 'w') as f:
        f.write(report)
    
    print(f"\n✅ Summary report saved to: {OUTPUT_DIR}/SHAP_ANALYSIS_SUMMARY.md")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("SHAP EXPLAINABILITY ANALYSIS - ALL MODELS")
    print("="*60)
    print(f"Output directory: {OUTPUT_DIR}")
    
    results = []
    
    # Analyze each model
    try:
        results.append(analyze_road_speed())
    except Exception as e:
        print(f"❌ Error analyzing Road Speed: {e}")
    
    try:
        results.append(analyze_cycle_time())
    except Exception as e:
        print(f"❌ Error analyzing Cycle Time: {e}")
    
    try:
        results.append(analyze_road_risk())
    except Exception as e:
        print(f"❌ Error analyzing Road Risk: {e}")
    
    try:
        results.append(analyze_equipment_failure())
    except Exception as e:
        print(f"❌ Error analyzing Equipment Failure: {e}")
    
    try:
        results.append(analyze_port_operability())
    except Exception as e:
        print(f"❌ Error analyzing Port Operability: {e}")
    
    # Create summary report
    if results:
        create_summary_report(results)
    
    print("\n" + "="*60)
    print("SHAP ANALYSIS COMPLETE")
    print("="*60)
    print(f"✅ Generated {len(results)} model explanations")
    print(f"✅ All plots saved to: {OUTPUT_DIR}")
