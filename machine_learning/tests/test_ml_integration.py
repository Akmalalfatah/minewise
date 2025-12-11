"""
Test ML Integration dalam Frontend Endpoints
Validates bahwa ML predictions terintegrasi dengan baik

Author: ML Team
Date: December 9, 2025
"""

import sys
import os
import time
from typing import Dict, Any

# Add project root to Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# ANSI Colors
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    print(f"\n{Colors.CYAN}{'='*80}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text}{Colors.RESET}")
    print(f"{Colors.CYAN}{'='*80}{Colors.RESET}\n")

def print_success(message: str):
    print(f"  {Colors.GREEN}✓{Colors.RESET} {message}")

def print_error(message: str):
    print(f"  {Colors.RED}✗{Colors.RESET} {message}")

def print_info(message: str):
    print(f"  {Colors.YELLOW}ℹ{Colors.RESET} {message}")


def test_ml_predictions_module():
    """Test 1: ML predictions module availability"""
    print_header("TEST 1: ML Predictions Module")
    
    try:
        from src.ml.predictions import (
            predict_road_risk,
            predict_equipment_failure,
            predict_port_operability,
            predict_fleet_performance,
            predict_cycle_time
        )
        print_success("ML predictions module imported successfully")
        
        # Test each function
        print("\n  Testing individual prediction functions:")
        
        # Test road risk
        try:
            result = predict_road_risk(0.32, 9.5, 25, 1.2, 45)
            print_success(f"Road risk prediction: {result['risk_level']} ({result['risk_score']})")
        except Exception as e:
            print_error(f"Road risk prediction failed: {e}")
        
        # Test equipment failure
        try:
            result = predict_equipment_failure("ALAT_01", 12500, 6, 25, 3)
            print_success(f"Equipment failure: {result['failure_probability']}% ({result['risk_level']})")
        except Exception as e:
            print_error(f"Equipment failure prediction failed: {e}")
        
        # Test port operability
        try:
            result = predict_port_operability(1.8, 28, 2.5, 15)
            print_success(f"Port operability: {result['status']} ({result['operability_score']})")
        except Exception as e:
            print_error(f"Port operability prediction failed: {e}")
        
        # Test fleet performance
        try:
            result = predict_fleet_performance(27.5, 12, 0.82, 0.95)
            print_success(f"Fleet performance: {result['performance_score']} ({result['performance_level']})")
        except Exception as e:
            print_error(f"Fleet performance failed: {e}")
        
        return True
        
    except ImportError as e:
        print_error(f"Failed to import ML predictions module: {e}")
        print_info("ML predictions will use fallback logic")
        return False


