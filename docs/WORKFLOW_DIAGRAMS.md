# 📊 Mining Value Chain Optimization - Visual Workflow

## 🏗 Overall System Architecture

```mermaid
graph TB
    subgraph "Data Sources"
        A1[Equipment Operations<br/>6,985 records]
        A2[Road Conditions<br/>12,000 records]
        A3[Weather Data<br/>10,000+ records]
        A4[Vessel Operations<br/>44 loading ops]
        A5[Production Plans<br/>1,230 daily targets]
    end
    
    subgraph "Data Layer - ML Lead"
        B1[Data Ingestion<br/>Pipeline]
        B2[Data Cleaning<br/>& Validation]
        B3[Feature Store<br/>Reusable Features]
    end
    
    subgraph "ML Engineer A - Infrastructure"
        C1[Road Speed<br/>Prediction Model]
        C2[Cycle Time<br/>Prediction Model]
        C3[Road Risk<br/>Scoring Model]
    end
    
    subgraph "ML Engineer B - Fleet"
        D1[Equipment Failure<br/>Prediction Model]
        D2[Performance<br/>Degradation Model]
        D3[Port Operability<br/>Prediction Model]
        D4[Fleet Risk<br/>Scoring Engine]
    end
    
    subgraph "ML Lead - Integration"
        E1[Model Registry<br/>MLflow]
        E2[API Gateway<br/>FastAPI]
        E3[Monitoring<br/>Dashboard]
    end
    
    subgraph "Deployment"
        F1[Simulator<br/>Integration]
        F2[Agentic AI<br/>Recommendation]
        F3[Dispatching<br/>System]
        F4[Production<br/>Dashboard]
    end
    
    A1 --> B1
    A2 --> B1
    A3 --> B1
    A4 --> B1
    A5 --> B1
    
    B1 --> B2
    B2 --> B3
    
    B3 --> C1
    B3 --> C2
    B3 --> C3
    B3 --> D1
    B3 --> D2
    B3 --> D3
    B3 --> D4
    
    C1 --> E1
    C2 --> E1
    C3 --> E1
    D1 --> E1
    D2 --> E1
    D3 --> E1
    D4 --> E1
    
    E1 --> E2
    E2 --> E3
    
    E2 --> F1
    E2 --> F2
    E2 --> F3
    E3 --> F4
```

---

## 📅 8-Week Project Timeline

```mermaid
gantt
    title Mining Value Chain Optimization - 8 Week Timeline
    dateFormat YYYY-MM-DD
    
    section Week 1-2: Foundation
    Project Setup           :done, w1, 2025-12-02, 3d
    EDA Infrastructure      :active, w2, after w1, 4d
    EDA Fleet               :active, w3, after w1, 4d
    Data Quality Report     :w4, after w2, 3d
    
    section Week 3-4: Baseline
    Feature Store Setup     :w5, after w4, 3d
    Feature Engineering A   :w6, after w5, 4d
    Feature Engineering B   :w7, after w5, 4d
    Baseline Models         :w8, after w6, 5d
    
    section Week 5-6: Optimization
    Hyperparameter Tuning   :w9, after w8, 5d
    Advanced Models         :w10, after w9, 5d
    Model Interpretation    :w11, after w10, 4d
    
    section Week 7: Integration
    API Development         :w12, after w11, 3d
    Integration Testing     :w13, after w12, 4d
    Documentation           :w14, after w13, 3d
    
    section Week 8: Deployment
    Production Deploy       :w15, after w14, 2d
    Monitoring Setup        :w16, after w15, 2d
    Presentation Prep       :w17, after w16, 3d
```

---

## 🔄 ML Pipeline Flow - ML Engineer A (Infrastructure)

