"""
Feature Engineering Service untuk API
Transforms simple API inputs into engineered features yang dibutuhkan model
"""
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


class FeatureEngineer:
    """Feature engineering untuk transform input API ke model features"""
    
    def __init__(self):
        # Historical data untuk lags dan rolling means (simplified - production harus dari database)
        self.historical_speed = 25.0  # km/h default
        self.historical_cycle_time = 35.0  # minutes default
        
    def engineer_road_speed_features(self, input_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Transform Road Speed API input ke 38 engineered features
        
        Input API fields:
        - jenis_jalan, kondisi_permukaan, curah_hujan_mm, suhu_celcius,
          kecepatan_angin_ms, elevasi_mdpl, kemiringan_persen, beban_muatan_ton, jam_operasi
        
        Output: DataFrame dengan 38 features yang dibutuhkan model
        """
        
        now = datetime.now()
        features = {}
        
        # 1. Basic geometric features (dari input atau default)
        features['panjang_segmen_km'] = input_data.get('jarak_km', 5.0)  # Default 5km segment
        features['kemiringan_pct'] = input_data.get('kemiringan_persen', 0.0)
        
        # 2. Surface condition features
        kondisi = input_data.get('kondisi_permukaan', 'KERING')
        curah_hujan = input_data.get('curah_hujan_mm', 0.0)
        
        # Water depth estimation dari kondisi dan rainfall
        if kondisi == 'BERLUMPUR':
            features['kedalaman_air_cm'] = max(10.0, curah_hujan * 2)
        elif kondisi == 'BASAH':
            features['kedalaman_air_cm'] = max(2.0, curah_hujan * 0.5)
        else:
            features['kedalaman_air_cm'] = 0.0
        
        # Friction index dari surface condition
        friction_map = {
            'KERING': 0.8,
            'BASAH': 0.5,
            'BERLUMPUR': 0.3,
            'LICIN': 0.2
        }
        features['indeks_friksi'] = friction_map.get(kondisi, 0.6)
        
        # 3. Road limits
        jenis_jalan = input_data.get('jenis_jalan', 'UTAMA')
        speed_limit_map = {
            'UTAMA': 60,
            'PENGHUBUNG': 45,
            'CABANG': 30
        }
        features['batas_kecepatan_km_jam'] = speed_limit_map.get(jenis_jalan, 50)
        
        # 4. Traffic features
        features['ritase_terobservasi'] = input_data.get('jumlah_ritase', 25)
        
        # Speed drop estimation
        base_speed = features['batas_kecepatan_km_jam']
        if kondisi == 'BERLUMPUR':
            speed_drop = base_speed * 0.6  # 60% drop
        elif kondisi == 'BASAH':
            speed_drop = base_speed * 0.3  # 30% drop
        else:
            speed_drop = base_speed * 0.1  # 10% drop
        features['Speed drop'] = speed_drop
        
        # 5. Temporal features
        hour = input_data.get('jam_operasi', now.hour)
        features['hour'] = hour
        features['day_of_week'] = now.weekday()
        features['month'] = now.month
        features['is_weekend'] = 1 if now.weekday() >= 5 else 0
        
        # Cyclic encoding
        features['hour_sin'] = np.sin(2 * np.pi * hour / 24)
        features['hour_cos'] = np.cos(2 * np.pi * hour / 24)
        features['day_sin'] = np.sin(2 * np.pi * now.weekday() / 7)
        features['day_cos'] = np.cos(2 * np.pi * now.weekday() / 7)
        
        # 6. Weather features
        features['daily_rainfall'] = curah_hujan
        features['cumulative_rainfall_3d'] = curah_hujan * 3  # Simplified (should be actual 3-day sum)
        features['cumulative_rainfall_7d'] = curah_hujan * 7  # Simplified
        features['wet_condition_flag'] = 1 if curah_hujan > 1 or kondisi in ['BASAH', 'BERLUMPUR'] else 0
        
        # 7. Historical lags (simplified - production harus query dari database)
        # Untuk demo, gunakan reasonable estimates
        features['speed_lag_1d'] = self.historical_speed
        features['speed_lag_7d'] = self.historical_speed * 0.95
        features['speed_lag_14d'] = self.historical_speed * 0.93
        
        features['cycle_time_lag_1d'] = self.historical_cycle_time
        features['cycle_time_lag_7d'] = self.historical_cycle_time * 1.05
        
        # 8. Changes dan volatility
        features['speed_change_1d'] = 0.0  # Current - lag_1d (unknown current, use 0)
        features['speed_change_7d'] = self.historical_speed * 0.05
        
        # 9. Rolling statistics (simplified)
        features['speed_rolling_mean_7d'] = self.historical_speed
        features['speed_rolling_std_7d'] = self.historical_speed * 0.15
        features['speed_rolling_min_7d'] = self.historical_speed * 0.7
        features['speed_rolling_max_7d'] = self.historical_speed * 1.2
        features['speed_volatility_7d'] = 0.15
        
        features['cycle_time_rolling_mean_7d'] = self.historical_cycle_time
        
        # 10. Risk scores (composite features)
        # Friction risk: kombinasi water, slope, surface
        friction_risk = (
            (1 - features['indeks_friksi']) * 0.4 +
            (features['kedalaman_air_cm'] / 20) * 0.3 +
            (features['kemiringan_pct'] / 20) * 0.3
        )
        features['friction_risk_score'] = min(friction_risk, 1.0)
        
        # Speed drop percentage
        features['speed_drop_pct'] = (features['Speed drop'] / base_speed) * 100
        
        # Road hazard score
        hazard = (
            features['friction_risk_score'] * 0.5 +
            (features['kedalaman_air_cm'] / 15) * 0.3 +
            (features['kemiringan_pct'] / 25) * 0.2
        )
        features['road_hazard_score'] = min(hazard, 1.0)
        
        # 11. Interaction features
        features['rainfall_friction_interaction'] = curah_hujan * (1 - features['indeks_friksi'])
        features['slope_water_interaction'] = features['kemiringan_pct'] * features['kedalaman_air_cm']
        features['weekend_rain_flag'] = features['is_weekend'] * features['wet_condition_flag']
        
        # Convert to DataFrame
        df = pd.DataFrame([features])
        
        logger.info(f"✓ Engineered {len(features)} features for road_speed from {len(input_data)} inputs")
        return df
    
    def engineer_cycle_time_features(self, input_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Transform Cycle Time API input ke 38 engineered features
        Menggunakan features yang sama seperti road_speed (dari infra_features.parquet)
        """
        # Cycle time menggunakan infrastructure features yang sama
        # Plus jarak tempuh
        features = self.engineer_road_speed_features(input_data)
        
        # Override/add jarak jika ada
        if 'jarak_tempuh_km' in input_data:
            features['panjang_segmen_km'] = input_data['jarak_tempuh_km']
        
        return features
    
    def engineer_equipment_failure_features(self, input_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Transform Equipment Failure API input ke 44 engineered features
        Features dari fleet_features.parquet (equipment age, usage, maintenance)
        IMPROVED: Better risk differentiation based on age and usage patterns
        """
        features = {}
        
        # Extract input data
        jenis_equipment = input_data.get('jenis_equipment', 'Excavator')
        umur_tahun = float(input_data.get('umur_tahun', 3.0))
        jam_operasional = float(input_data.get('jam_operasional_harian', 8.0))
        ritase_harian = float(input_data.get('ritase_harian', 50.0))
        
        # 1-2. MISSING FEATURES (di awal list)
        features['durasi_jam'] = jam_operasional  # Duration in hours
        features['total_muatan_ton'] = ritase_harian * 25.0  # Estimated: 25 ton per trip
        
        # 3-4. Basic equipment metrics
        features['jumlah_ritase'] = ritase_harian
        features['umur_tahun'] = umur_tahun
        
        # 5-7. Age-based features (more granular)
        features['equipment_age_days'] = umur_tahun * 365
        features['equipment_age_months'] = umur_tahun * 12
        features['equipment_age_years'] = umur_tahun
        
        # 8-10. Age risk categories (adjusted thresholds)
        features['high_age_risk'] = 1.0 if umur_tahun > 8 else 0.0  # Stricter: 8+ years
        features['mid_age_risk'] = 1.0 if 4 <= umur_tahun <= 8 else 0.0  # 4-8 years
        features['new_equipment'] = 1.0 if umur_tahun < 3 else 0.0  # Extended: <3 years
        
        # 11-12. Usage features
        features['daily_usage_hours'] = jam_operasional
        features['utilization_rate'] = min(jam_operasional / 24.0, 1.0)
        
        # 13-16. Usage flags
        features['high_usage_flag'] = 1.0 if jam_operasional > 16 else 0.0
        features['low_usage_flag'] = 1.0 if jam_operasional < 4 else 0.0
        features['overwork_flag'] = 1.0 if jam_operasional > 20 else 0.0
        features['idle_flag'] = 1.0 if jam_operasional < 2 else 0.0
        
        # 17-20. Cumulative hours (simplified with typical patterns)
        features['cumulative_hours_7d'] = jam_operasional * 7
        features['cumulative_hours_30d'] = jam_operasional * 30
        features['avg_daily_hours_7d'] = jam_operasional
        features['usage_variance_7d'] = jam_operasional * 0.15  # Typical variance 15%
        
        # 21-25. Maintenance features (estimated from age and usage)
        total_hours = umur_tahun * 365 * jam_operasional
        expected_maintenance = total_hours / 500  # Every 500 hours
        features['days_since_last_record'] = 1.0  # Default: recent record
        features['overdue_maintenance_flag'] = 1.0 if total_hours % 500 > 450 else 0.0
        features['critical_overdue_flag'] = 1.0 if total_hours % 500 > 550 else 0.0
        features['maintenance_activity'] = 1.0 if total_hours % 500 < 50 else 0.0
        features['maintenance_count_30d'] = expected_maintenance / 12  # Monthly estimate
        
        # 26-28. Operational status flags (adjusted thresholds)
        features['breakdown_flag'] = 1.0 if (umur_tahun > 9 or jam_operasional > 20) else 0.0
        features['standby_flag'] = 1.0 if jam_operasional < 3 else 0.0  # More lenient
        features['operating_flag'] = 1.0 if jam_operasional >= 5 else 0.0  # Slightly higher
        
        # 29-32. Breakdown history (IMPROVED: More sensitive to age+usage combination)
        age_factor = min(umur_tahun / 12, 1.0)  # Normalize to 12 years max
        usage_factor = min(jam_operasional / 20, 1.0)  # Normalize to 20h/day max
        ritase_factor = min(ritase_harian / 100, 1.0)  # Normalize to 100 trips/day
        
        # Combine factors with weights
        breakdown_risk = (age_factor * 0.5) + (usage_factor * 0.3) + (ritase_factor * 0.2)
        
        features['breakdown_count_7d'] = breakdown_risk * 10  # Higher sensitivity
        features['breakdown_count_30d'] = breakdown_risk * 40
        features['breakdown_rate_30d'] = breakdown_risk
        features['operating_rate_7d'] = max(0.2, 1.0 - breakdown_risk)
        
        # 33-37. Health scores (IMPROVED: More discriminative ranges)
        features['health_score_age'] = max(0.1, 1.0 - age_factor)  # Lower floor
        features['health_score_maintenance'] = max(0.3, 1.0 - (total_hours % 500) / 500)  # Lower floor
        features['health_score_usage'] = max(0.2, 1.0 - usage_factor)  # Lower floor, use factor
        features['health_score_breakdown'] = max(0.2, 1.0 - breakdown_risk)  # Lower floor
        features['health_score_efficiency'] = max(0.3, 1.0 - (breakdown_risk * 0.9))  # More sensitive
        
        # 38. Condition score (IMPROVED: Weighted by importance)
        features['condition_score'] = (
            features['health_score_age'] * 0.30 +  # Age most important
            features['health_score_breakdown'] * 0.25 +  # Breakdown history
            features['health_score_usage'] * 0.20 +  # Usage patterns
            features['health_score_maintenance'] * 0.15 +  # Maintenance status
            features['health_score_efficiency'] * 0.10  # Efficiency
        )
        
        # 39-43. Risk composite scores
        features['age_usage_interaction'] = umur_tahun * jam_operasional / 100
        features['age_breakdown_risk'] = umur_tahun * breakdown_risk
        features['critical_risk_flag'] = 1.0 if (umur_tahun > 8 and jam_operasional > 16) else 0.0
        features['degradation_risk_flag'] = 1.0 if features['condition_score'] < 0.5 else 0.0
        features['combined_risk_score'] = (
            features['age_breakdown_risk'] * 0.4 +
            (1.0 - features['condition_score']) * 0.3 +
            breakdown_risk * 0.3
        )
        
        # 44. Type risk profile (equipment type risk mapping)
        type_risk_map = {
            'Excavator': 0.6,
            'Dump Truck': 0.7,
            'Loader': 0.5,
            'Dozer': 0.4,
            'Grader': 0.5
        }
        features['type_risk_profile'] = type_risk_map.get(jenis_equipment, 0.6)
        
        df = pd.DataFrame([features])
        logger.info(f"✓ Engineered {len(features)} features for equipment_failure from {len(input_data)} inputs")
        return df
    
    def engineer_port_operability_features(self, input_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Transform Port Operability API input ke 44 engineered features
        IMPROVED: Better weather severity differentiation and risk assessment
        Port operability menggunakan FLEET features yang sama (equipment/vessel operability)
        Vessel = equipment di konteks port operations
        """
        features = {}
        
        # Extract operational inputs (map to equipment concepts)
        tipe_kapal = input_data.get('tipe_kapal', 'Bulk Carrier')
        kapasitas_muatan = float(input_data.get('kapasitas_muatan_ton', 50000))
        tinggi_gelombang = float(input_data.get('tinggi_gelombang_m', 1.0))
        kecepatan_angin = float(input_data.get('kecepatan_angin_kmh', 15.0))
        
        # Map vessel operations to equipment features
        # Assume typical port operation: 12h loading, 3-4 trips/day
        jam_operasional = 12.0  # Typical port loading duration
        ritase_harian = 3.0  # Typical vessel trips per day
        umur_tahun = 5.0  # Typical vessel age (mid-life)
        
        # IMPROVED: Normalized weather severity factors
        wave_factor = min(tinggi_gelombang / 5.0, 1.0)  # 5m waves = maximum severity
        wind_factor = min(kecepatan_angin / 100.0, 1.0)  # 100 km/h = maximum severity
        
        # Weather impact with weighted combination (waves more critical than wind for port ops)
        weather_impact = (wave_factor * 0.6) + (wind_factor * 0.4)
        
        # Adjusted age accounts for weather stress (amplified effect)
        adjusted_age = umur_tahun * (1.0 + weather_impact * 1.5)
        
        # 1-2. Duration and load
        features['durasi_jam'] = jam_operasional
        features['total_muatan_ton'] = kapasitas_muatan
        
        # 3-4. Basic metrics
        features['jumlah_ritase'] = ritase_harian
        features['umur_tahun'] = adjusted_age
        
        # 5-7. Age-based features
        features['equipment_age_days'] = adjusted_age * 365
        features['equipment_age_months'] = adjusted_age * 12
        features['equipment_age_years'] = adjusted_age
        
        # 8-10. Age risk categories (affected by weather)
        features['high_age_risk'] = 1.0 if adjusted_age > 7 else 0.0
        features['mid_age_risk'] = 1.0 if 3 <= adjusted_age <= 7 else 0.0
        features['new_equipment'] = 1.0 if adjusted_age < 2 else 0.0
        
        # 11-12. Usage features
        features['daily_usage_hours'] = jam_operasional
        features['utilization_rate'] = min(jam_operasional / 24.0, 1.0)
        
        # 13-16. Usage flags
        features['high_usage_flag'] = 1.0 if jam_operasional > 16 else 0.0
        features['low_usage_flag'] = 1.0 if jam_operasional < 4 else 0.0
        features['overwork_flag'] = 1.0 if jam_operasional > 20 else 0.0
        features['idle_flag'] = 1.0 if jam_operasional < 2 else 0.0
        
        # 17-20. Cumulative hours
        features['cumulative_hours_7d'] = jam_operasional * 7
        features['cumulative_hours_30d'] = jam_operasional * 30
        features['avg_daily_hours_7d'] = jam_operasional
        features['usage_variance_7d'] = jam_operasional * 0.15
        
        # 21-25. Maintenance features (affected by weather conditions)
        total_hours = adjusted_age * 365 * jam_operasional
        features['days_since_last_record'] = 1.0
        features['overdue_maintenance_flag'] = 1.0 if weather_impact > 0.5 else 0.0
        features['critical_overdue_flag'] = 1.0 if weather_impact > 0.7 else 0.0
        features['maintenance_activity'] = 1.0 if weather_impact < 0.2 else 0.0
        features['maintenance_count_30d'] = weather_impact * 5  # More maintenance in bad weather
        
        # 26-28. Operational status flags (weather-dependent, more sensitive thresholds)
        features['breakdown_flag'] = 1.0 if (tinggi_gelombang > 3.5 or kecepatan_angin > 60) else 0.0  # Stricter
        features['standby_flag'] = 1.0 if (tinggi_gelombang > 2.5 or kecepatan_angin > 50) else 0.0  # Mid-level
        features['operating_flag'] = 1.0 if (tinggi_gelombang < 2.0 and kecepatan_angin < 40) else 0.0  # Safer ops
        
        # 29-32. Breakdown history (IMPROVED: weather risk with normalized factors)
        breakdown_risk = (wave_factor * 0.5) + (wind_factor * 0.3) + (adjusted_age / 15) * 0.2
        features['breakdown_count_7d'] = breakdown_risk * 15  # Increased sensitivity
        features['breakdown_count_30d'] = breakdown_risk * 50  # Increased sensitivity
        features['breakdown_rate_30d'] = breakdown_risk
        features['operating_rate_7d'] = max(0.1, 1.0 - breakdown_risk * 1.2)  # Lower floor, more sensitive
        
        # 33-37. Health scores (IMPROVED: more discriminative ranges based on weather)
        features['health_score_age'] = max(0.1, 1.0 - weather_impact * 0.7)  # Lower floor, more sensitive
        features['health_score_maintenance'] = max(0.2, 1.0 - weather_impact * 0.8)  # Weather affects maintenance needs
        features['health_score_usage'] = max(0.15, 1.0 - weather_impact * 0.6)  # Weather limits usage
        features['health_score_breakdown'] = max(0.1, 1.0 - breakdown_risk * 1.1)  # More sensitive
        features['health_score_efficiency'] = max(0.2, 1.0 - weather_impact * 0.9)  # Weather impacts efficiency
        
        # 38. Condition score (IMPROVED: weighted by weather criticality)
        features['condition_score'] = (
            features['health_score_age'] * 0.15 +  # Less important (vessel age less variable)
            features['health_score_maintenance'] * 0.20 +  # Maintenance matters
            features['health_score_usage'] * 0.15 +  # Usage limited by weather
            features['health_score_breakdown'] * 0.30 +  # MOST IMPORTANT (weather risk)
            features['health_score_efficiency'] * 0.20  # Efficiency critical for operations
        )
        
        # 39-43. Risk composite scores (weather-driven)
        features['age_usage_interaction'] = adjusted_age * jam_operasional / 100
        features['age_breakdown_risk'] = adjusted_age * breakdown_risk
        features['critical_risk_flag'] = 1.0 if (tinggi_gelombang > 3.0 or kecepatan_angin > 60) else 0.0
        features['degradation_risk_flag'] = 1.0 if features['condition_score'] < 0.5 else 0.0
        features['combined_risk_score'] = (
            weather_impact * 0.5 +
            breakdown_risk * 0.3 +
            (1.0 - features['condition_score']) * 0.2
        )
        
        # 44. Type risk profile (vessel type risk)
        type_risk_map = {
            'Bulk Carrier': 0.5,
            'Container Ship': 0.6,
            'Tanker': 0.7,
            'Barge': 0.4
        }
        features['type_risk_profile'] = type_risk_map.get(tipe_kapal, 0.5)
        
        df = pd.DataFrame([features])
        logger.info(f"✓ Engineered {len(features)} features for port_operability from {len(input_data)} inputs")
        return df
    
    def engineer_road_risk_features(self, input_data: Dict[str, Any]) -> pd.DataFrame:
        """
        Transform Road Risk API input ke 38 engineered features
        Menggunakan infrastructure features yang sama seperti road_speed
        """
        # Road risk classification menggunakan features yang sama dengan road speed
        return self.engineer_road_speed_features(input_data)


def create_feature_engineer() -> FeatureEngineer:
    """Factory function untuk create feature engineer instance"""
    return FeatureEngineer()
