"""
ML Models Direct Prediction Test
Tests each of the 7 ML models directly to verify they're loaded and producing predictions

Author: ML Team
Date: December 10, 2025
"""
import sys
from pathlib import Path
import time

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

import requests
import json

BASE_URL = "http://localhost:8000"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    print(f"\n{Colors.CYAN}{'='*80}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text}{Colors.END}")
    print(f"{Colors.CYAN}{'='*80}{Colors.END}\n")

def print_test(model_name: str, passed: bool, detail: str = "", prediction_value=None):
    status = f"{Colors.GREEN}✓ PASS{Colors.END}" if passed else f"{Colors.RED}✗ FAIL{Colors.END}"
    print(f"{status} | {model_name}")
    if prediction_value is not None:
        print(f"  {Colors.BLUE}Prediction: {prediction_value}{Colors.END}")
    if detail:
        color = Colors.YELLOW if not passed else Colors.GREEN
        print(f"  {color}{detail}{Colors.END}")

def test_health_check():
    """Verify API server is running with all models loaded"""
    print_header("STEP 1: Health Check & Model Loading")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        data = response.json()
        
        if response.status_code == 200:
            print_test("API Server Running", True, 
                      f"Status: {data.get('status')}, Models: {data.get('models_loaded', 0)}")
            return data.get('models_loaded', 0) == 7
        else:
            print_test("API Server Running", False, f"Status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_test("API Server Running", False, "Connection refused. Is server running?")
        return False
    except Exception as e:
        print_test("API Server Running", False, str(e))
        return False

def test_production_efficiency():
    """Test Production Efficiency Model"""
    print_header("MODEL 1: Production Efficiency")
    
    payload = {
        "weather_condition": "cerah",
        "rain_intensity_mm": 5.0,
        "equipment_availability": 85.0,
        "operational_hours": 20.0
    }
    
    try:
        start = time.time()
        response = requests.post(f"{BASE_URL}/predict/production-efficiency", 
                                json=payload, timeout=10)
        elapsed = time.time() - start
        
        if response.status_code == 200:
            data = response.json()
            efficiency = data.get("efficiency_percentage")
            
            # Validate output
            is_valid = (
                isinstance(efficiency, (int, float)) and
                0 <= efficiency <= 100
            )
            
            print_test("Production Efficiency Model", is_valid,
                      f"Response time: {elapsed*1000:.0f}ms",
                      f"{efficiency:.2f}%")
            return is_valid
        else:
            print_test("Production Efficiency Model", False, 
                      f"Status {response.status_code}: {response.text[:100]}")
            return False
            
    except Exception as e:
        print_test("Production Efficiency Model", False, str(e))
        return False

def test_equipment_failure():
    """Test Equipment Failure Model"""
    print_header("MODEL 2: Equipment Failure Prediction")
    
    payload = {
        "tipe_alat": "Excavator",
        "umur_tahun": 5.0,
        "jam_operasi": 12000.0,
        "utilization_rate": 75.0,
        "maintenance_status": "Scheduled",
        "last_maintenance_days": 30,
        "operational_hours_since_maintenance": 500.0,
        "failure_history_count": 2
    }
    
    try:
        start = time.time()
        response = requests.post(f"{BASE_URL}/predict/equipment-failure", 
                                json=payload, timeout=10)
        elapsed = time.time() - start
        
        if response.status_code == 200:
            data = response.json()
            probability = data.get("failure_probability")
            risk_level = data.get("risk_level")
            
            # Validate output
            is_valid = (
                isinstance(probability, (int, float)) and
                0 <= probability <= 100 and
                risk_level in ["Low", "Medium", "High", "Critical"]
            )
            
            print_test("Equipment Failure Model", is_valid,
                      f"Response time: {elapsed*1000:.0f}ms, Risk: {risk_level}",
                      f"{probability:.2f}% probability")
            return is_valid
        else:
            print_test("Equipment Failure Model", False, 
                      f"Status {response.status_code}: {response.text[:100]}")
            return False
            
    except Exception as e:
        print_test("Equipment Failure Model", False, str(e))
        return False

def test_port_operability():
    """Test Port Operability Model"""
    print_header("MODEL 3: Port Operability Prediction")
    
    payload = {
        "tinggi_gelombang_m": 1.5,
        "kecepatan_angin_kmh": 25.0,
        "arah_angin": "Timur",
        "visibility_km": 8.0,
        "curah_hujan_mm": 10.0,
        "pasang_surut_m": 0.5,
        "equipment_readiness": 90.0,
        "berth_availability": 2
    }
    
    try:
        start = time.time()
        response = requests.post(f"{BASE_URL}/predict/port-operability", 
                                json=payload, timeout=10)
        elapsed = time.time() - start
        
        if response.status_code == 200:
            data = response.json()
            operability = data.get("operability_percentage")
            status = data.get("status")
            
            # Validate output
            is_valid = (
                isinstance(operability, (int, float)) and
                0 <= operability <= 100 and
                status in ["Operational", "Limited", "Closed"]
            )
            
            print_test("Port Operability Model", is_valid,
                      f"Response time: {elapsed*1000:.0f}ms, Status: {status}",
                      f"{operability:.2f}% operability")
            return is_valid
        else:
            print_test("Port Operability Model", False, 
                      f"Status {response.status_code}: {response.text[:100]}")
            return False
            
    except Exception as e:
        print_test("Port Operability Model", False, str(e))
        return False

def test_cycle_time():
    """Test Cycle Time Prediction Model"""
    print_header("MODEL 4: Cycle Time Prediction")
    
    payload = {
        "jarak_km": 15.0,
        "kondisi_jalan": "Baik",
        "cuaca": "Cerah",
        "jumlah_unit": 5,
        "tipe_material": "Batubara",
        "kapasitas_muatan_ton": 50.0
    }
    
    try:
        start = time.time()
        response = requests.post(f"{BASE_URL}/predict/cycle-time", 
                                json=payload, timeout=10)
        elapsed = time.time() - start
        
        if response.status_code == 200:
            data = response.json()
            cycle_time = data.get("predicted_cycle_time_minutes")
            
            # Validate output
            is_valid = (
                isinstance(cycle_time, (int, float)) and
                cycle_time > 0 and
                cycle_time < 1000  # Reasonable upper bound
            )
            
            print_test("Cycle Time Model", is_valid,
                      f"Response time: {elapsed*1000:.0f}ms",
                      f"{cycle_time:.2f} minutes")
            return is_valid
        else:
            print_test("Cycle Time Model", False, 
                      f"Status {response.status_code}: {response.text[:100]}")
            return False
            
    except Exception as e:
        print_test("Cycle Time Model", False, str(e))
        return False

def test_road_risk():
    """Test Road Risk Assessment Model"""
    print_header("MODEL 5: Road Risk Assessment")
    
    payload = {
        "curah_hujan_mm": 20.0,
        "intensitas_hujan": "Sedang",
        "kecepatan_angin_ms": 8.0,
        "visibility_km": 5.0,
        "kondisi_permukaan": "Basah",
        "traffic_density": "Medium",
        "time_of_day": "Siang"
    }
    
    try:
        start = time.time()
        response = requests.post(f"{BASE_URL}/predict/road-risk", 
                                json=payload, timeout=10)
        elapsed = time.time() - start
        
        if response.status_code == 200:
            data = response.json()
            risk_score = data.get("risk_score")
            risk_category = data.get("risk_category")
            
            # Validate output
            is_valid = (
                isinstance(risk_score, (int, float)) and
                0 <= risk_score <= 100 and
                risk_category in ["Low", "Medium", "High", "Critical"]
            )
            
            print_test("Road Risk Model", is_valid,
                      f"Response time: {elapsed*1000:.0f}ms, Category: {risk_category}",
                      f"{risk_score:.2f} risk score")
            return is_valid
        else:
            print_test("Road Risk Model", False, 
                      f"Status {response.status_code}: {response.text[:100]}")
            return False
            
    except Exception as e:
        print_test("Road Risk Model", False, str(e))
        return False

def test_fleet_performance():
    """Test Fleet Performance Model"""
    print_header("MODEL 6: Fleet Performance Prediction")
    
    payload = {
        "fleet_size": 10,
        "average_age_years": 4.5,
        "fuel_efficiency_lkm": 2.5,
        "maintenance_compliance": 85.0,
        "operational_hours_per_day": 18.0,
        "weather_condition": "Normal"
    }
    
    try:
        start = time.time()
        response = requests.post(f"{BASE_URL}/predict/fleet-performance", 
                                json=payload, timeout=10)
        elapsed = time.time() - start
        
        if response.status_code == 200:
            data = response.json()
            performance = data.get("performance_score")
            
            # Validate output
            is_valid = (
                isinstance(performance, (int, float)) and
                0 <= performance <= 100
            )
            
            print_test("Fleet Performance Model", is_valid,
                      f"Response time: {elapsed*1000:.0f}ms",
                      f"{performance:.2f}% performance")
            return is_valid
        else:
            print_test("Fleet Performance Model", False, 
                      f"Status {response.status_code}: {response.text[:100]}")
            return False
            
    except Exception as e:
        print_test("Fleet Performance Model", False, str(e))
        return False

def test_shipping_delay():
    """Test Shipping Delay Prediction Model"""
    print_header("MODEL 7: Shipping Delay Prediction")
    
    payload = {
        "tinggi_gelombang_m": 2.0,
        "kecepatan_angin_kmh": 30.0,
        "visibility_km": 6.0,
        "curah_hujan_mm": 15.0,
        "vessel_type": "Bulk Carrier",
        "vessel_age_years": 8.0,
        "cargo_weight_ton": 50000.0,
        "port_congestion_level": "Medium"
    }
    
    try:
        start = time.time()
        response = requests.post(f"{BASE_URL}/predict/shipping-delay", 
                                json=payload, timeout=10)
        elapsed = time.time() - start
        
        if response.status_code == 200:
            data = response.json()
            delay_hours = data.get("predicted_delay_hours")
            risk_level = data.get("risk_level")
            
            # Validate output
            is_valid = (
                isinstance(delay_hours, (int, float)) and
                delay_hours >= 0 and
                delay_hours < 500 and  # Reasonable upper bound
                risk_level in ["Low", "Medium", "High", "Critical"]
            )
            
            print_test("Shipping Delay Model", is_valid,
                      f"Response time: {elapsed*1000:.0f}ms, Risk: {risk_level}",
                      f"{delay_hours:.2f} hours delay")
            return is_valid
        else:
            print_test("Shipping Delay Model", False, 
                      f"Status {response.status_code}: {response.text[:100]}")
            return False
            
    except Exception as e:
        print_test("Shipping Delay Model", False, str(e))
        return False

def run_all_tests():
    """Run all ML model tests"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*80}")
    print("ML MODELS DIRECT PREDICTION TEST")
    print(f"{'='*80}{Colors.END}\n")
    
    test_results = {}
    
    # Step 1: Health check
    if not test_health_check():
        print(f"\n{Colors.RED}{Colors.BOLD}✗ API SERVER NOT RUNNING OR MODELS NOT LOADED{Colors.END}")
        print(f"{Colors.YELLOW}Please start the API server: python run_api.py{Colors.END}\n")
        return
    
    # Step 2: Test each model
    test_results["Production Efficiency"] = test_production_efficiency()
    test_results["Equipment Failure"] = test_equipment_failure()
    test_results["Port Operability"] = test_port_operability()
    test_results["Cycle Time"] = test_cycle_time()
    test_results["Road Risk"] = test_road_risk()
    test_results["Fleet Performance"] = test_fleet_performance()
    test_results["Shipping Delay"] = test_shipping_delay()
    
    # Summary
    print_header("TEST SUMMARY")
    
    total = len(test_results)
    passed = sum(test_results.values())
    failed = total - passed
    
    print(f"Total Models Tested: {total}")
    print(f"{Colors.GREEN}Passed: {passed}{Colors.END}")
    print(f"{Colors.RED}Failed: {failed}{Colors.END}")
    print(f"\nSuccess Rate: {(passed/total)*100:.1f}%")
    
    # Detailed results
    print(f"\n{Colors.BOLD}Detailed Results:{Colors.END}")
    for model, result in test_results.items():
        status = f"{Colors.GREEN}✓{Colors.END}" if result else f"{Colors.RED}✗{Colors.END}"
        print(f"  {status} {model}")
    
    if passed == total:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✓ ALL ML MODELS WORKING CORRECTLY!{Colors.END}")
        print(f"{Colors.GREEN}All 7 models are loaded and producing valid predictions.{Colors.END}\n")
    else:
        print(f"\n{Colors.YELLOW}⚠ Some models failed. Review details above.{Colors.END}\n")

if __name__ == "__main__":
    run_all_tests()
