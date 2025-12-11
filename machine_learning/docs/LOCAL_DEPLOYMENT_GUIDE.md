# 🚀 Local Deployment Guide - MineWise ML API

**Project**: Mining Value Chain Optimization  
**Version**: 1.0.0  
**Date**: December 11, 2025  
**Environment**: Local Development & Testing

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Running the API](#running-the-api)
6. [Testing the API](#testing-the-api)
7. [Troubleshooting](#troubleshooting)
8. [Production Considerations](#production-considerations)

---

## 📦 Prerequisites

### Required Software

| Software | Version | Purpose | Download Link |
|----------|---------|---------|---------------|
| Python | 3.9 - 3.11 | Runtime environment | https://www.python.org/downloads/ |
| Git | Latest | Version control | https://git-scm.com/downloads |
| PowerShell | 5.1+ (Windows) | Command execution | Built-in Windows |

### Hardware Requirements

**Minimum**:
- CPU: 4 cores
- RAM: 8 GB
- Storage: 5 GB free space

**Recommended**:
- CPU: 8+ cores
- RAM: 16 GB
- Storage: 10 GB free space
- SSD for faster model loading

---

## 📁 Project Structure

```
minewise_ml/
├── src/
│   ├── api/
│   │   ├── main.py                    # Main API with 7 ML endpoints
│   │   ├── frontend_endpoints.py      # 6 Frontend integration endpoints
│   │   └── feature_engineering.py     # Feature processing pipeline
│   ├── ml/
│   │   └── predictions.py             # ML predictions aggregation
│   ├── ai/
│   │   └── context_builder.py         # LLM data collection
│   └── data/
│       ├── db_connection.py           # Database connection
│       └── db_queries.py              # SQL queries
├── models/
│   ├── road_speed_model.pkl           # 7 trained ML models
│   ├── cycle_time_model.pkl
│   ├── road_risk_model.pkl
│   ├── equipment_failure_model.pkl
│   ├── port_operability_model.pkl
│   ├── performance_degradation_model.pkl
│   └── fleet_risk_model.pkl
├── tests/
│   ├── test_real_api_json_validation.py  # Comprehensive API tests
│   └── test_llm_data_collection.py       # LLM system tests
├── contoh_API_JSON/
│   ├── output_dashboard_real.json        # Real API outputs (6 files)
│   └── README_OUTPUT_FILES.md
├── docs/
│   ├── API_DEPLOYMENT_GUIDE.md
│   ├── FRONTEND_INTEGRATION_GUIDE.md
│   └── LOCAL_DEPLOYMENT_GUIDE.md         # This file
├── requirements.txt                      # Python dependencies
├── run_api.py                            # API startup script
└── .env.example                          # Environment variables template
```

---

## 🔧 Installation Steps

### Step 1: Clone Repository

```powershell
# Clone the repository
git clone https://github.com/Akmalalfatah/minewise.git

# Navigate to ML project directory
cd minewise_ml
```

### Step 2: Create Virtual Environment

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Windows CMD:
.\venv\Scripts\activate.bat

# Linux/Mac:
source venv/bin/activate
```

**Verify activation**:
```powershell
# Should show path to venv Python
Get-Command python | Select-Object Source
```

### Step 3: Install Dependencies

```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install all required packages
pip install -r requirements.txt

# Verify installation
pip list
```

**Key packages installed**:
- `fastapi>=0.104.0` - Web framework
- `uvicorn>=0.24.0` - ASGI server
- `scikit-learn>=1.3.0` - ML library
- `xgboost>=2.0.0` - Gradient boosting
- `pandas>=2.0.0` - Data manipulation
- `numpy>=1.24.0` - Numerical computing

### Step 4: Verify ML Models

```powershell
# Check if all 7 models exist
Get-ChildItem models/*.pkl | Select-Object Name, Length
```

**Expected output**:
```
Name                                    Length
----                                    ------
cycle_time_model.pkl                   ~500KB
equipment_failure_model.pkl            ~800KB
fleet_risk_model.pkl                   ~600KB
performance_degradation_model.pkl      ~700KB
port_operability_model.pkl             ~400KB
road_risk_model.pkl                    ~900KB
road_speed_model.pkl                   ~1.2MB
```

If models are missing, train them:
```powershell
# Train all models (takes 5-15 minutes)
python scripts/train_road_speed_optimized.py
python scripts/train_cycle_time_optimized.py
python scripts/train_road_risk_optimized.py
python scripts/train_equipment_failure_optimized.py
python scripts/train_port_operability_optimized.py
# ... etc
```

---

## ⚙️ Configuration

### Option 1: Without Database (Mock Mode)

**Default behavior** - API works without database using mock data.

No configuration needed! Skip to [Running the API](#running-the-api).

### Option 2: With Database (Full Features)

#### Create `.env` file:

```powershell
# Copy example file
Copy-Item .env.example .env

# Edit with your settings
notepad .env
```

#### Basic Configuration (`.env`):

```ini
# ============================================
# APPLICATION
# ============================================
ENVIRONMENT=development
DEBUG=true
APP_VERSION=1.0.0

# ============================================
# DATABASE (Optional - comment out for mock mode)
# ============================================
# DATABASE_URL=postgresql://user:password@localhost:5432/minewise_db
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=minewise_db
# DB_USER=ml_api_user
# DB_PASSWORD=your_password_here

# ============================================
# API SERVER
# ============================================
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=false

# ============================================
# ML MODELS
# ============================================
MODELS_DIR=models/
MODEL_CACHE_SIZE=7

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=INFO
LOG_FORMAT=json
```

---

## 🚀 Running the API

### Method 1: Using Python Script (Recommended)

```powershell
# Start API server
python run_api.py
```

**Expected output**:
```
================================================================================
  MINING VALUE CHAIN OPTIMIZATION - API SERVER
================================================================================

  Starting FastAPI server...
  API Documentation: http://localhost:8000/docs
  ReDoc: http://localhost:8000/redoc
  Health Check: http://localhost:8000/health

  Press CTRL+C to stop the server
================================================================================

INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     ✓ Loading 7 ML models...
INFO:     ✓ Road Speed Model loaded
INFO:     ✓ Cycle Time Model loaded
INFO:     ✓ Road Risk Model loaded
INFO:     ✓ Equipment Failure Model loaded
INFO:     ✓ Port Operability Model loaded
INFO:     ✓ Performance Degradation Model loaded
INFO:     ✓ Fleet Risk Model loaded
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Method 2: Using Uvicorn Directly

```powershell
# Start with auto-reload (development)
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload

# Start without reload (production-like)
uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

### Method 3: Background Process

```powershell
# Start in background (Windows)
Start-Process python -ArgumentList "run_api.py" -WindowStyle Hidden

# Check if running
Get-NetTCPConnection -LocalPort 8000 -State Listen
```

---

## 🧪 Testing the API

### 1. Health Check

```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:8000/health"

# Output:
# {
#   "status": "healthy",
#   "models_loaded": 7,
#   "version": "1.0.0"
# }
```

### 2. API Documentation

Open in browser:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 3. Test ML Endpoints

#### Road Speed Prediction:
```powershell
$body = @{
    jenis_jalan = "UTAMA"
    kondisi_permukaan = "KERING"
    curah_hujan_mm = 0.5
    suhu_celcius = 28.5
    kecepatan_angin_ms = 3.2
    elevasi_mdpl = 450.0
    kemiringan_persen = 5.5
    beban_muatan_ton = 85.0
    jam_operasi = 10
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/predict/road-speed" -Method Post -Body $body -ContentType "application/json"
```

**Expected Response**:
```json
{
  "success": true,
  "prediction": 25.43,
  "confidence": 0.92,
  "timestamp": "2025-12-11T10:30:00"
}
```

#### Dashboard API:
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/dashboard"
```

**Expected Response**: See `contoh_API_JSON/output_dashboard_real.json`

### 4. Run Comprehensive Test Suite

```powershell
# Test all 13 endpoints (7 ML + 6 Frontend)
python tests/test_real_api_json_validation.py
```

**Expected Output**:
```
================================================================================
                  REAL API TESTING - COMPREHENSIVE VALIDATION
================================================================================

✓ API is running and healthy
ℹ    Status: healthy
ℹ    Models Loaded: 7

TEST SUITE 1: ML MODEL PREDICTIONS (7 Models)

Test 1.1: Road Speed Prediction
✓ Road Speed: 2.10s
ℹ    Prediction: 25.43 km/h
ℹ    Confidence: 92.0%

... (13 tests total)

Overall Statistics:
  Total Tests: 13
  ✓ Passed: 13
  ⚠ Partial: 0
  ✗ Failed: 0
  Average Response Time: 2.41s
  Success Rate: 100.0%

  🎉 EXCELLENT! System is production-ready!
```

### 5. Performance Benchmarking

```powershell
# Test response times
Measure-Command { Invoke-RestMethod -Uri "http://localhost:8000/api/dashboard" }

# Load test (100 requests)
1..100 | ForEach-Object { 
    Start-Job -ScriptBlock { 
        Invoke-RestMethod -Uri "http://localhost:8000/health" 
    }
} | Wait-Job | Receive-Job
```

---

## 🔍 API Endpoints Reference

### ML Model Endpoints (7 total)

| Endpoint | Method | Description | Response Time |
|----------|--------|-------------|---------------|
| `/predict/road-speed` | POST | Predict vehicle speed | ~2.1s |
| `/predict/cycle-time` | POST | Predict hauling cycle time | ~2.0s |
| `/predict/road-risk` | POST | Classify road risk level | ~4.2s |
| `/predict/equipment-failure` | POST | Predict equipment failure | ~2.3s |
| `/predict/port-operability` | POST | Forecast port operability | ~2.0s |
| `/predict/performance-degradation` | POST | Predict performance drop | ~2.1s |
| `/predict/fleet-risk` | POST | Assess fleet risk score | ~2.1s |

### Frontend Integration Endpoints (6 total)

| Endpoint | Method | Description | Response Time |
|----------|--------|-------------|---------------|
| `/api/dashboard` | GET | Main dashboard data | ~4.1s |
| `/api/mine-planner` | GET | Mining operations planning | ~2.0s |
| `/api/shipping-planner` | GET | Shipping schedule & port data | ~2.0s |
| `/api/simulation-analysis` | POST | What-if scenario analysis | ~2.0s |
| `/api/chatbox` | POST | AI chatbot interaction | ~2.0s |
| `/api/reports` | GET | Report generator & history | ~2.0s |

### System Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information |
| `/health` | GET | Health check |
| `/docs` | GET | Swagger documentation |
| `/redoc` | GET | ReDoc documentation |

---

## 🛠️ Troubleshooting

### Issue 1: Port Already in Use

**Error**: `OSError: [WinError 10048] Only one usage of each socket address`

**Solution**:
```powershell
# Find process using port 8000
Get-NetTCPConnection -LocalPort 8000 | Select-Object OwningProcess
$processId = (Get-NetTCPConnection -LocalPort 8000).OwningProcess

# Stop the process
Stop-Process -Id $processId -Force

# Or use different port
uvicorn src.api.main:app --port 8001
```

### Issue 2: Module Not Found

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```powershell
# Ensure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall requirements
pip install -r requirements.txt

# Verify installation
pip show fastapi uvicorn
```

### Issue 3: Model Loading Failed

**Error**: `FileNotFoundError: models/road_speed_model.pkl not found`

**Solution**:
```powershell
# Check models directory
Get-ChildItem models/

# Train missing models
python scripts/train_road_speed_optimized.py

# Verify model file
Test-Path models/road_speed_model.pkl
```

### Issue 4: Slow Response Times

**Symptoms**: API responses >10 seconds

**Solutions**:

1. **Check system resources**:
```powershell
# CPU usage
Get-Counter '\Processor(_Total)\% Processor Time'

# Memory usage
Get-Counter '\Memory\Available MBytes'
```

2. **Optimize model loading**:
```python
# In src/api/main.py, enable caching
# Models are cached by default
```

3. **Disable auto-reload**:
```powershell
# Use production mode
python run_api.py
# Instead of: uvicorn ... --reload
```

### Issue 5: HTTP 422 Validation Error

**Error**: `{"detail": [{"loc": ["body", "field_name"], "msg": "field required"}]}`

**Solution**: Check request body matches Pydantic schema

**Example**:
```powershell
# ❌ WRONG - missing required fields
$body = @{ curah_hujan = 15.5 } | ConvertTo-Json

# ✅ CORRECT - all required fields
$body = @{
    jenis_jalan = "UTAMA"
    kondisi_permukaan = "KERING"
    curah_hujan_mm = 0.5
    suhu_celcius = 28.5
    kecepatan_angin_ms = 3.2
    elevasi_mdpl = 450.0
    kemiringan_persen = 5.5
    beban_muatan_ton = 85.0
    jam_operasi = 10
} | ConvertTo-Json
```

Refer to `/docs` for complete schema requirements.

### Issue 6: CORS Errors (Frontend Integration)

**Error**: `Access-Control-Allow-Origin` error in browser

**Solution**: CORS is already enabled in `main.py`
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, update to specific origins:
```python
allow_origins=["http://localhost:3000", "https://yourdomain.com"]
```

---

## 📊 Monitoring & Logs

### View Real-time Logs

API logs are printed to console by default. For file logging:

```powershell
# Redirect to file
python run_api.py > api_logs.txt 2>&1

# View logs in real-time
Get-Content api_logs.txt -Wait
```

### Log Levels

Edit `run_api.py` to change log level:
```python
uvicorn.run(
    app, 
    host="0.0.0.0", 
    port=8000,
    log_level="debug"  # Options: debug, info, warning, error
)
```

### Performance Metrics

Check response times in test results:
```powershell
python tests/test_real_api_json_validation.py | Select-String "Response Time"
```

---

## 🔒 Security Considerations (Local)

### For Local Development:

✅ **Enabled**:
- CORS allows all origins
- Debug mode available
- Auto-reload enabled
- Detailed error messages

### Before Production:

❌ **Must Change**:
- [ ] Restrict CORS origins
- [ ] Disable debug mode
- [ ] Remove auto-reload
- [ ] Add authentication
- [ ] Enable HTTPS
- [ ] Set strong passwords
- [ ] Rate limiting

See `docs/API_DEPLOYMENT_GUIDE.md` for production setup.

---

## 🚀 Production Considerations

### When Ready for Production:

1. **Environment Variables**:
```powershell
# Create production config
Copy-Item .env.example .env.production
# Edit with production values
```

2. **Disable Debug**:
```python
# In .env.production
DEBUG=false
ENVIRONMENT=production
```

3. **Setup Database**:
- Install PostgreSQL/TimescaleDB
- Run `scripts/init-db.sh`
- Update DATABASE_URL in `.env.production`

4. **Process Manager**:
```powershell
# Use gunicorn (Linux) or Windows Service
pip install gunicorn
gunicorn src.api.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

5. **Reverse Proxy**:
- Setup Nginx/Apache
- Configure SSL certificates
- Enable HTTPS

6. **Monitoring**:
- Setup logging (Sentry, CloudWatch)
- Add health checks
- Configure alerts

7. **Docker Deployment**:
```powershell
# Build image
docker build -t minewise-ml-api .

# Run container
docker run -p 8000:8000 minewise-ml-api
```

---

## 📚 Additional Resources

### Documentation

- **API Deployment**: `docs/API_DEPLOYMENT_GUIDE.md`
- **Frontend Integration**: `docs/FRONTEND_INTEGRATION_GUIDE.md`
- **LLM Implementation**: `docs/LLM_DATA_COLLECTION_IMPLEMENTATION.md`
- **JSON Examples**: `contoh_API_JSON/README_OUTPUT_FILES.md`

### Testing

- **Comprehensive Tests**: `tests/test_real_api_json_validation.py`
- **LLM Tests**: `tests/test_llm_data_collection.py`
- **Test Results**: `contoh_API_JSON/api_test_results_*.json`

### Code Reference

- **Main API**: `src/api/main.py` (967 lines)
- **Frontend Endpoints**: `src/api/frontend_endpoints.py` (1031 lines)
- **ML Predictions**: `src/ml/predictions.py` (270+ lines)
- **Context Builder**: `src/ai/context_builder.py` (532 lines)

---

## ✅ Deployment Checklist

### Pre-deployment:

- [ ] Python 3.9+ installed
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] All 7 ML models present in `models/` directory
- [ ] Environment variables configured (`.env` file)
- [ ] Port 8000 available

### Deployment:

- [ ] API server started (`python run_api.py`)
- [ ] Health check passes (`/health` returns 200)
- [ ] All 7 models loaded successfully
- [ ] API documentation accessible (`/docs`)

### Post-deployment:

- [ ] All 13 endpoints tested
- [ ] Response times acceptable (<5s)
- [ ] JSON outputs validated
- [ ] Frontend integration tested
- [ ] Error handling verified
- [ ] Logs reviewed

### Production-ready:

- [ ] Database connected (optional)
- [ ] CORS configured for specific origins
- [ ] Debug mode disabled
- [ ] HTTPS enabled
- [ ] Authentication implemented
- [ ] Monitoring setup
- [ ] Backup strategy defined

---

## 🆘 Support & Contact

### Issues & Bug Reports

- **GitHub Issues**: https://github.com/Akmalalfatah/minewise/issues
- **ML Team**: ml-team@minewise.com

### Documentation

- **This Guide**: `docs/LOCAL_DEPLOYMENT_GUIDE.md`
- **API Reference**: http://localhost:8000/docs (when running)

### Community

- **Project Wiki**: https://github.com/Akmalalfatah/minewise/wiki
- **Discussions**: https://github.com/Akmalalfatah/minewise/discussions

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 11, 2025 | Initial release with 13 endpoints |
| | | - 7 ML model predictions |
| | | - 6 Frontend integration APIs |
| | | - 100% test coverage |
| | | - Complete documentation |

---

## 📄 License

Copyright © 2025 MineWise ML Team. All rights reserved.

---

**Status**: ✅ Production Ready  
**Last Updated**: December 11, 2025  
**Maintained By**: Saidil Mifdal, Farhan Hanif Azhary, Daffa Prawira