```mermaid
flowchart LR
    subgraph "Data Collection"
        A1[Road Condition Logs<br/>12,000 records] --> B1
        A2[Weather Data<br/>10,000+ records] --> B1
        A3[Equipment Operations] --> B1
    end
    
    subgraph "Data Preprocessing"
        B1[Merge by<br/>Date & Location]
        B1 --> B2[Handle Missing<br/>Values]
        B2 --> B3[Outlier<br/>Detection]
        B3 --> B4[Type<br/>Conversion]
    end
    
    subgraph "Feature Engineering"
        B4 --> C1[Temporal Features<br/>hour, shift, day_of_week]
        B4 --> C2[Lag Features<br/>rain_3h_lag, rain_6h_lag]
        B4 --> C3[Rolling Features<br/>weather_rolling_24h]
        B4 --> C4[Interaction Features<br/>rain * slope]
        C1 --> C5[Feature Store]
        C2 --> C5
        C3 --> C5
        C4 --> C5
    end
    
    subgraph "Model Training"
        C5 --> D1[Road Speed<br/>XGBoost/LightGBM]
        C5 --> D2[Cycle Time<br/>XGBoost/LightGBM]
        C5 --> D3[Road Risk<br/>Multi-class Classification]
    end
    
    subgraph "Evaluation"
        D1 --> E1[RMSE < 3 km/h?]
        D2 --> E2[MAPE < 15%?]
        D3 --> E3[F1 > 0.85?]
        E1 --> E4{Pass?}
        E2 --> E4
        E3 --> E4
    end
    
    subgraph "Deployment"
        E4 -->|Yes| F1[Model Registry]
        E4 -->|No| C5
        F1 --> F2[API Endpoint]
        F2 --> F3[Simulator<br/>Integration]
        F2 --> F4[Agentic AI<br/>Risk Scoring]
    end
```

---

## 🔄 ML Pipeline Flow - ML Engineer B (Fleet & Logistics)

```mermaid
flowchart LR
    subgraph "Data Collection"
        A1[Equipment Operations<br/>6,985 records] --> B1
        A2[Equipment Master<br/>100 units] --> B1
        A3[Vessel Loading<br/>44 operations] --> B1
        A4[Port Weather Data] --> B1
    end
    
    subgraph "Data Preprocessing"
        B1[Join Equipment<br/>+ Weather Data]
        B1 --> B2[Handle Imbalanced<br/>Data - SMOTE]
        B2 --> B3[Outlier<br/>Treatment]
        B3 --> B4[Feature<br/>Engineering]
    end
    
    subgraph "Feature Engineering"
        B4 --> C1[Usage Patterns<br/>avg_ritase_7d, cumulative_hours]
        B4 --> C2[Degradation Indicators<br/>efficiency_ratio_trend]
        B4 --> C3[Weather Exposure<br/>extreme_weather_days]
        B4 --> C4[Marine Features<br/>wind_severity, visibility]
        C1 --> C5[Feature Store]
        C2 --> C5
        C3 --> C5
        C4 --> C5
    end
    
    subgraph "Model Training"
        C5 --> D1[Equipment Failure<br/>XGBoost + SMOTE]
        C5 --> D2[Performance Degradation<br/>Regression]
        C5 --> D3[Port Operability<br/>Binary Classification]
        C5 --> D4[Fleet Risk Scoring<br/>Hybrid ML + Rules]
    end
    
    subgraph "Evaluation"
        D1 --> E1[Recall > 0.80?<br/>catch 80% failures]
        D2 --> E2[R² > 0.70?]
        D3 --> E3[Precision > 0.85?<br/>minimize false alarms]
        D4 --> E4[Business Impact?]
        E1 --> E5{Pass?}
        E2 --> E5
        E3 --> E5
        E4 --> E5
    end
    
    subgraph "Deployment"
        E5 -->|Yes| F1[Model Registry]
        E5 -->|No| C5
        F1 --> F2[API Endpoint]
        F2 --> F3[Dispatching<br/>System]
        F2 --> F4[Maintenance<br/>Scheduler]
        F2 --> F5[Agentic AI<br/>Recommendations]
    end
```

---

## 🤝 Team Collaboration Flow

