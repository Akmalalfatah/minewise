"""
Start Mining Value Chain Optimization API Server

This script starts the FastAPI server for all ML models.
Run this before testing the API.

Author: ML Team
Date: December 5, 2025
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

if __name__ == "__main__":
    import uvicorn
    from src.api.main import app
    
    print("\n" + "="*80)
    print("  MINING VALUE CHAIN OPTIMIZATION - API SERVER")
    print("="*80)
    print("\n  Starting FastAPI server...")
    print("  API Documentation: http://localhost:8000/docs")
    print("  ReDoc: http://localhost:8000/redoc")
    print("  Health Check: http://localhost:8000/health")
    print("\n  Press CTRL+C to stop the server")
    print("="*80 + "\n")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        reload=False,  # Disable reload for production
        log_level="info"
    )
