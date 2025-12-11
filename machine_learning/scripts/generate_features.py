"""
Generate Feature Store Data
Week 3-4 - Quick data generation untuk pass validation
"""

import pandas as pd
import numpy as np
from pathlib import Path
import sys

# Add src to path
sys.path.append('src')

try:
    from data.data_loader import DataLoader
    print("✅ DataLoader imported successfully")
except ImportError:
    print("⚠️  DataLoader not found, using direct pandas loading")
    DataLoader = None

def generate_infrastructure_features():
    """Generate infrastructure features"""
    print("\n" + "="*80)
    print("🏗️  GENERATING INFRASTRUCTURE FEATURES")
    print("="*80)
    
    try:
        # Load road conditions data
        road_df = pd.read_excel(
            'dataset/Mining Value Chain Optimization - Complete Dataset.xlsx',
            sheet_name='Road Conditions'
        )
        print(f"✅ Loaded road conditions: {road_df.shape}")
        
        # Load weather data
        weather_df = pd.read_excel(
            'dataset/Mining Value Chain Optimization - Complete Dataset.xlsx',
            sheet_name='Weather Data'
        )
        print(f"✅ Loaded weather data: {weather_df.shape}")
        
        # Convert dates
        road_df['tanggal'] = pd.to_datetime(road_df['tanggal'])
        weather_df['tanggal'] = pd.to_datetime(weather_df['tanggal'])
        
        # Basic temporal features
        road_df['hour'] = road_df['tanggal'].dt.hour
        road_df['day_of_week'] = road_df['tanggal'].dt.dayofweek
        road_df['shift'] = np.where((road_df['hour'] >= 6) & (road_df['hour'] < 18), 1, 2)
        road_df['is_weekend'] = (road_df['day_of_week'] >= 5).astype(int)
        
        # Cyclical encoding
        road_df['hour_sin'] = np.sin(2 * np.pi * road_df['hour'] / 24)
        road_df['hour_cos'] = np.cos(2 * np.pi * road_df['hour'] / 24)
        road_df['day_sin'] = np.sin(2 * np.pi * road_df['day_of_week'] / 7)
        road_df['day_cos'] = np.cos(2 * np.pi * road_df['day_of_week'] / 7)
        
        # Weather aggregation
        weather_daily = weather_df.groupby('tanggal').agg({
            'curah_hujan_mm': 'sum'
        }).reset_index()
        weather_daily.columns = ['tanggal', 'daily_rainfall']
        
        # Merge weather
        road_df = road_df.merge(weather_daily, on='tanggal', how='left')
        road_df['daily_rainfall'] = road_df['daily_rainfall'].fillna(0)
        
        # Weather features
        road_df['cumulative_rainfall_3d'] = road_df.groupby('id_segmen')['daily_rainfall'].transform(lambda x: x.rolling(3, min_periods=1).sum())
        road_df['cumulative_rainfall_7d'] = road_df.groupby('id_segmen')['daily_rainfall'].transform(lambda x: x.rolling(7, min_periods=1).sum())
        road_df['wet_condition_flag'] = (road_df['daily_rainfall'] > 10).astype(int)
        
        # Lag features
        road_df = road_df.sort_values(['id_segmen', 'tanggal'])
        road_df['speed_lag_1d'] = road_df.groupby('id_segmen')['kecepatan_aktual_km_jam'].shift(1)
        road_df['speed_lag_7d'] = road_df.groupby('id_segmen')['kecepatan_aktual_km_jam'].shift(7)
        road_df['speed_lag_14d'] = road_df.groupby('id_segmen')['kecepatan_aktual_km_jam'].shift(14)
        
        # Rolling statistics
        road_df['speed_rolling_mean_7d'] = road_df.groupby('id_segmen')['kecepatan_aktual_km_jam'].transform(lambda x: x.rolling(7, min_periods=1).mean())
        road_df['speed_rolling_std_7d'] = road_df.groupby('id_segmen')['kecepatan_aktual_km_jam'].transform(lambda x: x.rolling(7, min_periods=1).std())
        
        # Road condition features
        road_df['friction_risk_score'] = 100 * (1 - road_df['koefisien_friksi'])
        road_df['road_hazard_score'] = 0.4 * road_df['friction_risk_score'] + 0.3 * road_df['kedalaman_genangan_cm'] + 0.3 * road_df['kemiringan_persen']
        
        # Interaction features
        road_df['rainfall_friction_interaction'] = road_df['daily_rainfall'] * (100 - road_df['friction_risk_score'])
        road_df['weekend_rain_flag'] = road_df['is_weekend'] * road_df['wet_condition_flag']
        
        # Create output directories
        Path('data/processed').mkdir(parents=True, exist_ok=True)
        Path('data/feature_store').mkdir(parents=True, exist_ok=True)
        
        # Save outputs
        road_df.to_csv('data/processed/infrastructure_features.csv', index=False)
        road_df.to_parquet('data/feature_store/infra_features.parquet', index=False)
        
        print(f"\n✅ Infrastructure features generated: {road_df.shape}")
        print(f"   Features created: {len(road_df.columns)}")
        print(f"   Saved to: data/processed/infrastructure_features.csv")
        print(f"   Saved to: data/feature_store/infra_features.parquet")
        
        return True
        
    except Exception as e:
        print(f"❌ Error generating infrastructure features: {e}")
        import traceback
        traceback.print_exc()
        return False

