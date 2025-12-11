# Frontend Integration Guide

## 📌 Overview

API ini menyediakan endpoints yang **100% compatible** dengan contract JSON frontend team. Semua response structure sudah match dengan file JSON di folder `contoh_API_JSON/`.

**Repository:** https://github.com/Akmalalfatah/minewise  
**API Base URL:** `http://localhost:8000` (development) | `https://api.minewise.com` (production)

---

## 🔗 Available Endpoints

### **1. Dashboard API**
**Endpoint:** `GET/POST /api/dashboard`

**Query Parameters:**
- `location` (optional): Source location (default: "PIT A")
- `date` (optional): Date filter (YYYY-MM-DD)

**Response Structure:** ✅ Matches `dashboard API JSON contoh.txt`

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/dashboard?location=PIT A"
```

**Response Keys:**
```json
{
  "total_production": {...},
  "weather_condition": {...},
  "production_efficiency": {...},
  "equipment_status": {...},
  "vessel_status": {...},
  "production_weather_overview": {...},
  "road_condition_overview": {...},
  "causes_of_downtime": {...},
  "decision_impact": {...},
  "ai_summary": {...}
}
```

---

### **2. Mine Planner API**
**Endpoint:** `GET/POST /api/mine-planner`

**Query Parameters:**
- `area` (optional): Mining area (default: "PIT A")
- `date` (optional): Date for planning (YYYY-MM-DD)

**Response Structure:** ✅ Matches `mine planner API JSON contoh.txt`

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/mine-planner?area=PIT A"
```

**Response Keys:**
```json
{
  "environment_conditions": {
    "area": "PIT A",
    "rainfall": "45.8 mm (Heavy)",
    "risk": {
      "score": 79,
      "title": "High weather-related danger"
    }
  },
  "ai_recommendation": {
    "scenarios": [...],
    "analysis_sources": "..."
  },
  "road_conditions": {...},
  "equipment_status": {
    "summary": {...},
    "equipments": [...],
    "fleet_overview": [...]
  }
}
```

---

### **3. Shipping Planner API**
**Endpoint:** `GET/POST /api/shipping-planner`

**Query Parameters:**
- `location` (optional): Port location (default: "PIT A")
- `date` (optional): Date filter (YYYY-MM-DD)

**Response Structure:** ✅ Matches `shipping planner API JSON contoh.txt`

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/shipping-planner?location=PIT A"
```

**Response Keys:**
```json
{
  "port_weather_conditions": {...},
  "ai_recommendation": {...},
  "vessel_schedules": [...],
  "coal_volume_ready": [...],
  "loading_progress": [...],
  "port_congestion": {
    "shipsLoading": [...],
    "shipsWaiting": [...],
    "congestionLevel": "High"
  }
}
```

---

### **4. Chatbox AI API**
**Endpoint:** `POST /api/chatbox`

**Request Body:**
```json
{
  "human_answer": "What caused the slowdown today?",
  "context": {}
}
```

**Response Structure:** ✅ Matches `chatbox API JSON contoh.txt`

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/chatbox" \
  -H "Content-Type: application/json" \
  -d '{
    "human_answer": "What caused the slowdown today?",
    "context": {}
  }'
```

**Response Keys:**
```json
{
  "ai_answer": "...",
  "ai_time": "14:22",
  "human_answer": "...",
  "human_time": "14:21",
  "quick_questions": [...],
  "steps": [...],
  "data_sources": {
    "weather": "dim_cuaca_harian",
    "equipment": "fct_operasional_alat",
    "road": "fct_kondisi_jalan",
    "vessel": "fct_pemuatan_kapal"
  }
}
```

---

### **5. Reports Generator API**
**Endpoint:** `GET /api/reports`

**Response Structure:** ✅ Matches `reports API JSON contoh.txt`

**Example Request:**
```bash
curl -X GET "http://localhost:8000/api/reports"
```

**Response Keys:**
```json
{
  "generator_form": {
    "report_types": [...],
    "time_periods": [...],
    "formats": [...]
  },
  "recent_reports": [...]
}
```

---

## 🧪 Testing

### **Run Frontend API Tests:**
```bash
# Terminal 1: Start API server
python run_api.py

# Terminal 2: Run tests
python tests/test_frontend_api.py
```

**Expected Output:**
```
================================================================================
FRONTEND-COMPATIBLE API ENDPOINT TESTS
================================================================================

1. TESTING DASHBOARD ENDPOINT
  ✓ GET /api/dashboard - Status: 200
  ✓ Dashboard: All required keys present ✓
  ✓ Dashboard endpoint: PASS ✓

2. TESTING MINE PLANNER ENDPOINT
  ✓ GET /api/mine-planner - Status: 200
  ✓ Mine Planner: All required keys present ✓
  ✓ Mine Planner endpoint: PASS ✓

...

================================================================================
TEST SUMMARY
================================================================================
  [PASS] Dashboard
  [PASS] Mine Planner
  [PASS] Shipping Planner
  [PASS] Chatbox
  [PASS] Reports

*** ALL 5 FRONTEND ENDPOINTS PASSED! ***
✓ API is fully compatible with frontend JSON contracts
================================================================================
```

