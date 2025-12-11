# 🚀 Quick Start - Run All Services

## ✅ Status Setup
- [x] Frontend dependencies installed (297 packages)
- [x] Backend dependencies installed (254 packages)
- [x] Environment files created (.env)
- [ ] ML virtual environment (perlu dibuat)
- [ ] Database setup (perlu konfigurasi)

---

## 📝 IMPORTANT: Before Running

### 1. Configure Database
Edit `backend/.env` dan set MySQL password Anda:
```env
DB_PASSWORD=your_mysql_password_here
```

### 2. Configure API Keys (Optional)
Edit `backend/.env` untuk Gemini API (AI chatbox):
```env
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🎯 Run All Services (3 Terminals Required)

### Terminal 1: Frontend (Port 5173)
```powershell
# Di root directory
npm run dev

# ✅ Expected: "Local: http://localhost:5173/"
# ⏱️ Keep this terminal running
```

### Terminal 2: Backend (Port 4000)
```powershell
# Di root directory
cd backend
npm run dev

# ✅ Expected: "MineWise Backend running on port 4000"
# ⏱️ Keep this terminal running
```

### Terminal 3: ML API (Port 8000)
```powershell
# Di root directory
cd machine_learning

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies (first time only)
pip install -r requirements.txt

# Run ML API
python run_api.py

# ✅ Expected: "Uvicorn running on http://0.0.0.0:8000"
# ⏱️ Keep this terminal running
```

---

## 🧪 Test Integration

### Quick Test Commands
```powershell
# Test Backend
Invoke-RestMethod -Uri "http://localhost:4000/api/auth/health"

# Test ML API
Invoke-RestMethod -Uri "http://localhost:8000/health"

# Open Frontend
Start-Process "http://localhost:5173"
```

---

## 📊 Service URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5173 | Must be running |
| Backend | http://localhost:4000 | Must be running |
| ML API | http://localhost:8000 | Must be running |
| ML Docs | http://localhost:8000/docs | Swagger UI |

---

## 🔧 Troubleshooting

### Port Already in Use?
```powershell
# Find process using port
Get-NetTCPConnection -LocalPort 5173 | Select-Object OwningProcess
Get-NetTCPConnection -LocalPort 4000 | Select-Object OwningProcess
Get-NetTCPConnection -LocalPort 8000 | Select-Object OwningProcess

# Kill process
Stop-Process -Id <process_id> -Force
```

### MySQL Not Running?
```powershell
# Check MySQL service
Get-Service -Name MySQL*

# Start MySQL
Start-Service MySQL80
```

### Module Not Found?
```powershell
# Frontend
npm install

# Backend
cd backend && npm install

# ML API
cd machine_learning
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## ✨ Next Steps After All Services Running

1. **Open Browser**: http://localhost:5173
2. **Test Pages**:
   - Dashboard - View KPI metrics
   - Mine Planner - Road predictions
   - Shipping Planner - Port operations
   - AI Chatbox - Ask questions
   - Reports - Generate reports
3. **Check Backend Logs**: Terminal 2
4. **Check ML API Logs**: Terminal 3

---

**Need help?** Check INTEGRATION_GUIDE.md for detailed documentation.

**All green?** 🎉 You're ready to develop!
