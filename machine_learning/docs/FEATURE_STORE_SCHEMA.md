# Feature Store Schema Documentation

**Project:** Mining Value Chain Optimization  
**Version:** 1.0  
**Last Updated:** Week 3-4  
**Maintained By:** ML Lead

---

## 📋 Overview

Feature store ini menyimpan **pre-computed features** yang telah di-engineer dari raw data operasional tambang. Tujuan: **reproducibility**, **consistency**, dan **efficiency** dalam model training & inference.

### Storage Format
- **Primary Format:** Apache Parquet (compressed with Snappy)
- **Backup Format:** CSV (compatibility)
- **Location:** `data/feature_store/`

### Update Frequency
- **Infrastructure Features:** Daily (batch refresh at 00:00 UTC)
- **Fleet Features:** Real-time (streaming from operational systems)

---

## 🏗️ Infrastructure Features

**File:** `infra_features.parquet`  
**Source Data:** Road Conditions, Weather Data, Production Records  
**Total Features:** 40+  
**Record Count:** ~12,000  
**Target Variables:** 
- `kecepatan_aktual_km_jam` (Regression)
- `waktu_tempuh_menit` (Regression)
- `status_jalan` (Classification: BAIK/WASPADA/TERBATAS)

### Feature Categories

#### 1. Temporal Features (9 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `hour` | int | Hour of day (0-23) | Extracted from `tanggal` |
| `day_of_week` | int | Day of week (0=Monday, 6=Sunday) | Extracted from `tanggal` |
| `shift` | int | Work shift (1=Day, 2=Night) | 1 if hour ∈ [6,18), else 2 |
| `is_weekend` | binary | Weekend flag | 1 if day_of_week ∈ {5,6}, else 0 |
| `hour_sin` | float | Cyclical hour encoding (sine) | sin(2π × hour / 24) |
| `hour_cos` | float | Cyclical hour encoding (cosine) | cos(2π × hour / 24) |
| `day_sin` | float | Cyclical day encoding (sine) | sin(2π × day_of_week / 7) |
| `day_cos` | float | Cyclical day encoding (cosine) | cos(2π × day_of_week / 7) |
| `month` | int | Month of year (1-12) | Extracted from `tanggal` |

**Use Case:** Capture daily/weekly patterns in speed and cycle time variations

---

#### 2. Weather Features (5 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `daily_rainfall` | float | Total rainfall (mm/day) | Daily aggregation from weather data |
| `cumulative_rainfall_3d` | float | 3-day cumulative rainfall | Rolling sum (3 days) |
| `cumulative_rainfall_7d` | float | 7-day cumulative rainfall | Rolling sum (7 days) |
| `rainfall_intensity` | categorical | Intensity level | HEAVY (>50mm), MODERATE (10-50mm), LIGHT (<10mm) |
| `wet_condition_flag` | binary | Wet road indicator | 1 if daily_rainfall > 10mm, else 0 |

**Use Case:** Weather impact on road speed (correlation: -0.351)

---

#### 3. Lag Features (7 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `speed_lag_1d` | float | Speed 1 day ago | Lagged by 1 day, grouped by `id_segmen` |
| `speed_lag_7d` | float | Speed 7 days ago | Lagged by 7 days, grouped by `id_segmen` |
| `speed_lag_14d` | float | Speed 14 days ago | Lagged by 14 days, grouped by `id_segmen` |
| `cycle_time_lag_1d` | float | Cycle time 1 day ago | Lagged by 1 day, grouped by `id_segmen` |
| `cycle_time_lag_7d` | float | Cycle time 7 days ago | Lagged by 7 days, grouped by `id_segmen` |
| `speed_change_1d` | float | Speed change (1-day delta) | speed - speed_lag_1d |
| `speed_change_7d` | float | Speed change (7-day delta) | speed - speed_lag_7d |

**Use Case:** Capture temporal dependencies and trend analysis

---

#### 4. Rolling Statistics Features (6 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `speed_rolling_mean_7d` | float | 7-day average speed | Rolling mean (window=7), grouped by `id_segmen` |
| `speed_rolling_std_7d` | float | 7-day speed volatility | Rolling std (window=7) |
| `speed_rolling_min_7d` | float | 7-day minimum speed | Rolling min (window=7) |
| `speed_rolling_max_7d` | float | 7-day maximum speed | Rolling max (window=7) |
| `speed_volatility_7d` | float | Coefficient of variation | std / mean (7-day window) |
| `cycle_time_rolling_mean_7d` | float | 7-day average cycle time | Rolling mean (window=7) |

**Use Case:** Smooth out noise, detect anomalies in performance

---

#### 5. Road Condition Features (5 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `friction_risk_score` | float | Friction hazard level (0-100) | 100 × (1 - koefisien_friksi) |
| `water_depth_category` | categorical | Water accumulation level | DEEP (>10cm), MODERATE (5-10cm), SHALLOW (<5cm) |
| `slope_category` | categorical | Road inclination level | STEEP (>15°), MODERATE (5-15°), FLAT (<5°) |
| `speed_drop_pct` | float | Speed degradation % | (speed_limit - actual_speed) / speed_limit × 100 |
| `road_hazard_score` | float | Composite hazard index (0-100) | 0.4×friction + 0.3×water_depth + 0.3×slope |

