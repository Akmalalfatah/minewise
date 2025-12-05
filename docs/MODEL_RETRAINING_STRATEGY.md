# 🔄 MODEL RETRAINING STRATEGY
## Continuous Learning & Model Lifecycle Management

**Document Version:** 1.0  
**Date:** December 3, 2025  
**Status:** 📋 PLANNED (Not Yet Implemented)

---

## ❓ APAKAH MODEL AKAN TERUS BELAJAR?

### **JAWABAN SINGKAT: TIDAK OTOMATIS** ⚠️

**Status Saat Ini:**
- ✅ Models **STATIC** (trained once, saved as PKL files)
- ❌ **TIDAK ada retraining otomatis**
- ❌ **TIDAK ada online learning**
- ❌ **TIDAK ada continuous learning pipeline**

**Artinya:**
- Model **TIDAK akan update** dengan data baru secara otomatis
- Model **TETAP menggunakan** pola yang dipelajari dari training data awal
- Untuk update model, harus **manual retrain** dengan data baru

---

## 🎯 KAPAN MODEL PERLU DI-RETRAIN?

### **Indikator Model Degradation:**

#### 1. **Performance Drift** 🔴
```
Baseline Accuracy: 95%
Current Accuracy:  82%  ← DROP 13% (CRITICAL!)

Action: RETRAIN IMMEDIATELY
```

#### 2. **Data Drift** 🟡
```
Training Data Distribution (2024):
- Average rainfall: 50mm/month
- Average temperature: 28°C

Production Data (2025):
- Average rainfall: 120mm/month  ← +140% SHIFT!
- Average temperature: 31°C      ← +10.7% SHIFT!

Action: RETRAIN within 1-2 weeks
```

#### 3. **Concept Drift** 🟠
```
Business Changes:
- New truck types added (HD 980)
- New road segments built
- New operational procedures

Action: RETRAIN with new labeled data
```

#### 4. **Temporal Decay** 🟢
```
Time Since Last Training: 6 months
Recommended Retrain Interval: 3-6 months

Action: Scheduled retrain (maintenance)
```

---

## 📅 RECOMMENDED RETRAINING SCHEDULE

### **Production Retraining Cadence:**

| Model | Retraining Frequency | Reason |
|-------|---------------------|--------|
| **Equipment Failure** | Every 2-3 months | Equipment patterns change with age/maintenance |
| **Performance Degradation** | Every 3 months | Cumulative degradation trends evolve |
| **Road Risk Classification** | Every month | Weather patterns, road conditions change |
| **Road Speed Prediction** | Every 2 months | Traffic patterns, road quality evolve |
| **Cycle Time Prediction** | Every 2 months | Operational efficiency improves |
| **Port Operability** | Every month | Seasonal weather patterns |
| **Fleet Risk Scoring** | Every 3 months | Risk patterns evolve with fleet age |

### **Trigger-Based Retraining:**

```python
# Pseudo-code for retraining triggers
if performance_drop > 10%:
    trigger_immediate_retrain()
elif data_drift_score > 0.3:
    trigger_scheduled_retrain(within_days=7)
elif days_since_last_train > 90:
    trigger_maintenance_retrain()
```

---

## 🛠️ RETRAINING IMPLEMENTATION OPTIONS

### **Option 1: Manual Retraining (Current) ⚠️**

**Process:**
1. Engineer exports new data from database
2. Run EDA notebook to validate data quality
3. Run training notebook with new data
4. Evaluate new model performance
5. If better: replace old PKL file
6. Restart API server

**Pros:**
- ✅ Simple, no infrastructure needed
- ✅ Full control over retraining decision
- ✅ Manual quality checks

**Cons:**
- ❌ Time-consuming (2-4 hours per retrain)
- ❌ Prone to human error
- ❌ Not scalable
- ❌ Delays in production updates

**Recommended For:** Capstone demo, MVP phase

---

### **Option 2: Scheduled Retraining (Semi-Automated) 🟡**

**Architecture:**
```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Cron Job       │─────>│  Retrain Script  │─────>│  Model Registry │
│  (Weekly)       │      │  (Python)        │      │  (MLflow)       │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                   │
                                   ↓
                         ┌──────────────────┐
                         │  Model Validator │
                         │  (Auto Deploy)   │
                         └──────────────────┘
```

