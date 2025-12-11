# 🚀 MineWise Integration Guide - Full Stack Setup

## 📋 Struktur Proyek Terintegrasi

```
minewise_ml/
├── src/                    # 🎨 FRONTEND (React + Vite)
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── store/
│
├── backend/                # 🔧 BACKEND (Node.js + Express)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── machine_learning/       # 🤖 ML SERVICE (FastAPI + Python)
│   ├── src/
│   │   └── api/main.py
│   ├── models/
│   ├── run_api.py
│   └── requirements.txt
│
├── data_ingestion/         # 📊 DATA LAYER
│   ├── raw/
│   ├── processed/
│   └── pipelines/
│
├── package.json           # Frontend dependencies
└── vite.config.mjs       # Frontend build config
```

---

## ⚙️ Services & Ports

| Service | Technology | Port | URL |
|---------|-----------|------|-----|
| **Frontend** | React + Vite | 5173 | http://localhost:5173 |
| **Backend** | Node.js + Express | 4000 | http://localhost:4000 |
| **ML API** | FastAPI + Python | 8000 | http://localhost:8000 |
| **Database** | MySQL | 3306 | localhost:3306 |

---

## 🔄 Integration Flow

```
┌─────────────┐     HTTP      ┌─────────────┐    HTTP/REST    ┌─────────────┐
│   FRONTEND  │ ──────────────> │   BACKEND   │ ───────────────> │   ML API    │
│  (React)    │  API Calls     │  (Express)  │  ML Predictions  │  (FastAPI)  │
│  Port 5173  │ <────────────  │  Port 4000  │ <─────────────  │  Port 8000  │
└─────────────┘                └─────────────┘                 └─────────────┘
       │                              │                               │
       │                              ▼                               ▼
       │                       ┌─────────────┐              ┌─────────────┐
       │                       │   MySQL DB  │              │   Models    │
       │                       │  Port 3306  │              │   (.pkl)    │
       └──────────────────────>└─────────────┘              └─────────────┘
              State Management
```

---

## 📦 Prerequisites Installation

### 1. Node.js & npm
```powershell
# Check version (harus >=18.0.0)
node --version
npm --version

# Jika belum install, download dari:
# https://nodejs.org/
```

### 2. Python
```powershell
# Check version (harus >=3.10)
python --version

# Jika belum install, download dari:
# https://www.python.org/downloads/
```

### 3. MySQL
```powershell
# Check MySQL service
Get-Service -Name MySQL*

# Jika belum install, download dari:
# https://dev.mysql.com/downloads/installer/
```

---

## 🚀 Step-by-Step Setup & Run

### **Step 1: Setup Frontend (Port 5173)**

```powershell
# Di root directory (minewise_ml)
cd C:\Users\I5\Documents\asah-2025\capstone-project\minewise_ml

# Install dependencies
npm install

# Buat .env file untuk frontend
@"
VITE_API_URL=http://localhost:4000/api
VITE_ML_API_URL=http://localhost:8000
"@ | Out-File -FilePath .env -Encoding utf8

# Run frontend development server
npm run dev

# ✅ Expected Output:
#   VITE v5.x.x ready in xxx ms
#   ➜ Local:   http://localhost:5173/
#   ➜ press h + enter to show help
```

**Biarkan terminal ini tetap berjalan!** Buka terminal baru untuk step berikutnya.

---

### **Step 2: Setup Backend (Port 4000)**

```powershell
# Buka terminal baru, navigasi ke backend
cd C:\Users\I5\Documents\asah-2025\capstone-project\minewise_ml\backend

# Install dependencies
npm install

# Buat .env file untuk backend
@"
PORT=4000
CLIENT_URL=http://localhost:5173
ML_API_URL=http://localhost:8000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=minewise

# JWT Secret
JWT_SECRET=minewise_secret_key_2025

# Google Gemini API (untuk AI chatbox)
GEMINI_API_KEY=your_gemini_api_key_here
"@ | Out-File -FilePath .env -Encoding utf8

# IMPORTANT: Edit .env dengan kredensial MySQL Anda
code .env

# Create database (jika belum ada)
# Buka MySQL Workbench atau CLI:
mysql -u root -p
# Kemudian jalankan:
# CREATE DATABASE minewise CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# USE minewise;
# (Import schema dari backend/database/schema.sql jika ada)

# Run backend server
npm run dev

# ✅ Expected Output:
#   [nodemon] starting `node server.js`
#   MineWise Backend running on port 4000
```