**Use Case:** Identify high-risk road segments for safety alerts

---

#### 6. Interaction Features (3 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `rainfall_friction_interaction` | float | Weather × road grip | daily_rainfall × (100 - friction_risk_score) |
| `slope_water_interaction` | float | Inclination × drainage | slope_pct × water_depth_cm |
| `weekend_rain_flag` | binary | Combined condition | is_weekend × wet_condition_flag |

**Use Case:** Capture non-linear relationships between features

---

## 🚛 Fleet Features

**File:** `fleet_features.parquet`  
**Source Data:** Operational Records Fleet, Weather Data, Port Loading  
**Total Features:** 34+  
**Record Count:** ~40,000  
**Target Variables:**
- `breakdown_flag` (Binary: 0=Operational, 1=Breakdown)
- `status_operasi` (Multi-class: Beroperasi/Maintenance/Breakdown/Standby)

### Feature Categories

#### 1. Equipment Age Features (4 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `equipment_age_months` | int | Equipment age in months | (2025 - tahun_operasi) × 12 |
| `equipment_age_years` | float | Equipment age in years | equipment_age_months / 12 |
| `age_risk_category` | categorical | Age-based risk level | NEW (<5y), MATURE (5-10y), OLD (10-15y), CRITICAL (>15y) |
| `high_age_risk` | binary | Old equipment flag | 1 if age > 10 years, else 0 |

**Insight:** Equipment >10 tahun memiliki failure rate **3.5x lebih tinggi**

---

#### 2. Maintenance Features (5 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `days_since_last_maintenance` | int | Days since last service | (current_date - last_maintenance_date).days |
| `maintenance_count_30d` | int | Maintenance frequency (30-day) | Rolling count (window=30 days) |
| `overdue_maintenance_flag` | binary | Overdue maintenance indicator | 1 if days_since > 14, else 0 |
| `maintenance_intensity` | float | Maintenance rate (per day) | maintenance_count_30d / 30 |
| `last_maintenance_date` | date | Date of last service | Lagged maintenance date |

**Use Case:** Predictive maintenance scheduling

---

#### 3. Usage Pattern Features (5 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `daily_usage_hours` | float | Daily operating hours | Diff(hour_meter_total) per day |
| `utilization_rate` | float | Equipment utilization (0-1) | daily_usage_hours / 24 (capped at 1.0) |
| `overwork_flag` | binary | High utilization indicator | 1 if utilization > 0.8, else 0 |
| `usage_intensity_7d` | float | 7-day average utilization | Rolling mean (window=7 days) |
| `cumulative_overwork_days` | int | Total overwork days | Cumulative sum of overwork_flag |

**Insight:** Utilization >80% berkorelasi dengan increased breakdown risk

---

#### 4. Operational Health Features (9 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `breakdown_flag` | binary | Current breakdown status | 1 if status = 'Breakdown', else 0 |
| `breakdown_history_count` | int | Total breakdowns per equipment | Cumulative sum of breakdown_flag |
| `breakdown_last_7d` | int | Recent breakdown count | Rolling sum (window=7 days) |
| `health_score_age` | float | Age component (0-100) | 100 × (1 - age / max_age) |
| `health_score_maintenance` | float | Maintenance component (0-100) | 100 × (1 - overdue_flag) |
| `health_score_usage` | float | Usage component (0-100) | 100 × (1 - utilization_rate) |
| `health_score_breakdown` | float | Breakdown component (0-100) | 100 × exp(-breakdown_count / 5) |
| `equipment_health_score` | float | Composite health index (0-100) | 0.3×age + 0.3×maint + 0.2×usage + 0.2×breakdown |
| `failure_risk_category` | categorical | Risk stratification | HIGH (<40), MEDIUM (40-60), LOW (60-80), HEALTHY (>80) |

**Use Case:** Real-time health monitoring dashboard

---

#### 5. Weather Integration Features (7 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `daily_rainfall` | float | Daily rainfall (mm) | Aggregated from weather data |
| `wind_speed_avg` | float | Average wind speed (km/h) | Daily mean wind speed |
| `humidity_avg` | float | Average humidity (%) | Daily mean humidity |
| `rainfall_penalty` | float | Rainfall impact score (0-40) | Clip(rainfall / 50, 0, 1) × 40 |
| `wind_penalty` | float | Wind impact score (0-30) | Clip(wind / 30, 0, 1) × 30 |
| `humidity_penalty` | float | Humidity impact score (0-30) | Clip((humidity-80) / 20, 0, 1) × 30 |
| `weather_operability_score` | float | Overall operability (0-100) | 100 - (rainfall_pen + wind_pen + humidity_pen) |
| `adverse_weather_flag` | binary | Poor weather condition | 1 if rainfall >50mm OR wind >30km/h, else 0 |

**Use Case:** Port operability forecasting

---

