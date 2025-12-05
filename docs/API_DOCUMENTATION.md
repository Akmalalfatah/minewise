# MineWise ML API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:8000`  
**Interactive Docs:** `http://localhost:8000/api/docs`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Dashboard](#dashboard)
   - [Mine Planner](#mine-planner)
   - [Shipping Planner](#shipping-planner)
   - [Chatbox](#chatbox)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)

---

## Overview

MineWise ML API provides real-time analytics and AI-powered insights for mining value chain optimization. The API integrates 5 machine learning models trained on operational data to deliver:

- **Production monitoring**: Real-time achievement tracking
- **Weather risk assessment**: Environmental impact analysis
- **Equipment health prediction**: Failure probability scoring
- **Road condition monitoring**: Speed + safety recommendations
- **Port congestion management**: Vessel scheduling optimization

### Technology Stack

- **Framework**: FastAPI 0.123.4
- **Database**: DuckDB (mining_datawarehouse.duckdb)
- **ML Models**: 5 optimized models (XGBoost, LightGBM, Random Forest)
- **Python**: 3.10.0

---

## Authentication

**Current Version:** No authentication (development mode)

**Production Recommendations:**
- Implement JWT bearer tokens
- Add API key authentication for service-to-service calls
- Enable OAuth2 for user authentication

---

## Endpoints

### Dashboard

Real-time operational metrics across 5 key areas.

#### Get Dashboard Cards

```http
GET /api/dashboard/cards
```

**Response Example:**

```json
{
  "production": {
    "actual_production_ton": 125340.5,
    "target_production_ton": 130000.0,
    "achievement_percentage": 96.42,
    "status": "ON_TARGET",
    "dataset_reference": "fct_produksi_harian"
  },
  "weather": {
    "rainfall_mm": 12.5,
    "temperature_celsius": 28.3,
    "wind_speed_kmh": 18.2,
    "weather_risk_score": 42.7,
    "risk_level": "MODERATE",
    "dataset_reference": "dim_cuaca_harian"
  },
  "efficiency": {
    "average_utilization_pct": 87.5,
    "average_fuel_consumption": 145.8,
    "efficiency_score": 76.3,
    "dataset_reference": "fct_operasional_alat"
  },
  "equipment": {
    "operational_count": 48,
    "maintenance_count": 5,
    "idle_count": 7,
    "total_count": 60,
    "dataset_reference": "dim_alat_berat"
  },
  "vessels": {
    "vessels_loading": 2,
    "vessels_waiting": 1,
    "vessels_completed": 5,
    "total_tonnage_planned": 85000.0,
    "dataset_reference": "fct_pemuatan_kapal"
  },
  "timestamp": "2025-12-03T02:45:30.123456"
}
```

**Status Codes:**
- `200`: Success
- `500`: Internal server error (database connection failure)

#### Health Check

```http
GET /api/dashboard/health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

### Mine Planner

Production planning with weather risk, road conditions, and equipment health.

#### Get Complete Mine Planner Data

```http
GET /api/mine-planner/
```

**Response:** Combined data from all 3 endpoints below.

#### Get Weather Risk Score

```http
GET /api/mine-planner/environment
```

**Response Example:**

```json
{
  "risk_score": 45.2,
  "risk_level": "MODERATE",
  "impact_factors": [
    "Heavy rainfall reducing visibility and road grip",
    "Strong winds affecting equipment stability"
  ],
  "recommended_actions": [
    "Reduce speed limits by 15-20%",
    "Increase monitoring frequency"
  ],
  "dataset_reference": "dim_cuaca_harian"
}
```

**Risk Levels:**
- `LOW` (<25): Normal operations
- `MODERATE` (25-60): Increased caution
- `HIGH` (60-85): Reduced operations
- `CRITICAL` (>85): Stop operations

#### Get Road Segments

```http
GET /api/mine-planner/road-segments
```

**Response Example:**

```json
[
  {
    "segment_id": "M001",
    "length_km": 2.5,
    "condition": "BAIK",
    "predicted_speed_kmh": 45.3,
    "recommended_speed_kmh": 50.0,
    "risk_score": 15.2,
    "risk_level": "LOW",
    "recommended_actions": ["Normal operations"],
    "dataset_reference": "dim_infrastruktur_jalan + predictions"
  },
  {
    "segment_id": "M005",
    "length_km": 1.8,
    "condition": "TERBATAS",
    "predicted_speed_kmh": 18.5,
    "recommended_speed_kmh": 20.0,
    "risk_score": 85.0,
    "risk_level": "HIGH",
    "recommended_actions": ["Segment M005 requires immediate maintenance"],
    "dataset_reference": "dim_infrastruktur_jalan + predictions"
  }
]
```

**Road Conditions:**
- `BAIK`: Good condition
- `WASPADA`: Caution required
- `TERBATAS`: Restricted/critical

#### Get Equipment Status

```http
GET /api/mine-planner/equipment
```

**Response Example:**

```json
[
  {
    "equipment_id": "EXC-001",
    "equipment_type": "Excavator",
    "model": "CAT 390F",
    "health_score": 85.3,
    "failure_probability": 0.05,
    "risk_level": "LOW",
    "next_maintenance_hours": 720,
    "recommended_actions": ["Continue normal operations"],
    "dataset_reference": "dim_alat_berat + predictions"
  },
  {
    "equipment_id": "DMP-015",
    "equipment_type": "Dump Truck",
    "model": "Hitachi EH3500",
    "health_score": 42.1,
    "failure_probability": 0.38,
    "risk_level": "HIGH",
    "next_maintenance_hours": 72,
    "recommended_actions": ["Schedule maintenance within 3 days"],
    "dataset_reference": "dim_alat_berat + predictions"
  }
]
```

---

### Shipping Planner

Port operations planning with loading progress and congestion analysis.

#### Get Complete Shipping Planner Data

```http
GET /api/shipping-planner/
```

**Response:** Combined data from all 4 endpoints below.

#### Get Loading Progress

```http
GET /api/shipping-planner/loading-progress
```

**Response Example:**

```json
[
  {
    "vessel_id": "V-2024-001",
    "planned_tonnage": 50000.0,
    "actual_tonnage": 32500.0,
    "progress_percentage": 65.0,
    "loading_rate_tph": 2500,
    "estimated_completion": "2025-12-03T15:00:00",
    "status": "Loading",
    "dataset_reference": "fct_pemuatan_kapal"
  }
]
```

#### Get Port Congestion

```http
GET /api/shipping-planner/congestion
```

**Response Example:**

```json
{
  "congestion_level": "MODERATE",
  "vessels_loading": 2,
  "vessels_waiting": 3,
  "berth_utilization_pct": 50.0,
  "estimated_wait_hours": 6.0,
  "demurrage_risk_usd": 11250.0,
  "recommendations": [
    "Increase loading crew shifts",
    "Optimize loading sequences"
  ],
  "dataset_reference": "fct_pemuatan_kapal + calculations"
}
```

**Congestion Levels:**
- `LOW`: Berth utilization <50%
- `MODERATE`: 50-75%
- `HIGH`: 75-100%
- `CRITICAL`: >100% (queue overflow)

**Demurrage Cost:** USD $15,000 per vessel per day

#### Get Port Weather

```http
GET /api/shipping-planner/weather
```

**Response Example:**

```json
{
  "wave_height_m": 1.2,
  "wind_speed_kmh": 22.5,
  "visibility_m": 8000,
  "rainfall_mm": 5.2,
  "operability": "NORMAL",
  "operability_score": 95.0,
  "risk_level": "LOW",
  "impact_factors": ["Favorable weather conditions"],
  "dataset_reference": "dim_cuaca_harian + predictions"
}
```

**Port Operability:**
- `NORMAL`: All operations safe
- `CAUTIOUS`: Minor restrictions
- `LIMITED`: Significant restrictions
- `CLOSED`: Port closed

#### Get Shipping Recommendations

```http
GET /api/shipping-planner/recommendations
```

**Response Example:**

```json
[
  {
    "priority": 1,
    "category": "Timing Optimization",
    "title": "Optimal loading window identified",
    "description": "Current conditions favorable: NORMAL weather with MODERATE congestion",
    "expected_benefit": "Minimize demurrage costs and maximize throughput",
    "confidence_score": 0.92,
    "analysis_sources": ["weather_model", "congestion_analysis"]
  }
]
```

---

### Chatbox

Natural language query interface with AI explanations.

#### Process Query

```http
POST /api/chatbox/query
```

**Request Body:**

```json
{
  "user_query": "What is our production achievement this week?"
}
```

**Response Example:**

```json
{
  "ai_answer": "\nProduction Performance (Last 7 Days):\n- Actual Production: 125,340 tons\n- Target Production: 130,000 tons\n- Achievement: 96.42%\n- Status: GOOD\n\nRecommendation: Production slightly below target. Consider minor optimizations.",
  "reasoning_chain": [
    {
      "step_number": 1,
      "step_name": "Query Understanding",
      "description": "Classified query intent as 'production' based on keywords",
      "data_used": {
        "query": "What is our production achievement this week?",
        "intent": "production"
      }
    },
    {
      "step_number": 2,
      "step_name": "Data Retrieval",
      "description": "Retrieved production data for last 7 days",
      "data_used": {
        "actual": 125340,
        "target": 130000,
        "days": 7
      }
    },
    {
      "step_number": 3,
      "step_name": "Calculation",
      "description": "Calculated achievement percentage: 96.42%",
      "data_used": {
        "achievement_pct": 96.42
      }
    },
    {
      "step_number": 4,
      "step_name": "Analysis",
      "description": "Determined production status as 'good'",
      "data_used": {
        "status": "good"
      }
    },
    {
      "step_number": 5,
      "step_name": "Response Generation",
      "description": "Generated natural language answer based on analysis",
      "data_used": {
        "answer_length": 234
      }
    }
  ],
  "data_sources": [
    "mining_datawarehouse.duckdb",
    "intent_production"
  ],
  "query_timestamp": "2025-12-03T02:50:15.123456"
}
```

**Supported Query Intents:**
- **Production**: Queries about tonase, output, target achievement
- **Weather**: Queries about cuaca, hujan, angin, suhu
- **Equipment**: Queries about alat, maintenance, breakdown, failure
- **Road**: Queries about jalan, kecepatan, speed, segment
- **Port**: Queries about pelabuhan, kapal, vessel, loading, congestion

---

## Data Models

### Enumerations

#### RiskLevel
```python
"LOW" | "MODERATE" | "HIGH" | "CRITICAL"
```

#### RoadCondition
```python
"BAIK" | "WASPADA" | "TERBATAS"
```

#### CongestionLevel
```python
"LOW" | "MODERATE" | "HIGH" | "CRITICAL"
```

#### PortOperability
```python
"NORMAL" | "CAUTIOUS" | "LIMITED" | "CLOSED"
```

#### StatusCategory
```python
"ON_TARGET" | "BELOW_TARGET" | "CRITICAL"
```

---

## Error Handling

### Standard Error Response

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Status Codes

- **200**: Success
- **400**: Bad Request (invalid input)
- **404**: Not Found (no data available)
- **422**: Validation Error (schema mismatch)
- **500**: Internal Server Error (database/model error)

### Error Examples

#### Database Connection Failure

```json
{
  "detail": "Database not found: data/warehouse/mining_datawarehouse.duckdb"
}
```

#### Missing Data

```json
{
  "detail": "No weather data available"
}
```

#### Query Processing Error

```json
{
  "detail": "Query processing error: cannot import name 'something'"
}
```

---

## Rate Limiting

**Current Version:** No rate limiting (development mode)

**Production Recommendations:**
- 100 requests per minute per IP
- 1000 requests per hour per API key
- Burst allowance: 20 requests

---

## Changelog

### Version 1.0.0 (2025-12-03)

**Added:**
- Dashboard endpoint with 5 operational cards
- Mine Planner endpoints (3 endpoints)
- Shipping Planner endpoints (4 endpoints)
- Chatbox natural language interface
- Interactive API documentation (/api/docs)
- Health check endpoints

**Models Integrated:**
- Road Speed Prediction (RMSE 0.30 km/h)
- Cycle Time Prediction (RMSE 0.28 min)
- Road Risk Classification (Accuracy 77.3%)
- Equipment Failure Prediction (Recall 100%)
- Port Operability Classification (Accuracy 99.64%)

---

## Contact & Support

**Development Team:** Capstone Project - Mining Value Chain Optimization  
**API Docs:** http://localhost:8000/api/docs  
**ReDoc:** http://localhost:8000/api/redoc

**Model Repository:** `models/` directory  
**Database:** `data/warehouse/mining_datawarehouse.duckdb`