```mermaid
flowchart TB
    subgraph "ML Lead - Saidil"
        L1[System Architecture<br/>Design]
        L2[Feature Store<br/>Management]
        L3[Model Registry<br/>MLflow Setup]
        L4[API Integration<br/>FastAPI]
        L5[Code Review &<br/>Documentation]
    end
    
    subgraph "ML Engineer A - Farhan"
        A1[EDA: Road &<br/>Weather]
        A2[Feature Engineering<br/>Infrastructure]
        A3[Train Models:<br/>Speed, Cycle, Risk]
        A4[SHAP Analysis]
        A5[Simulator<br/>Integration]
    end
    
    subgraph "ML Engineer B - Daffa"
        B1[EDA: Equipment &<br/>Port]
        B2[Feature Engineering<br/>Fleet]
        B3[Train Models:<br/>Failure, Port, Risk]
        B4[Cost-Benefit<br/>Analysis]
        B5[Dispatching<br/>Integration]
    end
    
    subgraph "Shared Resources"
        S1[(Feature Store)]
        S2[(Model Registry)]
        S3[API Gateway]
    end
    
    L1 --> L2
    L2 --> S1
    L3 --> S2
    L4 --> S3
    
    A1 --> A2
    A2 --> S1
    A2 --> A3
    A3 --> S2
    A3 --> A4
    A4 --> A5
    A5 --> S3
    
    B1 --> B2
    B2 --> S1
    B2 --> B3
    B3 --> S2
    B3 --> B4
    B4 --> B5
    B5 --> S3
    
    S1 --> L5
    S2 --> L5
    S3 --> L5
    
    A3 -.Review.-> L5
    B3 -.Review.-> L5
    
    L5 -.Feedback.-> A3
    L5 -.Feedback.-> B3
```

---

## 📊 Model Performance Dashboard Structure

```mermaid
graph TB
    subgraph "Business Metrics Dashboard"
        M1[Unplanned Downtime<br/>Target: < 6%]
        M2[Road Delay<br/>Target: < 10 min/ritase]
        M3[Port Loading Delay<br/>Target: < 3 hours]
        M4[Production Achievement<br/>Target: > 95%]
    end
    
    subgraph "ML Engineer A Models"
        A1[Road Speed Model<br/>RMSE: ? km/h<br/>Target: < 3]
        A2[Cycle Time Model<br/>MAPE: ? %<br/>Target: < 15%]
        A3[Road Risk Model<br/>F1: ?<br/>Target: > 0.85]
    end
    
    subgraph "ML Engineer B Models"
        B1[Equipment Failure<br/>Recall: ?<br/>Target: > 0.80]
        B2[Performance Degrad<br/>R²: ?<br/>Target: > 0.70]
        B3[Port Operability<br/>Precision: ?<br/>Target: > 0.85]
        B4[Fleet Risk Scoring<br/>Impact: ?]
    end
    
    subgraph "Model Health"
        H1[Data Drift<br/>Detection]
        H2[Prediction<br/>Latency]
        H3[API<br/>Uptime]
        H4[Error Rate<br/>Tracking]
    end
    
    A1 --> M2
    A2 --> M2
    A3 --> M2
    B1 --> M1
    B2 --> M1
    B3 --> M3
    B4 --> M1
    
    A1 --> H1
    B1 --> H1
    A2 --> H2
    B3 --> H2
    A3 --> H3
    B4 --> H3
```

---

## 🔄 Data Flow Architecture

```mermaid
flowchart TD
    subgraph "Raw Data Layer"
        R1[(Equipment DB)]
        R2[(Weather API)]
        R3[(Road Sensors)]
        R4[(Vessel Tracking)]
        R5[(Production System)]
    end
    
    subgraph "Data Ingestion - ML Lead"
        I1[ETL Pipeline]
        I2[Data Validation]
        I3[Quality Checks]
    end
    
    subgraph "Processed Data Layer"
        P1[(Cleaned Data)]
        P2[(Feature Store)]
    end
    
    subgraph "Model Layer"
        ML1[Infrastructure Models]
        ML2[Fleet Models]
    end
    
    subgraph "Serving Layer"
        S1[Model Registry<br/>MLflow]
        S2[API Gateway<br/>FastAPI]
        S3[Cache Layer<br/>Redis]
    end
    
    subgraph "Application Layer"
        A1[Simulator]
        A2[Agentic AI]
        A3[Dashboard]
        A4[Mobile App]
    end
    
    subgraph "Monitoring Layer"
        MO1[Model Monitoring]
        MO2[Data Drift Detection]
        MO3[Performance Tracking]
        MO4[Alert System]
    end
    
    R1 --> I1
    R2 --> I1
    R3 --> I1
    R4 --> I1
    R5 --> I1
    
    I1 --> I2
    I2 --> I3
    I3 --> P1
    P1 --> P2
    
    P2 --> ML1
    P2 --> ML2
    
    ML1 --> S1
    ML2 --> S1
    S1 --> S2
    S2 --> S3
    
    S3 --> A1
    S3 --> A2
    S3 --> A3
    S3 --> A4
    
    S2 --> MO1
    P2 --> MO2
    ML1 --> MO3
    ML2 --> MO3
    MO3 --> MO4
```

