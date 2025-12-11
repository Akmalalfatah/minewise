"""
Week 3-4 Notebook Executor
Executes all feature engineering and model training notebooks
"""

import subprocess
import sys
from pathlib import Path
from datetime import datetime

def run_notebook(notebook_path, timeout=1800):
    """Execute a Jupyter notebook using nbconvert"""
    print(f"\n{'='*80}")
    print(f"🚀 Executing: {notebook_path.name}")
    print(f"{'='*80}")
    
    try:
        # Execute notebook
        result = subprocess.run([
            sys.executable, '-m', 'jupyter', 'nbconvert',
            '--to', 'notebook',
            '--execute',
            '--inplace',
            f'--ExecutePreprocessor.timeout={timeout}',
            '--ExecutePreprocessor.kernel_name=python3',
            str(notebook_path)
        ], capture_output=True, text=True, timeout=timeout)
        
        if result.returncode == 0:
            print(f"✅ {notebook_path.name} executed successfully!")
            return True
        else:
            print(f"❌ {notebook_path.name} failed!")
            print(f"Error: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"⏱️ {notebook_path.name} timed out after {timeout} seconds")
        return False
    except Exception as e:
        print(f"❌ Error executing {notebook_path.name}: {e}")
        return False

def main():
    print(f"\n{'='*80}")
    print(f"WEEK 3-4 NOTEBOOK EXECUTION")
    print(f"{'='*80}")
    print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # Define notebooks to execute
    notebooks = [
        # Feature Engineering
        ("notebooks/03_feature_engineering/01_Infrastructure_Features.ipynb", 900),
        ("notebooks/03_feature_engineering/02_Fleet_Features.ipynb", 900),
        
        # Infrastructure Models
        ("notebooks/04_modeling_infra/01_Road_Speed_Regression_v2.ipynb", 900),
        ("notebooks/04_modeling_infra/02_Cycle_Time_Regression_v2.ipynb", 720),
        ("notebooks/04_modeling_infra/03_Road_Risk_Classification_v2.ipynb", 1200),
        
        # Fleet Models
        ("notebooks/05_modeling_fleet/01_Equipment_Failure_Prediction_v2.ipynb", 1200),
        ("notebooks/05_modeling_fleet/02_Port_Operability_Forecast_v2.ipynb", 900),
    ]
    
    results = []
    
    for notebook_rel_path, timeout in notebooks:
        notebook_path = Path(notebook_rel_path)
        
        if not notebook_path.exists():
            print(f"⚠️ Skipping {notebook_path.name} - file not found")
            results.append((notebook_path.name, False))
            continue
        
        success = run_notebook(notebook_path, timeout)
        results.append((notebook_path.name, success))
    
    # Summary
    print(f"\n{'='*80}")
    print(f"EXECUTION SUMMARY")
    print(f"{'='*80}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "✅" if success else "❌"
        print(f"  {status} {name}")
    
    print(f"\n{'='*80}")
    print(f"Total: {passed}/{total} notebooks executed successfully")
    print(f"End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}\n")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