**Biarkan terminal ini tetap berjalan!** Buka terminal baru untuk step berikutnya.

---

### **Step 3: Setup ML API (Port 8000)**

```powershell
# Buka terminal baru, navigasi ke machine_learning
cd C:\Users\I5\Documents\asah-2025\capstone-project\minewise_ml\machine_learning

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Buat .env file untuk ML API
@"
# OpenAI API Key (untuk AI chatbox advanced features)
OPENAI_API_KEY=sk-proj-your-openai-key-here

# Database (optional - untuk data fetching)
DATABASE_URL=mysql://root:your_password@localhost:3306/minewise

# MLflow Tracking
MLFLOW_TRACKING_URI=./mlruns

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False
"@ | Out-File -FilePath .env -Encoding utf8

# IMPORTANT: Edit .env dengan API keys Anda
code .env

# Run ML API server
python run_api.py

# ✅ Expected Output:
#   INFO:     Started server process [xxxx]
#   INFO:     Waiting for application startup.
#   INFO:     Application startup complete.
#   INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Semua services sekarang berjalan!** 🎉

---

## ✅ Verification & Testing

### **Test 1: Health Checks**

```powershell
# Test Backend
Invoke-RestMethod -Uri "http://localhost:4000/api/auth/health" -Method Get

# Test ML API
Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get