**Implementation:**
```python
# scripts/scheduled_retrain.py
import schedule
import joblib
from train_models import train_all_models
from evaluate_models import evaluate_models

def retrain_pipeline():
    # 1. Fetch new data from database
    new_data = fetch_latest_data(days=90)
    
    # 2. Validate data quality
    if validate_data_quality(new_data):
        
        # 3. Train new models
        new_models = train_all_models(new_data)
        
        # 4. Evaluate against production baseline
        improvements = evaluate_models(new_models, baseline_models)
        
        # 5. Auto-deploy if improvement > 5%
        for model_name, improvement in improvements.items():
            if improvement > 0.05:  # 5% better
                deploy_model(model_name, new_models[model_name])
                log_deployment(model_name, improvement)

# Schedule: Every Sunday at 2 AM
schedule.every().sunday.at("02:00").do(retrain_pipeline)
```

**Pros:**
- ✅ Automated, no manual intervention
- ✅ Consistent retraining schedule
- ✅ Reduces engineer workload

**Cons:**
- ⚠️ Requires scheduling infrastructure (Airflow/Cron)
- ⚠️ Needs automated validation logic
- ⚠️ Risk of bad models auto-deploying

**Recommended For:** Production deployment (post-capstone)

---

### **Option 3: Continuous Learning (Advanced) 🔴**

**Architecture:**
```
┌───────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Production   │─────>│  Feature Store   │─────>│  Online Learner │
│  Predictions  │      │  (Real-time)     │      │  (Incremental)  │
└───────────────┘      └──────────────────┘      └─────────────────┘
       │                                                    │
       └────────> Feedback Loop <─────────────────────────┘
                 (Ground Truth)
```

**Implementation Concepts:**
- **Incremental Learning**: Update model weights with each new batch (scikit-learn `partial_fit`)
- **Online Learning**: Update model with every prediction (River library)
- **Active Learning**: Query human labels for uncertain predictions

**Example - Incremental Learning:**
```python
from sklearn.linear_model import SGDClassifier

# Initialize model with warm_start
model = SGDClassifier(warm_start=True)

# Initial training
model.fit(X_train, y_train)

# Incremental updates (weekly)
while True:
    new_batch = fetch_new_data(days=7)
    
    if len(new_batch) > 100:  # Sufficient samples
        model.partial_fit(new_batch.X, new_batch.y)
        
        # Validate performance
        val_score = model.score(X_val, y_val)
        
        if val_score > 0.80:  # Meets threshold
            deploy_model(model)
```

**Pros:**
- ✅ Model adapts continuously to new patterns
- ✅ No manual retraining needed
- ✅ Fastest adaptation to drift

**Cons:**
- ❌ Complex infrastructure (feature store, online serving)
- ❌ Risk of catastrophic forgetting
- ❌ Requires real-time monitoring
- ❌ Not all algorithms support incremental learning

**Recommended For:** Large-scale production (1-2 years post-deployment)

---

## 🏗️ RECOMMENDED IMPLEMENTATION ROADMAP

### **Phase 1: Capstone (Current) - Manual** ✅
```
Status: IMPLEMENTED
- Models trained once
- Saved as static PKL files
- No retraining capability
```

**Why Manual is OK for Capstone:**
- ✅ Demo purposes, not production scale
- ✅ Focus on model quality, not MLOps
- ✅ Allows careful evaluation and iteration

---

### **Phase 2: MVP Production (Week 9-12) - Scheduled**

**Implementation Steps:**

#### **Step 1: Create Retraining Script** (4-6 hours)
```python
# scripts/retrain_all_models.py

def retrain_model(model_name, new_data):
    """Retrain single model with new data"""
    
    # Load training pipeline
    pipeline = load_training_pipeline(model_name)
    
    # Train with new data
    new_model = pipeline.fit(new_data.X, new_data.y)
    
    # Evaluate
    metrics = evaluate_model(new_model, validation_data)
    
    # Compare with production model
    prod_model = load_production_model(model_name)
    prod_metrics = evaluate_model(prod_model, validation_data)
    
    # Deploy if better
    if metrics['accuracy'] > prod_metrics['accuracy']:
        save_model(new_model, f'models/{model_name}_v{version}.pkl')
        update_model_registry(model_name, metrics, version)
        return True
    
    return False

def retrain_all_models():
    """Retrain all 11 models"""
    
    results = {}
    
    for model_name in ALL_MODELS:
        print(f'Retraining {model_name}...')
        
        # Fetch new data (last 90 days)
        new_data = fetch_data_from_db(model_name, days=90)
        
        # Retrain
        success = retrain_model(model_name, new_data)
        
        results[model_name] = 'Deployed' if success else 'No Improvement'
    
    return results
```

#### **Step 2: Setup Cron Job** (1-2 hours)
```bash
# crontab -e
# Run retraining every Sunday at 2 AM
0 2 * * 0 /usr/bin/python /path/to/retrain_all_models.py >> /var/log/retrain.log 2>&1
```

