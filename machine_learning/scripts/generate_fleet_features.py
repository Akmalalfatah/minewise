"""
Generate Fleet Features - Quick Script
Week 3-4 - For validation pass
"""

import pandas as pd
import numpy as np
from pathlib import Path

print("=" * 80)
print("🚛 GENERATING FLEET FEATURES")
print("=" * 80)

# Load data
print("\n📂 Loading data...")
fleet_ops = pd.read_excel('data/raw/dataset_rancangan.xlsx', sheet_name='fct_operasional_alat_relatif_2')
equipment_master = pd.read_excel('data/raw/dataset_rancangan.xlsx', sheet_name='dim_alat_berat_relatif_2')

print(f"✅ Fleet Ops: {fleet_ops.shape}")
print(f"✅ Equipment Master: {equipment_master.shape}")

# Merge data
fleet_data = fleet_ops.merge(equipment_master, on='id_alat', how='left')
print(f"✅ Merged: {fleet_data.shape}")

# Convert dates
fleet_data['tanggal'] = pd.to_datetime(fleet_data['tanggal_operasi'])
fleet_data = fleet_data.sort_values(['id_alat', 'tanggal'])

print("\n🔧 Creating features...")

# Age features (if available)
current_year = pd.Timestamp.now().year
if 'tahun_mulai' in fleet_data.columns:
    fleet_data['equipment_age_years'] = current_year - fleet_data['tahun_mulai']
else:
    fleet_data['equipment_age_years'] = 5  # Default

fleet_data['high_age_risk'] = (fleet_data['equipment_age_years'] > 10).astype(int)

# Usage features
if 'durasi_jam' in fleet_data.columns:
    fleet_data['daily_usage_hours'] = fleet_data['durasi_jam']
    fleet_data['utilization_rate'] = (fleet_data['daily_usage_hours'] / 24).clip(0, 1)
    fleet_data['high_usage_flag'] = (fleet_data['utilization_rate'] > 0.8).astype(int)
    fleet_data['cumulative_hours_30d'] = fleet_data.groupby('id_alat')['daily_usage_hours'].transform(
        lambda x: x.rolling(window=30, min_periods=1).sum()
    )
else:
    fleet_data['utilization_rate'] = 0.5
    fleet_data['high_usage_flag'] = 0

# Maintenance features
fleet_data['days_since_last_op'] = fleet_data.groupby('id_alat')['tanggal'].diff().dt.days
fleet_data['overdue_maintenance_flag'] = (fleet_data['days_since_last_op'] > 14).astype(int)

# Breakdown features
if 'status_operasi' in fleet_data.columns:
    fleet_data['breakdown_flag'] = (fleet_data['status_operasi'] == 'Breakdown').astype(int)
    fleet_data['breakdown_history_count'] = fleet_data.groupby('id_alat')['breakdown_flag'].cumsum()
    fleet_data['breakdown_rate_30d'] = fleet_data.groupby('id_alat')['breakdown_flag'].transform(
        lambda x: x.rolling(window=30, min_periods=1).mean()
    )
else:
    fleet_data['breakdown_flag'] = 0
    fleet_data['breakdown_rate_30d'] = 0

# Health scores
fleet_data['health_score_age'] = 100 * (1 - fleet_data['equipment_age_years'] / fleet_data['equipment_age_years'].max())
fleet_data['health_score_maintenance'] = 100 * (1 - fleet_data['overdue_maintenance_flag'])

if 'utilization_rate' in fleet_data.columns:
    fleet_data['health_score_usage'] = 100 * (1 - abs(fleet_data['utilization_rate'] - 0.7) / 0.7)
    fleet_data['health_score_usage'] = fleet_data['health_score_usage'].clip(0, 100)
else:
    fleet_data['health_score_usage'] = 100

fleet_data['health_score_breakdown'] = 100 * (1 - fleet_data['breakdown_rate_30d'])

fleet_data['equipment_health_score'] = (
    0.30 * fleet_data['health_score_age'] +
    0.30 * fleet_data['health_score_maintenance'] +
    0.20 * fleet_data['health_score_usage'] +
    0.20 * fleet_data['health_score_breakdown']
)

fleet_data['health_category'] = pd.cut(
    fleet_data['equipment_health_score'],
    bins=[0, 40, 70, 100],
    labels=['Critical', 'Warning', 'Good']
)

# Interaction features
if 'utilization_rate' in fleet_data.columns:
    fleet_data['age_usage_interaction'] = fleet_data['equipment_age_years'] * fleet_data['utilization_rate']

fleet_data['combined_risk_score'] = (
    0.3 * fleet_data['high_age_risk'] +
    0.3 * fleet_data['overdue_maintenance_flag'] +
    0.2 * fleet_data['high_usage_flag'] +
    0.2 * fleet_data['breakdown_flag']
)

print(f"✅ Total features: {len(fleet_data.columns)}")

# Save outputs
print("\n💾 Saving features...")
output_dir = Path('data/processed')
output_dir.mkdir(parents=True, exist_ok=True)

fleet_data.to_csv('data/processed/fleet_features.csv', index=False)
print(f"✅ CSV saved: data/processed/fleet_features.csv")
print(f"   Size: {Path('data/processed/fleet_features.csv').stat().st_size / 1024 / 1024:.2f} MB")

feature_store_dir = Path('data/feature_store')
feature_store_dir.mkdir(parents=True, exist_ok=True)

fleet_data.to_parquet('data/feature_store/fleet_features.parquet', index=False, compression='snappy')
print(f"✅ Parquet saved: data/feature_store/fleet_features.parquet")
print(f"   Size: {Path('data/feature_store/fleet_features.parquet').stat().st_size / 1024 / 1024:.2f} MB")

print("\n" + "=" * 80)
print("🎉 FLEET FEATURES COMPLETE!")
print("=" * 80)
print(f"Final shape: {fleet_data.shape}")
print(f"Health distribution:")
print(fleet_data['health_category'].value_counts())