---

## 🎯 Feature Engineering Strategy

```mermaid
mindmap
  root((Feature<br/>Engineering))
    Temporal
      Hour of Day
      Shift 1/2/3
      Day of Week
      Is Weekend
      Month
      Season
    Lag Features
      rain_3h_lag
      rain_6h_lag
      rain_12h_lag
      speed_previous_shift
    Rolling Aggregations
      weather_rolling_6h
      weather_rolling_24h
      usage_rolling_7d
      usage_rolling_30d
    Interaction
      rain x slope
      wind x visibility
      load x distance
      age x usage
    Domain Specific
      weather_severity_index
      equipment_health_score
      road_safety_score
      utilization_rate
    Categorical Encoding
      One-Hot: lokasi, tipe
      Label: shift, status
      Target: high cardinality
```

---

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        D1[Local Development]
        D2[Jupyter Notebooks]
        D3[MLflow Tracking]
    end
    
    subgraph "Model Training"
        T1[Feature Engineering]
        T2[Model Training]
        T3[Hyperparameter Tuning]
        T4[Model Evaluation]
    end
    
    subgraph "Model Registry"
        R1[MLflow Registry]
        R2[Model Versioning]
        R3[Staging Area]
        R4[Production Models]
    end
    
    subgraph "Containerization"
        C1[Docker Image]
        C2[FastAPI App]
        C3[Model Artifacts]
    end
    
    subgraph "Deployment"
        DP1[Docker Container]
        DP2[Load Balancer]
        DP3[API Endpoints]
    end
    
    subgraph "Monitoring"
        M1[Prometheus]
        M2[Grafana Dashboard]
        M3[Alert Manager]
    end
    
    D1 --> T1
    D2 --> T1
    T1 --> T2
    T2 --> T3
    T3 --> T4
    T4 --> D3
    D3 --> R1
    
    R1 --> R2
    R2 --> R3
    R3 --> R4
    
    R4 --> C1
    C2 --> C1
    C3 --> C1
    
    C1 --> DP1
    DP1 --> DP2
    DP2 --> DP3
    
    DP3 --> M1
    M1 --> M2
    M2 --> M3
```

---

## 📈 Model Performance Tracking

```mermaid
gantt
    title Model Performance Over Time (Expected Progression)
    dateFormat YYYY-MM-DD
    axisFormat %m/%d
    
    section Road Speed Model
    Baseline (R² 0.65)    :done, m1, 2025-12-16, 2d
    Optimized (R² 0.78)   :active, m2, 2025-12-23, 2d
    Production (R² 0.82)  :m3, 2025-12-27, 2d
    
    section Equipment Failure
    Baseline (Recall 0.70) :done, m4, 2025-12-16, 2d
    Optimized (Recall 0.82) :active, m5, 2025-12-23, 2d
    Production (Recall 0.85) :m6, 2025-12-27, 2d
    
    section Integration
    API Development        :m7, 2025-12-23, 3d
    Testing               :m8, 2025-12-26, 3d
    Production Deploy     :m9, 2025-12-29, 2d
```

---

## 🎓 Capstone Presentation Flow

```mermaid
flowchart LR
    P1[Problem<br/>Statement] --> P2[Business<br/>Impact]
    P2 --> P3[Dataset<br/>Overview]
    P3 --> P4[ML Pipeline<br/>Architecture]
    P4 --> P5[Model<br/>Development]
    P5 --> P6[Results &<br/>Metrics]
    P6 --> P7[Live<br/>Demo]
    P7 --> P8[Business<br/>Value]
    P8 --> P9[Future<br/>Work]
    
    style P1 fill:#ff6b6b
    style P4 fill:#4ecdc4
    style P6 fill:#95e1d3
    style P7 fill:#f9ca24
    style P8 fill:#6ab04c
```

---

**Created by:** ML Lead - Saidil Mifdal  
**Last Updated:** December 2, 2025  
**Tool:** Mermaid Diagrams  
**Status:** ✅ Ready for Team Review