#### 6. Interaction Features (4 features)
| Feature Name | Data Type | Description | Calculation Logic |
|-------------|-----------|-------------|-------------------|
| `age_usage_interaction` | float | Age × utilization stress | equipment_age_years × utilization_rate |
| `maintenance_health_interaction` | float | Maintenance neglect impact | overdue_flag × (100 - health_score) |
| `weather_stress_interaction` | binary | Weather + overwork stress | adverse_weather_flag × overwork_flag |
| `combined_risk_score` | float | Multi-factor risk index (0-1) | 0.3×age_risk + 0.3×maint_risk + 0.2×usage_risk + 0.2×breakdown_risk |

**Use Case:** Multi-dimensional failure risk assessment

---

## 🔄 Feature Engineering Pipeline

### Infrastructure Features Workflow
```
Raw Data (Excel) 
    → DataLoader 
    → Temporal Extraction 
    → Weather Merge 
    → Lag/Rolling Computation 
    → Road Condition Scoring 
    → Interaction Features 
    → Parquet Export
```

### Fleet Features Workflow
```
Raw Data (Excel) 
    → DataLoader 
    → Age Calculation 
    → Maintenance History 
    → Usage Pattern Analysis 
    → Health Score Computation 
    → Weather Integration 
    → Parquet Export
```

---

## 📦 Versioning Strategy

### Version Naming Convention
`{domain}_features_v{YYYY-MM-DD}.parquet`

Example:
- `infra_features_v2025-01-15.parquet`
- `fleet_features_v2025-01-15.parquet`

### Backward Compatibility
- Schema changes require version increment
- New features: append-only (backward compatible)
- Deprecated features: marked in metadata but retained for 90 days

---

## 🧪 Data Quality Checks

### Pre-Production Validation
1. **Missing Values:** < 5% per feature
2. **Outliers:** IQR-based detection & capping
3. **Data Types:** Enforced with Pandas schemas
4. **Temporal Consistency:** No future-dated records
5. **Feature Distribution:** Statistical tests for drift detection

### Monitoring Metrics
- **Daily Freshness:** Feature lag < 24 hours
- **Completeness:** Record count matches source data
- **Consistency:** Feature correlations stable (±10%)

---

## 🚀 Usage Instructions

### Loading Features in Python
```python
import pandas as pd

# Infrastructure features
infra_df = pd.read_parquet('data/feature_store/infra_features.parquet')

# Fleet features
fleet_df = pd.read_parquet('data/feature_store/fleet_features.parquet')
```

### Feature Selection for Models
```python
# Infrastructure: Speed Regression
speed_features = [
    'hour', 'day_of_week', 'shift', 'hour_sin', 'hour_cos',
    'daily_rainfall', 'wet_condition_flag',
    'speed_lag_7d', 'speed_rolling_mean_7d',
    'friction_risk_score', 'road_hazard_score',
    'rainfall_friction_interaction'
]

# Fleet: Failure Prediction
failure_features = [
    'equipment_age_years', 'high_age_risk',
    'overdue_maintenance_flag', 'maintenance_intensity',
    'utilization_rate', 'overwork_flag',
    'equipment_health_score', 'breakdown_history_count',
    'age_usage_interaction', 'combined_risk_score'
]
```

---

## 📊 Feature Importance Rankings

### Infrastructure Domain (Top 10)
1. `speed_rolling_mean_7d` - Historical speed trend
2. `road_hazard_score` - Composite road safety
3. `friction_risk_score` - Road grip condition
4. `daily_rainfall` - Weather impact
5. `hour` - Time of day pattern
6. `speed_lag_7d` - Weekly seasonality
7. `shift` - Day/night operations
8. `cumulative_rainfall_7d` - Sustained weather effect
9. `rainfall_friction_interaction` - Combined weather-road risk
10. `slope_category` - Terrain difficulty

### Fleet Domain (Top 10)
1. `equipment_health_score` - Composite health index
2. `equipment_age_years` - Age degradation
3. `breakdown_history_count` - Historical failures
4. `utilization_rate` - Usage intensity
5. `overdue_maintenance_flag` - Maintenance neglect
6. `cumulative_overwork_days` - Cumulative stress
7. `age_usage_interaction` - Age + stress combined
8. `maintenance_intensity` - Service frequency
9. `weather_operability_score` - Port conditions
10. `combined_risk_score` - Multi-factor risk

---

## 🔐 Access Control

- **Read Access:** All ML Engineers, Data Analysts
- **Write Access:** Data Engineers only (via automated pipelines)
- **Schema Modification:** ML Lead approval required

---

## 📝 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Week 3-4 | Initial feature store creation | ML Lead |
| - | - | 40+ infrastructure features engineered | Farhan |
| - | - | 34+ fleet features engineered | Daffa |

---

## 🔗 Related Documentation

- [Week 1 Completion Report](WEEK1_COMPLETION_REPORT.md)
- [Quick Start Guide](QUICK_START_WEEK3.md)
- [Model Performance Report](MODEL_PERFORMANCE_REPORT_WEEK3.md)
- [EDA Notebook](../notebooks/00_Master_EDA_Complete_Dataset.ipynb)

---

**For Questions:** Contact ML Lead atau review notebook di `notebooks/03_feature_engineering/`
