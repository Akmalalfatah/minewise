# Batch Endpoint Testing Guide

## ✅ Batch Endpoint Fix Applied

**Changes Made:**
1. ✅ Fixed Unicode encoding errors (UTF-8 handler + ASCII fallback)
2. ✅ Added `performance_degradation` and `fleet_risk` to batch endpoint
3. ✅ Added feature completion logic for missing features
4. ✅ Added detailed logging for debugging

## 🚀 How to Run Tests

### **IMPORTANT: Use 2 Separate Terminals**

#### Terminal 1: Start API Server
```powershell
# Kill any existing Python processes
Get-Process -Name python -ErrorAction SilentlyContinue | Stop-Process -Force

# Start server with auto-reload
uvicorn src.api.main:app --host 127.0.0.1 --port 8000 --reload
```

**Wait for:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

#### Terminal 2: Run Tests
```powershell
python tests/test_api_complete.py
```

## 📊 Expected Test Results

### Individual Endpoints (5 models)
```
[1/7] Road Speed                    ✓ PASS
[2/7] Cycle Time                    ✓ PASS
[3/7] Road Risk                     ✓ PASS
[4/7] Equipment Failure             ✓ PASS
[5/7] Port Operability              ✓ PASS
```

### Batch Endpoint (2 models)
```
[6/7] Performance Degradation + Fleet Risk (Batch)
  ✓ Batch response received
  
  Analyzed 3 equipment in fleet context
  
  Equipment #1
    • Performance Degradation: 0.45 (moderate)
    • Fleet Risk: 0.62 (moderate)
  
  Equipment #2
    • Performance Degradation: 0.68 (moderate)
    • Fleet Risk: 0.75 (critical)
  
  Equipment #3
    • Performance Degradation: 0.82 (high)
    • Fleet Risk: 0.58 (moderate)
```

### Final Summary
```
================================================================================
*** ALL 5 INDIVIDUAL ENDPOINTS PASSED!
[OK] Performance Degradation & Fleet Risk available via batch endpoints
[OK] API FULLY OPERATIONAL - ALL 7 MODELS WORKING
================================================================================
```

## 🔍 What Was Fixed

### Problem 1: Unicode Encoding Error
**Error:** `UnicodeEncodeError: 'charmap' codec can't encode character '\u2713'`

**Solution:** 
```python
# Added UTF-8 handler for Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    USE_UNICODE = False  # Fallback to ASCII
```

### Problem 2: Batch Endpoint Missing Models
**Error:** Response returned `{"performance_degradation": null, "fleet_risk": null}`

**Solution:** Added model handling in `batch_predict_fleet`:
```python
# Performance Degradation
if 'performance_degradation' in req:
    perf_features = pd.DataFrame([req['performance_degradation']])
    perf_features = registry._complete_missing_features('performance_degradation', perf_features)
    pred = registry.models['performance_degradation'].predict(perf_features)[0]
    result['performance_degradation'] = {
        "degradation_score": float(pred),
        "status": "high" if float(pred) > 0.7 else "moderate" if float(pred) > 0.4 else "low"
    }

# Fleet Risk
if 'fleet_risk' in req:
    fleet_features = pd.DataFrame([req['fleet_risk']])
    fleet_features = registry._complete_missing_features('fleet_risk', fleet_features)
    pred = registry.models['fleet_risk'].predict(fleet_features)[0]
    result['fleet_risk'] = {
        "risk_score": float(pred),
        "risk_level": "critical" if float(pred) > 0.7 else "moderate" if float(pred) > 0.4 else "low"
    }
```

### Problem 3: Feature Mismatch
**Error:** `feature_names mismatch: expected 26 features, got 5`

**Solution:** Use `_complete_missing_features()` to fill missing features with sensible defaults based on available data and feature naming patterns.

## 📝 Notes

- **Feature Completion:** Models trained with 26-27 engineered features, but API accepts minimal input (4-5 features) and auto-completes the rest
- **Batch Benefits:** Fleet-wide analysis allows comparative scoring and risk assessment across multiple equipment
- **Logging:** Detailed logs show feature completion progress: `Completing X missing features for model_name`

## 🎯 API Endpoints Summary

| Endpoint | Method | Models | Type |
|----------|--------|--------|------|
| `/predict/road-speed` | POST | Road Speed | Individual |
| `/predict/cycle-time` | POST | Cycle Time | Individual |
| `/predict/road-risk` | POST | Road Risk | Individual |
| `/predict/equipment-failure` | POST | Equipment Failure | Individual |
| `/predict/port-operability` | POST | Port Operability | Individual |
| `/predict/batch/fleet` | POST | Performance Degradation + Fleet Risk | Batch |

**Total:** 7 ML Models, 6 Endpoints (5 individual + 1 batch)
