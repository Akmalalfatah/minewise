# 📁 Penjelasan Struktur Folder Project

## ❓ Mengapa Ada 2 Folder `models/`?

### 1. **`models/` (ROOT LEVEL)** - Model Artifacts Storage
**Lokasi:** `minewise_ml/models/`  
**Tujuan:** Menyimpan file model yang sudah di-train (artifacts)  
**Isi:** 17 file `.pkl` dan `.json`

**File yang ada:**
```
models/
├── road_speed_optimized.pkl          # Model prediksi kecepatan jalan
├── cycle_time_optimized.pkl          # Model prediksi waktu siklus
├── road_risk_optimized.pkl           # Model klasifikasi risiko jalan
├── equipment_failure_optimized.pkl   # Model prediksi kegagalan equipment
├── port_operability_optimized.pkl    # Model operabilitas port
├── performance_degradation_optimized.pkl  # Model degradasi performa
├── fleet_risk_scoring_optimized.pkl  # Model scoring risiko fleet
├── cycle_time_feature_names.pkl      # Feature names untuk cycle time
└── ... (model lama/backup)
```

**Fungsi:**
- 💾 **Storage:** Tempat penyimpanan trained model artifacts
- 🔄 **Loading:** API membaca model dari folder ini saat startup
- 📦 **Deployment:** Model production yang siap digunakan
- 🔖 **Versioning:** Model lama tetap ada untuk backup

---

### 2. **`src/models/`** - Source Code untuk Model Logic
**Lokasi:** `minewise_ml/src/models/`  
**Tujuan:** Kode Python untuk training, building, dan managing models  
**Isi:** Folder kosong (fleet/, infrastructure/)

**Struktur yang seharusnya:**
```
src/models/
├── __init__.py                    # Package initializer
├── base_model.py                  # Base class untuk semua model
├── model_registry.py              # Registry untuk load/manage models
├── fleet/
│   ├── __init__.py
│   ├── performance_degradation.py # Training logic
│   └── fleet_risk.py              # Training logic
└── infrastructure/
    ├── __init__.py
    ├── road_speed.py              # Training logic
    ├── cycle_time.py              # Training logic
    ├── road_risk.py               # Training logic
    ├── equipment_failure.py       # Training logic
    └── port_operability.py        # Training logic
```

**Fungsi:**
- 🏗️ **Source Code:** Kode untuk build dan train model
- 🔧 **Logic:** Class dan function untuk model management
- 📊 **Training:** Script untuk training model baru
- 🧪 **Development:** Kode untuk eksperimen dan improvement

---

## 📋 Penjelasan Semua Folder di Project

### **ROOT LEVEL FOLDERS**

#### 1. **`configs/`** - Configuration Files
- **Tujuan:** File konfigurasi untuk berbagai environment
- **Isi:** YAML/JSON config untuk development, staging, production
- **Contoh:** database config, API settings, feature flags

#### 2. **`contoh_API_JSON/`** - API Example Files
- **Tujuan:** Contoh request/response JSON untuk frontend developer
- **Isi:** 5 file contoh untuk chatbox, dashboard, planner, dll
- **Status:** Reference only, tidak digunakan di runtime

#### 3. **`data/`** - Raw & Processed Data
- **Tujuan:** Storage untuk dataset
- **Struktur:**
  ```
  data/
  ├── raw/              # Data mentah dari source
  ├── processed/        # Data yang sudah dibersihkan
  ├── feature_store/    # Features untuk training
  └── warehouse/        # Data warehouse
  ```

#### 4. **`dataset/`** - Training Datasets
- **Tujuan:** Dataset untuk training model
- **Perbedaan dengan data/:** 
  - `data/` → operational data (daily usage)
  - `dataset/` → training data (ML development)

#### 5. **`deployment/`** - Deployment Artifacts
- **Tujuan:** File untuk deployment (Docker, K8s, CI/CD)
- **Isi:** Dockerfile, docker-compose, kubernetes manifests

#### 6. **`docs/`** - Project Documentation
- **Tujuan:** Dokumentasi lengkap project
- **Isi:** 28 file MD (API docs, model cards, reports, guides)