# Test Frontend (buka browser)
Start-Process "http://localhost:5173"
```

### **Test 2: Integration Flow**

```powershell
# Test Backend → ML API integration
# Road Speed Prediction via Backend
$body = @{
    weather = "clear"
    road_condition = "good"
    load_tonnage = 80.5
    gradient = 5.2
    vehicle_type = "haul_truck"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:4000/api/mine-planner/predict-road-speed" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### **Test 3: Frontend UI**

1. **Buka Browser**: http://localhost:5173
2. **Login** (jika ada auth):
   - Username: admin
   - Password: admin123
3. **Test Pages**:
   - ✅ Dashboard - KPI metrics & AI summary
   - ✅ Mine Planner - Road conditions & predictions
   - ✅ Shipping Planner - Port operations & vessel status
   - ✅ AI Chatbox - Ask questions about operations
   - ✅ Reports - Generate & download reports

---

## 🔧 Configuration Files

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:4000/api
VITE_ML_API_URL=http://localhost:8000
```

### **Backend (.env)**
```env
PORT=4000
CLIENT_URL=http://localhost:5173
ML_API_URL=http://localhost:8000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=minewise
JWT_SECRET=minewise_secret_key
GEMINI_API_KEY=your_gemini_key
```

### **ML API (.env)**
```env
OPENAI_API_KEY=sk-proj-xxxxx
DATABASE_URL=mysql://root:password@localhost:3306/minewise
API_HOST=0.0.0.0
API_PORT=8000
```

---

## 📊 API Endpoints Reference

### **Backend API (Port 4000)**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/dashboard` | GET | Dashboard KPI data |
| `/api/mine-planner` | GET | Mine planning data |
| `/api/shipping-planner` | GET | Shipping & port data |
| `/api/reports` | GET/POST | Report generation |
| `/api/ai-chat` | POST | AI chatbox endpoint |
| `/api/simulation` | POST | Simulation analysis |

### **ML API (Port 8000)**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/ml/road-speed` | POST | Road speed prediction |
| `/api/ml/cycle-time` | POST | Cycle time prediction |
| `/api/ml/road-risk` | POST | Road risk assessment |
| `/api/ml/equipment-failure` | POST | Equipment failure prediction |
| `/api/ml/port-operability` | POST | Port operability forecast |
| `/api/ml/performance-degradation` | POST | Performance degradation |
| `/api/ml/fleet-risk` | POST | Fleet risk analysis |
| `/api/frontend/dashboard` | GET | Dashboard data aggregation |
| `/api/frontend/chatbox` | POST | AI chatbox with full context |

**Full Documentation**: http://localhost:8000/docs (Swagger UI)

---

## 🐛 Troubleshooting

### **Problem 1: Port Already in Use**

```powershell
# Check what's using the port
Get-NetTCPConnection -LocalPort 5173,4000,8000 | Select-Object LocalPort, State, OwningProcess

# Kill the process
Stop-Process -Id <process_id> -Force

# Or change port in .env files
```

### **Problem 2: MySQL Connection Failed**

```powershell
# Check MySQL service
Get-Service -Name MySQL*

# Start MySQL service
Start-Service MySQL80  # Or your MySQL service name

# Verify connection
mysql -u root -p -e "SHOW DATABASES;"
```

### **Problem 3: Python Module Not Found**

```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall requirements
pip install -r requirements.txt --upgrade

# Check installed packages
pip list
```

### **Problem 4: CORS Error in Frontend**

```javascript
// Backend app.js - verify CORS config:
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
```

### **Problem 5: ML Models Not Found**

```powershell
# Check models directory
ls machine_learning/models/

# Expected files:
# - road_speed_optimized.pkl
# - cycle_time_optimized.pkl
# - road_risk_optimized.pkl
# - equipment_failure_optimized.pkl
# - port_operability_optimized.pkl
# - performance_degradation_optimized.pkl
# - fleet_risk_scoring_optimized.pkl

# If missing, retrain models:
cd machine_learning
python scripts/train_all_models.py
```

---

## 📈 Development Workflow

### **Hot Reload Mode** (Recommended for Development)

All services support hot reload:

1. **Frontend**: Auto-reload on file change (Vite HMR)
2. **Backend**: Auto-restart on file change (nodemon)
3. **ML API**: Manual restart needed (or use `uvicorn --reload`)

```powershell
# ML API with hot reload:
cd machine_learning
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

### **Making Changes**

```powershell
# Frontend changes (src/*)
# → Auto-reload di browser

# Backend changes (backend/src/*)
# → Auto-restart (nodemon)

# ML API changes (machine_learning/src/*)
# → Restart manual: Ctrl+C → python run_api.py
```

---

## 🚢 Production Deployment

### **Option 1: Docker Compose (Recommended)**

```powershell
# Build all services
docker-compose build

# Run all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### **Option 2: Separate Deployment**

- **Frontend**: Deploy to Vercel/Netlify
- **Backend**: Deploy to Railway/Render
- **ML API**: Deploy to Render/Fly.io (see machine_learning/docs/PRODUCTION_HOSTING_ROADMAP.md)

---

## 📚 Additional Resources

- **Frontend Components**: [src/components/](src/components/)
- **Backend Routes**: [backend/src/routes/](backend/src/routes/)
- **ML Models Documentation**: [machine_learning/docs/](machine_learning/docs/)
- **Data Pipeline Guide**: [data_ingestion/README.md](data_ingestion/README.md)
- **API Testing**: [machine_learning/tests/](machine_learning/tests/)

---

## 🎯 Quick Start Commands (TL;DR)

```powershell
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: ML API
cd machine_learning && .\venv\Scripts\Activate.ps1 && python run_api.py
```

**All services running?** ✅  
**Open**: http://localhost:5173 🚀

---

## 📞 Support

**Issues?** Check:
1. All .env files configured correctly
2. MySQL service running
3. All ports (5173, 4000, 8000) available
4. Python virtual environment activated
5. Node modules installed (npm install)

**Still stuck?** 
- Frontend logs: Browser DevTools Console
- Backend logs: Terminal output (nodemon)
- ML API logs: Terminal output (uvicorn)

---

**Last Updated**: December 2025  
**Version**: 1.0.0 (Full Stack Integration)  
**Status**: ✅ Production-Ready
