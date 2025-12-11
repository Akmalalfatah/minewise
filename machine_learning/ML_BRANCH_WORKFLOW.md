# ML Branch Workflow Guide

## 📌 Branch Structure

Repository GitHub: `https://github.com/Akmalalfatah/minewise`

### ML Branches (5 Tahapan)

```
ml/data-preparation     → Data collection, cleaning, EDA, feature engineering
ml/model-development    → Model training, hyperparameter tuning, eksperimen
ml/model-evaluation     → Model testing, validation, performance analysis
ml/api-deployment       → FastAPI implementation, endpoint development
ml/production          → Production-ready code, MLflow integration
```

**Note:** Main branch tetap di local sebagai base, **tidak di-push ke remote**.

---

## 🔄 Workflow untuk Setiap Tahapan

### 1️⃣ Data Preparation (`ml/data-preparation`)

**Scope:**
- Data collection dari berbagai sumber (operation logs, weather, equipment)
- Data cleaning dan quality checks
- Exploratory Data Analysis (EDA)
- Feature engineering dan transformations

**Work on this branch:**
```powershell
git checkout ml/data-preparation

# Work on your data preparation tasks
# notebooks/01_data_collection.ipynb
# notebooks/02_eda_analysis.ipynb
# src/data/data_loader.py
# src/data/data_cleaner.py

# Commit changes
git add .
git commit -m "feat: Add data cleaning pipeline for mining operations"

# Push to remote
git push origin ml/data-preparation
```

**Deliverables:**
- Cleaned datasets in `data/processed/`
- EDA notebooks in `notebooks/`
- Data quality reports
- Feature engineering scripts

---

### 2️⃣ Model Development (`ml/model-development`)

**Scope:**
- Model training untuk 7 models:
  - `road_speed` (regression)
  - `cycle_time` (regression)
  - `road_risk` (classification)
  - `equipment_failure` (classification)
  - `port_operability` (classification)
  - `performance_degradation` (regression)
  - `fleet_risk` (regression)
- Hyperparameter tuning
- Eksperimen dengan berbagai algorithms (XGBoost, LightGBM, RandomForest)

**Work on this branch:**
```powershell
git checkout ml/model-development

# Train models
python scripts/train_road_speed_optimized.py
python scripts/train_cycle_time_optimized.py
# ... train other models

# Commit trained models and training logs
git add models/*.pkl
git add mlruns/
git commit -m "feat: Train road_speed model with XGBoost (R²=0.89)"

git push origin ml/model-development
```

**Deliverables:**
- Trained models in `models/` (17 .pkl files)
- Training notebooks
- MLflow experiment logs
- Hyperparameter tuning results

---

### 3️⃣ Model Evaluation (`ml/model-evaluation`)

**Scope:**
- Model testing dan validation
- Performance metrics calculation (RMSE, R², Precision, Recall, F1)
- Cross-validation
- Model comparison dan selection
- SHAP analysis untuk interpretability

**Work on this branch:**
```powershell
git checkout ml/model-evaluation

# Run evaluation
python tests/test_models_direct.py

# Generate SHAP explanations
python scripts/generate_shap_explanations.py

# Commit evaluation reports
git add docs/MODEL_PERFORMANCE_REPORT.md
git add notebooks/model_evaluation.ipynb
git commit -m "feat: Complete model evaluation with SHAP analysis"

git push origin ml/model-evaluation
```

**Deliverables:**
- Model performance reports
- Validation metrics
- SHAP explanations
- Model comparison analysis
- Model cards in `docs/model_cards/`

---

### 4️⃣ API Deployment (`ml/api-deployment`)

**Scope:**
- FastAPI application development
- Individual prediction endpoints (5 endpoints)
- Batch prediction endpoints
- API testing dan documentation
- Request/response validation

**Work on this branch:**
```powershell
git checkout ml/api-deployment

# Develop API endpoints
# Edit src/api/main.py

# Test API
python tests/test_api_complete.py

# Commit API code
git add src/api/
git add tests/test_api_complete.py
git commit -m "feat: Implement batch prediction endpoint for fleet risk"

git push origin ml/api-deployment
```

**Deliverables:**
- `src/api/main.py` (FastAPI application)
- API test scripts
- API documentation (Swagger/ReDoc)
- `API_DOCUMENTATION.md`
- `BATCH_ENDPOINT_TESTING.md`

---

### 5️⃣ Production (`ml/production`)