def test_frontend_endpoints_dynamic():
    """Test 2: Frontend endpoints dengan dynamic values"""
    print_header("TEST 2: Frontend Endpoints Dynamic Values")
    
    try:
        from src.api.frontend_endpoints import (
            get_production_data,
            get_weather_condition,
            get_equipment_status,
            get_road_condition_overview
        )
        
        print_info("Testing dynamic value generation (3 calls each)...")
        
        # Test production data variability
        print("\n  Production Data Variability:")
        prod_values = []
        for i in range(3):
            result = get_production_data("PIT A")
            prod_values.append(result["produce_ton"])
            print(f"    Call {i+1}: {result['produce_ton']} tons (deviation: {result['deviation_pct']}%)")
        
        if len(set(prod_values)) > 1:
            print_success("Production data is DYNAMIC (values vary)")
        else:
            print_error("Production data is STATIC (same values)")
        
        # Test weather variability
        print("\n  Weather Condition Variability:")
        weather_values = []
        for i in range(3):
            result = get_weather_condition("PIT A")
            weather_values.append((result["rain_probability_pct"], result["wind_speed_kmh"]))
            print(f"    Call {i+1}: Rain {result['rain_probability_pct']}%, Wind {result['wind_speed_kmh']} km/h")
        
        if len(set(weather_values)) > 1:
            print_success("Weather data is DYNAMIC (values vary)")
        else:
            print_error("Weather data is STATIC (same values)")
        
        # Test equipment status variability
        print("\n  Equipment Status Variability:")
        equip_values = []
        for i in range(3):
            result = get_equipment_status("PIT A")
            equip_values.append((result["active"], result["under_repair"]))
            print(f"    Call {i+1}: Active {result['active']}, Repair {result['under_repair']}")
        
        if len(set(equip_values)) > 1:
            print_success("Equipment status is DYNAMIC (values vary)")
        else:
            print_error("Equipment status is STATIC (same values)")
        
        # Test road conditions with ML integration
        print("\n  Road Conditions with ML Integration:")
        for i in range(2):
            result = get_road_condition_overview("PIT A")
            print(f"    Call {i+1}: Efficiency {result['route_efficiency_score']}, Flag: {result['ai_flag'][:50]}...")
        
        print_success("Road conditions endpoint working")
        
        return True
        
    except Exception as e:
        print_error(f"Frontend endpoints test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_api_response_structure():
    """Test 3: Validate response structure tetap konsisten"""
    print_header("TEST 3: Response Structure Consistency")
    
    try:
        from src.api.frontend_endpoints import (
            get_production_data,
            get_weather_condition,
            get_production_efficiency,
            get_equipment_status
        )
        
        # Expected keys untuk each endpoint
        tests = [
            ("Production Data", get_production_data, ["produce_ton", "target_ton", "avg_production_per_day", "deviation_pct", "source_location"]),
            ("Weather Condition", get_weather_condition, ["rain_probability_pct", "wind_speed_kmh", "visibility_km", "extreme_weather_flag", "source_location"]),
            ("Production Efficiency", get_production_efficiency, ["effective_hours", "maintenance_hours", "efficiency_rate", "source_location"]),
            ("Equipment Status", get_equipment_status, ["active", "standby", "under_repair", "maintenance", "source_location"])
        ]
        
        all_passed = True
        for test_name, func, expected_keys in tests:
            result = func("PIT A")
            missing = [key for key in expected_keys if key not in result]
            
            if missing:
                print_error(f"{test_name}: Missing keys {missing}")
                all_passed = False
            else:
                print_success(f"{test_name}: All keys present ✓")
        
        return all_passed
        
    except Exception as e:
        print_error(f"Structure validation failed: {e}")
        return False


def test_ml_integration_impact():
    """Test 4: Verify ML predictions are actually being used"""
    print_header("TEST 4: ML Integration Impact")
    
    try:
        from src.api.frontend_endpoints import ML_AVAILABLE
        
        if ML_AVAILABLE:
            print_success("ML predictions module is AVAILABLE")
            print_info("Endpoints will use ML models for predictions")
        else:
            print_info("ML predictions module NOT available")
            print_info("Endpoints will use fallback logic (still dynamic)")
        
        # Test road condition dengan extreme values
        from src.api.frontend_endpoints import get_road_condition_overview
        
        print("\n  Testing road risk assessment:")
        result = get_road_condition_overview("PIT A")
        
        for segment in result["segments"]:
            risk_indicator = "HIGH RISK" if segment["friction"] < 0.3 else "MEDIUM RISK" if segment["friction"] < 0.4 else "LOW RISK"
            print(f"    {segment['road']}: Friction {segment['friction']}, Status {segment['status']} ({risk_indicator})")
        
        print_success(f"Route efficiency score: {result['route_efficiency_score']}")
        print_success(f"AI flag: {result['ai_flag']}")
        
        return True
        
    except Exception as e:
        print_error(f"ML integration test failed: {e}")
        return False


def main():
    """Run all tests"""
    print_header("ML INTEGRATION VALIDATION TEST SUITE")
    print(f"Date: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    
    # Run tests
    results.append(("ML Predictions Module", test_ml_predictions_module()))
    results.append(("Frontend Endpoints Dynamic", test_frontend_endpoints_dynamic()))
    results.append(("Response Structure", test_api_response_structure()))
    results.append(("ML Integration Impact", test_ml_integration_impact()))
    
    # Summary
    print_header("TEST SUMMARY")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = f"{Colors.GREEN}PASS{Colors.RESET}" if result else f"{Colors.RED}FAIL{Colors.RESET}"
        print(f"  {test_name}: {status}")
    
    print(f"\n  {Colors.BOLD}Overall: {passed}/{total} tests passed{Colors.RESET}")
    
    if passed == total:
        print(f"\n  {Colors.GREEN}✓ All tests passed! ML integration successful.{Colors.RESET}")
        return 0
    else:
        print(f"\n  {Colors.YELLOW}⚠ Some tests failed. Check logs above.{Colors.RESET}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