Or using **Apache Airflow**:
```python
# dags/model_retraining_dag.py

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'ml_team',
    'retries': 2,
    'retry_delay': timedelta(hours=1),
}

dag = DAG(
    'model_retraining',
    default_args=default_args,
    description='Weekly model retraining pipeline',
    schedule_interval='0 2 * * 0',  # Every Sunday 2 AM
    start_date=datetime(2025, 12, 1),
    catchup=False,
)

fetch_data = PythonOperator(
    task_id='fetch_new_data',
    python_callable=fetch_data_from_db,
    dag=dag,
)

train_models = PythonOperator(
    task_id='train_all_models',
    python_callable=retrain_all_models,
    dag=dag,
)

validate_models = PythonOperator(
    task_id='validate_models',
    python_callable=validate_all_models,
    dag=dag,
)

deploy_models = PythonOperator(
    task_id='deploy_models',
    python_callable=deploy_if_better,
    dag=dag,
)

fetch_data >> train_models >> validate_models >> deploy_models
```

#### **Step 3: Monitoring Dashboard** (4-6 hours)
- Track model performance over time
- Alert if performance drops > 10%
- Trigger manual review if needed

**Estimated Total Effort:** 10-14 hours

---

### **Phase 3: Scale (6-12 months) - Continuous Learning**

**Advanced Features:**
- Feature Store (Feast, Tecton)
- Model Monitoring (Evidently AI, WhyLabs)
- A/B Testing (Champion vs Challenger)
- Automated rollback on degradation
- Data drift detection (Kolmogorov-Smirnov test)

**Estimated Effort:** 80-120 hours

---

## 📊 RETRAINING COST-BENEFIT ANALYSIS

### **Without Retraining (Current):**
```
Model Accuracy (Month 0):  95%
Model Accuracy (Month 3):  90%  (↓ 5%)
Model Accuracy (Month 6):  82%  (↓ 13%)
Model Accuracy (Month 12): 75%  (↓ 20%)

Business Impact:
- Increased false positives/negatives
- Suboptimal decisions
- Estimated loss: Rp 200-400M/year
```

### **With Scheduled Retraining:**
```
Model Accuracy (Always):   92-95%  (consistent)

Retraining Cost:
- Engineer time: 2 hours/month × Rp 200k/hour = Rp 400k/month
- Compute cost: Rp 100k/month
- Total: Rp 500k/month = Rp 6M/year

ROI = (Rp 200-400M saved) / (Rp 6M cost) = 33-67x ROI 🚀
```

**Verdict: RETRAINING IS ESSENTIAL FOR PRODUCTION** ✅

---

## 🎯 IMMEDIATE ACTION ITEMS (Post-Capstone)

### **Week 9-10: Setup Scheduled Retraining**

**Priority 1: Create Retraining Script** 🔴
- [ ] Write `scripts/retrain_all_models.py`
- [ ] Add data fetching from production DB
- [ ] Add automatic evaluation logic
- [ ] Add deployment automation
- [ ] Test on sample data

**Priority 2: Setup Scheduling** 🔴
- [ ] Choose scheduling tool (Airflow vs Cron)
- [ ] Create DAG/cron job for weekly retraining
- [ ] Setup email alerts for retraining status
- [ ] Test scheduled execution

**Priority 3: Monitoring** 🟡
- [ ] Add performance tracking to MLflow
- [ ] Create Grafana dashboard for model metrics
- [ ] Setup alerts for performance degradation
- [ ] Document retraining SOP

**Estimated Timeline:** 2 weeks (40-50 hours)

---

## 📌 KEY TAKEAWAYS

### **Current Status:**
- ❌ Models are **STATIC** (no continuous learning)
- ❌ Manual retraining required
- ✅ Sufficient for **capstone demo**

### **Production Requirements:**
- ✅ Implement **scheduled retraining** (every 1-3 months)
- ✅ Monitor **model performance** continuously
- ✅ Setup **automated deployment** pipeline

### **Long-Term Vision:**
- 🚀 **Continuous learning** with online updates
- 🚀 **A/B testing** for model improvements
- 🚀 **AutoML** for automatic architecture search

---

## 📚 REFERENCES

**Tools for Retraining:**
- **Airflow**: Workflow orchestration
- **MLflow**: Experiment tracking, model registry
- **Evidently AI**: Data/model drift detection
- **Grafana**: Performance monitoring
- **River**: Online learning library

**Best Practices:**
- [Google - MLOps: Continuous delivery and automation pipelines](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)
- [AWS - Machine Learning Lens](https://docs.aws.amazon.com/wellarchitected/latest/machine-learning-lens/)
- [Microsoft - MLOps Maturity Model](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/mlops/mlops-maturity-model)

---

**Document Owner:** ML Lead (Saidil Mifdal)  
**Last Updated:** December 3, 2025  
**Next Review:** Post-capstone (Week 9)