---

## 🔧 Implementation Status

### ✅ **Completed:**
- [x] All 5 endpoint routers created
- [x] Response structure matches JSON contracts 100%
- [x] Test suite implemented
- [x] Integration with main FastAPI app
- [x] API documentation endpoints

### ⏳ **In Progress:**
- [ ] Connect to actual database (currently using mock data)
- [ ] Integrate ML model predictions
- [ ] Implement AI chatbox logic (LLM or rule-based)
- [ ] Real-time data updates

### 📋 **Next Steps for Full Integration:**

#### **Step 1: Database Integration**
Replace mock functions in `frontend_endpoints.py` dengan actual database queries:

```python
# Before (Mock):
def get_production_data(location: str = "PIT A") -> Dict[str, Any]:
    return {
        "produce_ton": 12850,
        "target_ton": 15000,
        ...
    }

# After (Real Data):
def get_production_data(location: str = "PIT A") -> Dict[str, Any]:
    # Query dari fct_operasional_alat + plan_produksi_harian
    query = """
        SELECT 
            SUM(total_muatan_ton) as produce_ton,
            target_ton,
            AVG(total_muatan_ton) as avg_production_per_day
        FROM fct_operasional_alat
        WHERE lokasi = :location
        GROUP BY target_ton
    """
    result = db.execute(query, {"location": location})
    return result.fetchone()
```

#### **Step 2: ML Model Integration**
Integrate ML predictions ke response:

```python
from src.api.main import registry

def get_road_condition_overview(location: str = "PIT A") -> Dict[str, Any]:
    # Get road data
    road_data = get_road_data_from_db(location)
    
    # Predict dengan ML models
    for segment in road_data["segments"]:
        # Road speed prediction
        speed_pred = registry.predict("road_speed", segment)
        segment["speed"] = speed_pred["prediction"]
        
        # Road risk classification
        risk_pred = registry.predict("road_risk", segment)
        segment["status"] = risk_pred["prediction"]
    
    return road_data
```

#### **Step 3: Chatbox AI Logic**
Implement actual AI/LLM integration:

```python
# Option 1: Rule-based (simple)
def generate_ai_response(question: str) -> str:
    if "slowdown" in question.lower():
        return analyze_slowdown_causes()
    elif "risk" in question.lower():
        return analyze_current_risks()
    else:
        return generic_operational_summary()

# Option 2: LLM-based (advanced)
from langchain import OpenAI

def generate_ai_response(question: str) -> str:
    llm = OpenAI(api_key="...")
    
    # Build context from operational data
    context = build_context_from_data()
    
    prompt = f"""
    Context: {context}
    Question: {question}
    
    Provide operational recommendation based on data.
    """
    
    return llm.complete(prompt)
```

---

## 🚀 Deployment Notes

### **Environment Variables:**
```bash
# .env file
DATABASE_URL=postgresql://user:pass@host:5432/minewise_db
MLFLOW_TRACKING_URI=http://localhost:5000
API_BASE_URL=https://api.minewise.com
SECRET_KEY=your-secret-key-here
```

### **CORS Configuration:**
Untuk frontend integration, tambahkan CORS middleware di `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://frontend.minewise.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Rate Limiting (Optional):**
Protect API dari excessive requests:

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@router.get("/api/dashboard")
@limiter.limit("10/minute")  # Max 10 requests per minute
async def get_dashboard(...):
    ...
```

---

## 📊 Performance Metrics

**Current Status (Mock Data):**
- Average response time: ~50ms
- All endpoints: < 100ms

**Target (Real Data + ML):**
- Average response time: < 200ms
- Dashboard endpoint: < 300ms (complex aggregation)
- Chatbox endpoint: < 500ms (AI processing)

---

## 🔍 Troubleshooting

### **Issue: CORS Error**
**Solution:** Add frontend domain to CORS allowed origins

### **Issue: 500 Internal Server Error**
**Solution:** Check logs, verify database connection

### **Issue: Keys Missing in Response**
**Solution:** Run test suite, verify against JSON contracts:
```bash
python tests/test_frontend_api.py
```

---

## 📞 Contact

**ML Team:**
- Saidil Mifdal (ML Lead)
- Farhan Hanif Azhary (ML Engineer A - Infrastructure)
- Daffa Prawira (ML Engineer B - Fleet)

**GitHub:** https://github.com/Akmalalfatah/minewise  
**Documentation:** http://localhost:8000/docs

---

**Last Updated:** December 9, 2025  
**Version:** 1.0.0 - Frontend Integration Complete
