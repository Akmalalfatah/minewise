"""
Test ML Predictions Responsiveness - FALLBACK MODE
Force fallback logic untuk validate responsiveness tanpa ML endpoints

Author: ML Team
Date: December 9, 2025
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Disable ML endpoint calls untuk test fallback logic
os.environ['ML_API_BASE'] = 'http://invalid-url-to-force-fallback:9999'

from src.ml.predictions import (
    predict_road_risk,
    predict_equipment_failure,
    predict_port_operability
)

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

def print_data(label: str, value):
    print(f"    {label}: {value}")


def test_road_risk_responsiveness():
    """Test road risk responds to different conditions"""
    print_header("TEST 1: ROAD RISK RESPONSIVENESS")
    
    print("Testing with GOOD road conditions:")
    good = predict_road_risk(
        friction=0.70,      # Excellent friction
        water_depth=0.0,    # No water
        wind_speed=8,       # Calm wind
        visibility=6.0,     # Excellent visibility
        rainfall=0          # No rain
    )
    print_data("  Risk Level", good['risk_level'])
    print_data("  Risk Score", good['risk_score'])
    print_data("  Predicted Speed", f"{good['predicted_speed']} km/h")
    print_data("  Source", good['source'])
    
    print("\nTesting with MODERATE road conditions:")
    moderate = predict_road_risk(
        friction=0.45,
        water_depth=4.0,
        wind_speed=18,
        visibility=2.5,
        rainfall=12
    )
    print_data("  Risk Level", moderate['risk_level'])
    print_data("  Risk Score", moderate['risk_score'])
    print_data("  Predicted Speed", f"{moderate['predicted_speed']} km/h")
    
    print("\nTesting with SEVERE road conditions:")
    severe = predict_road_risk(
        friction=0.22,      # Very slippery
        water_depth=15.0,   # Deep water
        wind_speed=40,      # Strong wind
        visibility=0.5,     # Very poor visibility
        rainfall=55         # Heavy rain
    )
    print_data("  Risk Level", severe['risk_level'])
    print_data("  Risk Score", severe['risk_score'])
    print_data("  Predicted Speed", f"{severe['predicted_speed']} km/h")
    
    # Validate progression
    print("\n" + "="*80)
    if severe['risk_score'] > moderate['risk_score'] > good['risk_score']:
        print_success("✓ Road risk correctly escalates with worsening conditions")
        print_data("  Progression", f"{good['risk_score']} → {moderate['risk_score']} → {severe['risk_score']}")
        return True
    else:
        print_error(f"✗ Risk scores don't escalate properly: {good['risk_score']}, {moderate['risk_score']}, {severe['risk_score']}")
        return False


def test_equipment_failure_responsiveness():
    """Test equipment failure responds to usage patterns"""
    print_header("TEST 2: EQUIPMENT FAILURE RESPONSIVENESS")
    
    print("Testing NEW equipment (light usage):")
    new_equip = predict_equipment_failure(
        equipment_id="DUMP_NEW",
        operating_hours=800,       # Low hours
        age_years=1,               # New
        maintenance_count=5,       # Well maintained
        breakdown_count=0          # No breakdowns
    )
    print_data("  Failure Probability", f"{new_equip['failure_probability']}%")
    print_data("  Risk Level", new_equip['risk_level'])
    print_data("  Source", new_equip['source'])
    
    print("\nTesting MODERATE equipment (normal usage):")
    moderate_equip = predict_equipment_failure(
        equipment_id="DUMP_MID",
        operating_hours=8000,      # Moderate hours
        age_years=5,               # Mid-age
        maintenance_count=20,      # Regular maintenance
        breakdown_count=2          # Few breakdowns
    )
    print_data("  Failure Probability", f"{moderate_equip['failure_probability']}%")
    print_data("  Risk Level", moderate_equip['risk_level'])
    
    print("\nTesting OLD equipment (heavy usage):")
    old_equip = predict_equipment_failure(
        equipment_id="DUMP_OLD",
        operating_hours=20000,     # Very high hours
        age_years=12,              # Old
        maintenance_count=15,      # Insufficient maintenance
        breakdown_count=12         # Many breakdowns
    )
    print_data("  Failure Probability", f"{old_equip['failure_probability']}%")
    print_data("  Risk Level", old_equip['risk_level'])
    
    # Validate progression
    print("\n" + "="*80)
    if old_equip['failure_probability'] > moderate_equip['failure_probability'] > new_equip['failure_probability']:
        print_success("✓ Equipment failure correctly increases with age and usage")
        print_data("  Progression", f"{new_equip['failure_probability']}% → {moderate_equip['failure_probability']}% → {old_equip['failure_probability']}%")
        return True
    else:
        print_error(f"✗ Failure probabilities don't escalate properly")
        return False


def test_port_operability_responsiveness():
    """Test port operability responds to weather"""
    print_header("TEST 3: PORT OPERABILITY RESPONSIVENESS")
    
    print("Testing CALM weather conditions:")
    calm = predict_port_operability(
        wave_height=0.5,    # Calm sea
        wind_speed=10,      # Light wind
        visibility=8.0,     # Excellent visibility
        rainfall=0          # No rain
    )
    print_data("  Status", calm['status'])
    print_data("  Operability Score", calm['operability_score'])
    print_data("  Source", calm['source'])
    
    print("\nTesting MODERATE weather conditions:")
    moderate = predict_port_operability(
        wave_height=1.8,
        wind_speed=28,
        visibility=2.5,
        rainfall=15
    )
    print_data("  Status", moderate['status'])
    print_data("  Operability Score", moderate['operability_score'])
    
    print("\nTesting SEVERE weather conditions:")
    severe = predict_port_operability(
        wave_height=4.0,    # High waves
        wind_speed=50,      # Storm
        visibility=0.3,     # Very poor visibility
        rainfall=80         # Heavy rain
    )
    print_data("  Status", severe['status'])
    print_data("  Operability Score", severe['operability_score'])
    
    # Validate progression
    print("\n" + "="*80)
    if calm['operability_score'] > moderate['operability_score'] > severe['operability_score']:
        print_success("✓ Port operability correctly decreases with worsening weather")
        print_data("  Progression", f"{calm['operability_score']} → {moderate['operability_score']} → {severe['operability_score']}")
        return True
    else:
        print_error(f"✗ Operability scores don't decrease properly")
        return False


def main():
    """Run all responsiveness tests"""
    print_header("ML PREDICTIONS RESPONSIVENESS TEST (FALLBACK MODE)")
    print("Testing fallback logic to validate input responsiveness\n")
    
    results = []
    results.append(test_road_risk_responsiveness())
    results.append(test_equipment_failure_responsiveness())
    results.append(test_port_operability_responsiveness())
    
    print_header("FINAL RESULTS")
    
    passed = sum(results)
    total = len(results)
    
    if passed == total:
        print_success(f"All {total}/{total} responsiveness tests PASSED")
        print(f"\n{Colors.GREEN}✓ Predictions correctly adjust to user input{Colors.RESET}")
        print(f"{Colors.GREEN}✓ Fallback logic is production-ready{Colors.RESET}")
        return 0
    else:
        print_error(f"Only {passed}/{total} tests passed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