#### 7. **`mlartifacts/`** - MLflow Artifacts
- **Tujuan:** Storage MLflow untuk experiment tracking
- **Isi:** Model versions, metrics, parameters dari experiments
- **Auto-generated:** MLflow otomatis buat folder ini

#### 8. **`mlruns/`** - MLflow Runs
- **Tujuan:** Metadata experiment runs
- **Isi:** Run info, metrics, parameters
- **Auto-generated:** MLflow tracking

#### 9. **`models/`** ⭐ - Trained Model Artifacts
- **Sudah dijelaskan di atas**
- **Isi:** 17 model `.pkl` files
- **Fungsi:** Production model storage

#### 10. **`notebooks/`** - Jupyter Notebooks
- **Tujuan:** Exploratory Data Analysis (EDA) dan experiments
- **Struktur:**
  ```
  notebooks/
  ├── 00_Master_EDA_Complete_Dataset.ipynb
  ├── 01_infrastructure_modeling/
  ├── 02_fleet_modeling/
  ├── 03_explainability/
  ├── 04_modeling_infra/
  ├── 05_deployment_prep/
  └── 06_optimization/
  ```

#### 11. **`reports/`** - Generated Reports
- **Tujuan:** Output reports dari analysis
- **Isi:** HTML reports, visualizations, metrics

#### 12. **`scripts/`** - Utility Scripts
- **Tujuan:** Helper scripts untuk automation
- **Isi:** Training scripts, validation scripts, data prep
- **Contoh:**
  - `train_road_speed_optimized.py`
  - `validate_docker_deployment.py`
  - `generate_shap_explanations.py`

#### 13. **`src/`** ⭐ - Source Code Package
- **Tujuan:** Main application source code
- **Struktur:**
  ```
  src/
  ├── __init__.py
  ├── api/              # FastAPI application
  │   ├── main.py       # API entry point (967 lines)
  │   └── routers/      # API route modules
  ├── data/             # Data processing modules
  │   ├── data_loader.py
  │   ├── data_cleaner.py
  │   └── feature_engineer.py
  ├── models/           # Model source code (KOSONG!)
  │   ├── fleet/
  │   └── infrastructure/
  └── evaluation/       # Evaluation modules (KOSONG!)
  ```

#### 14. **`tests/`** - Test Suite
- **Tujuan:** Unit tests dan integration tests
- **Isi:**
  - `test_api_complete.py` - Complete API test dengan batch
  - `test_models_direct.py` - Direct model testing

---

## 🎯 Kesimpulan: Perbedaan `models/` vs `src/models/`

| Aspek | `models/` (ROOT) | `src/models/` (SRC) |
|-------|------------------|---------------------|
| **Tipe** | Data/Artifacts | Source Code |
| **Isi** | `.pkl`, `.json` files | `.py` Python modules |
| **Fungsi** | Model storage | Model training logic |
| **Digunakan oleh** | API saat runtime | Developer saat training |
| **Version Control** | Bisa di-gitignore | Harus di-commit |
| **Update** | Saat re-training | Saat development |

### Analogi Sederhana:
- **`models/`** = **Gudang** → Tempat nyimpan barang jadi (model .pkl)
- **`src/models/`** = **Pabrik** → Tempat bikin barang (kode training)

---

## ⚠️ Status Saat Ini

### ✅ Sudah Lengkap:
- `models/` - 17 trained models ✓
- `src/api/main.py` - API implementation ✓
- `src/data/` - Data processing modules ✓
- `tests/` - Test files ✓

### ❌ Masih Kosong (Perlu Dilengkapi):
- `src/models/` - Model training source code
- `src/evaluation/` - Evaluation modules
- `src/api/routers/` - API route modules (opsional)

### 💡 Rekomendasi:
Karena training sudah dilakukan via notebooks dan scripts/, folder `src/models/` **BISA DIBIARKAN KOSONG** jika tidak ada rencana refactoring training logic ke structure yang lebih modular.

Fokus saat ini: **API sudah berfungsi dengan baik** (batch endpoint fixed, 7 models loaded, tests passed).
