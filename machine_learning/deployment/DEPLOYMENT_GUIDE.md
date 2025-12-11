# Deployment Guide - MineWise ML API

**Version:** 1.0.0  
**Last Updated:** December 3, 2025

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Production Deployment](#production-deployment)
5. [Configuration](#configuration)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Python:** 3.10.0 or higher
- **Docker:** 20.10+ (for containerized deployment)
- **Docker Compose:** 2.0+ (for multi-service orchestration)
- **Git:** For version control

### System Requirements

**Minimum:**
- CPU: 4 cores
- RAM: 8 GB
- Storage: 20 GB

**Recommended:**
- CPU: 8 cores
- RAM: 16 GB
- Storage: 50 GB (for logs and model artifacts)

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd minewise_ml
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Verify Installation

```bash
python -c "import fastapi, duckdb, pandas, sklearn; print('All dependencies installed!')"
```

### 5. Prepare Data & Models

Ensure the following structure exists:

```
minewise_ml/
├── data/
│   ├── warehouse/
│   │   └── mining_datawarehouse.duckdb  # Database file
│   ├── feature_store/
│   │   ├── infra_features.parquet
│   │   └── fleet_features.parquet
│   └── raw/                              # Raw data files
├── models/
│   ├── road_speed_optimized.pkl
│   ├── cycle_time_optimized.pkl
│   ├── road_risk_optimized.pkl
│   ├── equipment_failure_optimized.pkl
│   └── port_operability_optimized.pkl
└── logs/                                 # Log files
```

### 6. Run API Server

```bash
# Development mode with auto-reload
uvicorn api.main:app --reload --port 8000

# Production mode with multiple workers
uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 7. Verify Server

Open browser: http://localhost:8000/api/docs

You should see interactive API documentation (Swagger UI).

---

## Docker Deployment

### Quick Start (Development)

```bash
# Build and run API only
docker-compose up --build

# Run in background
docker-compose up -d

# Check logs
docker-compose logs -f api
```

### Full Stack (with MLflow)

```bash
# Build all services
docker-compose up --build

# Services will be available at:
# - API: http://localhost:8000
# - MLflow: http://localhost:5000
```

### With Monitoring (Prometheus + Grafana)

```bash
# Run with monitoring profile
docker-compose --profile monitoring up -d

# Services will be available at:
# - API: http://localhost:8000
# - MLflow: http://localhost:5000
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3000 (admin/admin)
```

### Stop Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## Production Deployment

### 1. Build Production Image

```bash
# Build optimized image
docker build -t minewise_ml_api:1.0.0 .

# Tag for registry
docker tag minewise_ml_api:1.0.0 <registry>/minewise_ml_api:1.0.0

# Push to registry
docker push <registry>/minewise_ml_api:1.0.0
```

### 2. Deploy to Cloud

#### AWS ECS

```bash
# Create task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Create service
aws ecs create-service \
  --cluster minewise-cluster \
  --service-name minewise-api \
  --task-definition minewise-api:1 \
  --desired-count 2 \
  --launch-type FARGATE
```

#### Kubernetes

```bash
# Apply deployment
kubectl apply -f deployment/k8s/deployment.yml

# Apply service
kubectl apply -f deployment/k8s/service.yml

# Check status
kubectl get pods -l app=minewise-api
```

### 3. Configure Load Balancer

```bash
# AWS ALB example
aws elbv2 create-load-balancer \
  --name minewise-lb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx

# Create target group
aws elbv2 create-target-group \
  --name minewise-targets \
  --protocol HTTP \
  --port 8000 \
  --vpc-id vpc-xxx
```

### 4. Setup SSL/TLS

```bash
# Install certbot
apt-get install certbot

# Generate certificate
certbot certonly --standalone -d api.minewise.com

# Configure nginx/ALB with certificate
```

---

## Configuration

### Environment Variables

Create `.env` file in project root:

```bash
# Application
PYTHONUNBUFFERED=1
LOG_LEVEL=info

# Database
DATABASE_PATH=/app/data/warehouse/mining_datawarehouse.duckdb

# Models
MODEL_DIR=/app/models

# API
API_HOST=0.0.0.0
API_PORT=8000
API_WORKERS=4

# Authentication (optional)
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
API_KEY=your-api-key-here

# Monitoring
PROMETHEUS_ENABLED=true
METRICS_PORT=9090

# MLflow
MLFLOW_TRACKING_URI=http://mlflow:5000
```

### Load Environment Variables

```python
# In api/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_path: str = "data/warehouse/mining_datawarehouse.duckdb"
    model_dir: str = "models"
    log_level: str = "info"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# API health
curl http://localhost:8000/health

# Expected response:
# {
#   "status": "healthy",
#   "models_loaded": true,
#   "models_count": 5,
#   "database": "connected"
# }
```

### Logs

```bash
# Docker logs
docker-compose logs -f api

# Local logs (if configured)
tail -f logs/api.log

# Filter by level
grep "ERROR" logs/api.log
```

### Metrics

```bash
# Prometheus metrics endpoint
curl http://localhost:8000/metrics

# Common metrics:
# - http_requests_total
# - http_request_duration_seconds
# - model_prediction_time_seconds
# - active_requests
```

### Database Backup

```bash
# Backup DuckDB database
cp data/warehouse/mining_datawarehouse.duckdb \
   backups/mining_datawarehouse_$(date +%Y%m%d).duckdb

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
cp data/warehouse/mining_datawarehouse.duckdb \
   $BACKUP_DIR/mining_datawarehouse_$DATE.duckdb
```

### Model Updates

```bash
# 1. Train new model
python scripts/train_road_speed_optimized.py

# 2. Backup old model
mv models/road_speed_optimized.pkl \
   models/backups/road_speed_optimized_old.pkl

# 3. Deploy new model
cp reports/optimization/road_speed_optimized.pkl \
   models/road_speed_optimized.pkl

# 4. Restart API (Docker)
docker-compose restart api
```

---

## Troubleshooting

### Common Issues

#### 1. API Won't Start

**Symptom:** `ModuleNotFoundError: No module named 'duckdb'`

**Solution:**
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Or install specific package
pip install duckdb
```

---

#### 2. Database Connection Error

**Symptom:** `Database not found: data/warehouse/mining_datawarehouse.duckdb`

**Solution:**
```bash
# Check if database exists
ls -la data/warehouse/

# If missing, create from raw data
python scripts/create_database.py
```

---

#### 3. Model Loading Error

**Symptom:** `FileNotFoundError: models/road_speed_optimized.pkl not found`

**Solution:**
```bash
# Check models directory
ls -la models/

# If missing, train models
python scripts/train_road_speed_optimized.py
python scripts/train_cycle_time_optimized.py
# ... etc
```

---

#### 4. Memory Error

**Symptom:** `MemoryError: Unable to allocate array`

**Solution:**
```bash
# Reduce Docker memory limit
docker-compose down
docker-compose up -d --memory=4g

# Or reduce Uvicorn workers
uvicorn api.main:app --workers 2
```

---

#### 5. Port Already in Use

**Symptom:** `OSError: [Errno 98] Address already in use`

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000
# or on Windows
netstat -ano | findstr :8000

# Kill process
kill -9 <PID>

# Or use different port
uvicorn api.main:app --port 8001
```

---

### Performance Optimization

#### 1. Enable Response Caching

```python
# In api/main.py
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
```

#### 2. Database Connection Pooling

```python
# In api/routers/dashboard.py
import duckdb
from functools import lru_cache

@lru_cache()
def get_db_connection():
    return duckdb.connect(str(DB_PATH), read_only=True)
```

#### 3. Model Preloading

```python
# In api/main.py
import pickle
from pathlib import Path

@app.on_event("startup")
async def load_models():
    global MODELS
    model_dir = Path("models")
    MODELS = {}
    for model_file in model_dir.glob("*.pkl"):
        with open(model_file, 'rb') as f:
            MODELS[model_file.stem] = pickle.load(f)
```

---

## Security Checklist

- [ ] Enable HTTPS/TLS encryption
- [ ] Implement JWT authentication
- [ ] Add API rate limiting
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable request validation
- [ ] Add input sanitization
- [ ] Setup firewall rules
- [ ] Enable audit logging
- [ ] Regular security updates

---

## Maintenance Schedule

### Daily
- Check API health status
- Review error logs
- Monitor response times

### Weekly
- Backup database
- Review API usage metrics
- Check disk space

### Monthly
- Update dependencies
- Security patches
- Performance review

### Quarterly
- Model retraining
- Load testing
- Disaster recovery drill

---

## Support & Contact

**Development Team:** Capstone Project - Mining Value Chain Optimization  
**Documentation:** `/docs` directory  
**API Docs:** http://localhost:8000/api/docs  
**Issue Tracker:** [GitHub Issues]

---

## Changelog

### Version 1.0.0 (2025-12-03)

**Initial Release:**
- FastAPI application with 4 routers
- 5 ML models integrated
- Docker deployment support
- MLflow tracking
- Health checks
- API documentation

---

**Deployment Guide Complete** ✅