**Scope:**
- Production-ready code optimization
- MLflow model registry integration
- Deployment scripts
- Docker containerization (if needed)
- CI/CD pipeline setup
- Monitoring dan logging

**Work on this branch:**
```powershell
git checkout ml/production

# Setup production configs
# Edit run_api.py for production settings
# Setup MLflow tracking

# Commit production code
git add run_api.py
git add docker-compose.yml
git commit -m "feat: Add production deployment configuration"

git push origin ml/production
```

**Deliverables:**
- `run_api.py` (production server)
- `requirements.txt` (frozen dependencies)
- Deployment documentation
- MLflow tracking setup
- Production monitoring configs

---

## 🔐 Branch Protection Rules (Recommended)

Setup di GitHub Settings → Branches:

### For all `ml/*` branches:

✅ **Require pull request reviews before merging**
- At least 1 approval required
- Dismiss stale reviews when new commits are pushed

✅ **Require status checks to pass**
- Python tests must pass
- Code linting must pass

✅ **Require conversation resolution before merging**
- All PR comments must be resolved

❌ **Do not allow force pushes**

❌ **Do not allow deletions**

---

## 📋 Pull Request Workflow

### Creating a PR:

1. **Push your branch:**
   ```powershell
   git checkout ml/data-preparation
   git add .
   git commit -m "feat: Complete data cleaning pipeline"
   git push origin ml/data-preparation
   ```

2. **Open PR on GitHub:**
   - Go to: `https://github.com/Akmalalfatah/minewise/pulls`
   - Click "New Pull Request"
   - Base: `main` (or another ML branch if building on top)
   - Compare: `ml/data-preparation`
   - Add description with:
     - What was implemented
     - Key metrics/results
     - Testing performed

3. **Request review from:**
   - Data Engineer (for data-preparation)
   - ML Engineer (for model-development)
   - DevOps/MLOps (for production)

4. **Merge after approval:**
   - Squash and merge (recommended for clean history)
   - Delete branch after merge (if feature complete)

---

## 🚀 Quick Commands Cheat Sheet

```powershell
# Check current branch
git branch

# Switch to ML branch
git checkout ml/data-preparation

# Pull latest changes
git pull origin ml/data-preparation

# Create feature branch from ML branch (optional)
git checkout -b feature/data-quality-checks ml/data-preparation

# Stage and commit
git add .
git commit -m "feat: Add mining operation data loader"

# Push to remote
git push origin ml/data-preparation

# View remote branches
git branch -r

# View all commits
git log --oneline --graph --all
```

---

## 📊 Branch Status Tracking

| Branch | Status | Lead | Last Updated |
|--------|--------|------|--------------|
| `ml/data-preparation` | ✅ Ready | Data Engineer | Dec 6, 2025 |
| `ml/model-development` | ✅ Ready | ML Engineer | Dec 6, 2025 |
| `ml/model-evaluation` | ✅ Ready | ML Engineer | Dec 6, 2025 |
| `ml/api-deployment` | ✅ Ready | ML Engineer | Dec 6, 2025 |
| `ml/production` | ✅ Ready | MLOps Engineer | Dec 6, 2025 |

---

## 📝 Commit Message Conventions

Format: `<type>(<scope>): <description>`

**Types:**
- `feat`: New feature (e.g., `feat(model): Add road_speed prediction`)
- `fix`: Bug fix (e.g., `fix(api): Handle missing features in batch endpoint`)
- `docs`: Documentation (e.g., `docs: Update API testing guide`)
- `refactor`: Code refactoring (e.g., `refactor(data): Simplify feature engineering`)
- `test`: Add tests (e.g., `test: Add unit tests for data loader`)
- `perf`: Performance improvement (e.g., `perf(model): Optimize XGBoost parameters`)

**Examples:**
```bash
git commit -m "feat(data): Add weather data integration"
git commit -m "fix(api): Fix feature mismatch in batch prediction"
git commit -m "docs: Update model evaluation report"
git commit -m "test: Add API endpoint integration tests"
```

---

## 🎯 Next Steps

1. **Setup branch protection rules** di GitHub Settings
2. **Assign team members** ke masing-masing branch
3. **Start working** pada branch sesuai tahapan project
4. **Create PRs** untuk review dan merge
5. **Track progress** menggunakan GitHub Issues/Projects

---

**Repository:** https://github.com/Akmalalfatah/minewise

**ML Branches Created:** December 6, 2025

**Team:** Machine Learning - Mining Value Chain Optimization