def generate_fleet_features():
    """Generate fleet features"""
    print("\n" + "="*80)
    print("🚛 GENERATING FLEET FEATURES")
    print("="*80)
    
    try:
        # Load fleet data
        fleet_df = pd.read_excel(
            'dataset/Mining Value Chain Optimization - Complete Dataset.xlsx',
            sheet_name='Operational Records Fleet (HD)'
        )
        print(f"✅ Loaded fleet data: {fleet_df.shape}")
        
        # Convert dates
        fleet_df['tanggal'] = pd.to_datetime(fleet_df['tanggal'])
        
        # Equipment age features
        current_year = 2025
        fleet_df['equipment_age_months'] = (current_year - fleet_df['tahun_operasi']) * 12
        fleet_df['equipment_age_years'] = fleet_df['equipment_age_months'] / 12
        fleet_df['high_age_risk'] = (fleet_df['equipment_age_years'] > 10).astype(int)
        
        # Sort for time series features
        fleet_df = fleet_df.sort_values(['id_equipment', 'tanggal'])
        
        # Usage patterns
        fleet_df['daily_usage_hours'] = fleet_df.groupby('id_equipment')['hour_meter_total'].diff()
        fleet_df['utilization_rate'] = (fleet_df['daily_usage_hours'] / 24).clip(0, 1)
        fleet_df['overwork_flag'] = (fleet_df['utilization_rate'] > 0.8).astype(int)
        
        # Maintenance features
        fleet_df['days_since_last_maintenance'] = fleet_df.groupby('id_equipment')['tanggal'].diff().dt.days
        fleet_df['overdue_maintenance_flag'] = (fleet_df['days_since_last_maintenance'] > 14).astype(int)
        
        # Operational health
        fleet_df['breakdown_flag'] = (fleet_df['status_operasi'] == 'Breakdown').astype(int)
        fleet_df['breakdown_history_count'] = fleet_df.groupby('id_equipment')['breakdown_flag'].cumsum()
        
        # Health score (simplified)
        fleet_df['health_score_age'] = 100 * (1 - fleet_df['equipment_age_years'] / fleet_df['equipment_age_years'].max())
        fleet_df['health_score_maintenance'] = 100 * (1 - fleet_df['overdue_maintenance_flag'].fillna(0))
        fleet_df['health_score_usage'] = 100 * (1 - fleet_df['utilization_rate'].fillna(0))
        
        fleet_df['equipment_health_score'] = (
            0.30 * fleet_df['health_score_age'] +
            0.30 * fleet_df['health_score_maintenance'] +
            0.20 * fleet_df['health_score_usage'] +
            0.20 * 100  # Simplified breakdown component
        )
        
        # Interaction features
        fleet_df['age_usage_interaction'] = fleet_df['equipment_age_years'] * fleet_df['utilization_rate'].fillna(0)
        fleet_df['combined_risk_score'] = (
            0.3 * fleet_df['high_age_risk'] +
            0.3 * fleet_df['overdue_maintenance_flag'].fillna(0) +
            0.2 * fleet_df['overwork_flag'].fillna(0) +
            0.2 * fleet_df['breakdown_flag']
        )
        
        # Save outputs
        fleet_df.to_csv('data/processed/fleet_features.csv', index=False)
        fleet_df.to_parquet('data/feature_store/fleet_features.parquet', index=False)
        
        print(f"\n✅ Fleet features generated: {fleet_df.shape}")
        print(f"   Features created: {len(fleet_df.columns)}")
        print(f"   Saved to: data/processed/fleet_features.csv")
        print(f"   Saved to: data/feature_store/fleet_features.parquet")
        
        return True
        
    except Exception as e:
        print(f"❌ Error generating fleet features: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("\n" + "="*80)
    print("FEATURE STORE GENERATION - WEEK 3-4")
    print("="*80)
    
    results = []
    
    # Generate features
    results.append(("Infrastructure Features", generate_infrastructure_features()))
    results.append(("Fleet Features", generate_fleet_features()))
    
    # Summary
    print("\n" + "="*80)
    print("GENERATION SUMMARY")
    print("="*80)
    
    for name, success in results:
        status = "✅" if success else "❌"
        print(f"  {status} {name}")
    
    passed = sum(1 for _, success in results if success)
    print(f"\n Total: {passed}/{len(results)} feature sets generated")
    print("="*80)
    
    return passed == len(results)

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)
