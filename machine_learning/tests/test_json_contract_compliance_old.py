"""
Complete JSON Contract Compliance Test
Validates ALL endpoints against exact JSON contracts

Author: ML Team
Date: December 9, 2025
"""

import sys
import os
import json
import requests

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# API Base URL
API_BASE = "http://localhost:8000"

# ANSI Colors
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    BLUE = '\033[94m'
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

def print_warning(message: str):
    print(f"  {Colors.YELLOW}⚠{Colors.RESET} {message}")

def print_info(key: str, status: str):
    if "MISSING" in status:
        print(f"    {Colors.RED}{key}: {status}{Colors.RESET}")
    elif "EXTRA" in status:
        print(f"    {Colors.YELLOW}{key}: {status}{Colors.RESET}")
    else:
        print(f"    {Colors.GREEN}{key}: {status}{Colors.RESET}")


def check_keys_recursive(expected: dict, actual: dict, path: str = "") -> tuple:
    """Recursively check if all keys match"""
    missing = []
    extra = []
    
    # Check for missing keys
    for key in expected.keys():
        current_path = f"{path}.{key}" if path else key
        
        if key not in actual:
            missing.append(current_path)
        elif isinstance(expected[key], dict) and isinstance(actual.get(key), dict):
            # Recursive check for nested dicts
            sub_missing, sub_extra = check_keys_recursive(expected[key], actual[key], current_path)
            missing.extend(sub_missing)
            extra.extend(sub_extra)
        elif isinstance(expected[key], list) and isinstance(actual.get(key), list):
            # Check list items if they contain dicts
            if expected[key] and isinstance(expected[key][0], dict):
                if actual[key] and isinstance(actual[key][0], dict):
                    sub_missing, sub_extra = check_keys_recursive(expected[key][0], actual[key][0], f"{current_path}[0]")
                    missing.extend(sub_missing)
                    extra.extend(sub_extra)
    
    # Check for extra keys
    for key in actual.keys():
        current_path = f"{path}.{key}" if path else key
        if key not in expected:
            extra.append(current_path)
    
    return missing, extra


# ============================================================================
# DASHBOARD API TEST
# ============================================================================

def test_dashboard_contract():
    """Test dashboard endpoint against JSON contract"""
    print_header("TEST 1: DASHBOARD API (/api/dashboard)")
    
    # Expected contract from dashboard API JSON contoh.txt
    expected_contract = {
        "total_production": {
            "produce_ton": 0,
            "target_ton": 0,
            "avg_production_per_day": 0,
            "deviation_pct": 0,
            "source_location": ""
        },
        "weather_condition": {
            "rain_probability_pct": 0,
            "wind_speed_kmh": 0,
            "visibility_km": 0,
            "extreme_weather_flag": False,
            "source_location": ""
        },
        "production_efficiency": {
            "effective_hours": 0,
            "maintenance_hours": 0,
            "efficiency_rate": 0,
            "source_location": ""
        },
        "equipment_status": {
            "active": 0,
            "standby": 0,
            "under_repair": 0,
            "maintenance": 0,
            "source_location": ""
        },
        "vessel_status": {
            "loading": 0,
            "waiting": 0,
            "non_delay_risk": False,
            "vessel_name": ""
        },
        "production_weather_overview": {
            "production": [],
            "target": [],
            "ai_flag": []
        },
        "road_condition_overview": {
            "segments": [{"road": "", "status": "", "speed": 0, "friction": 0, "water": 0}],
            "route_efficiency_score": 0,
            "ai_flag": ""
        },
        "causes_of_downtime": {
            "total_downtime_hours": 0,
            "lost_output_ton": 0,
            "top_causes": {},
            "ai_breakdown": []
        },
        "decision_impact": {
            "correlation": {
                "rain_vs_production": 0,
                "visibility_vs_loading": 0
            }
        },
        "ai_summary": {
            "summary_points": []
        }
    }
    
    # Get actual response
    try:
        response = requests.get(f"{API_BASE}/api/dashboard", params={"location": "PIT A"}, timeout=5)
        response.raise_for_status()
        actual = response.json()
    except Exception as e:
        print_error(f"Failed to call API: {e}")
        return False
    
    # Check keys
    missing, extra = check_keys_recursive(expected_contract, actual)
    
    if not missing and not extra:
        print_success("ALL KEYS MATCH CONTRACT ✓")
        print(f"    Total sections: 10/10")
    else:
        if missing:
            print_error(f"MISSING KEYS: {len(missing)}")
            for key in missing:
                print_info(key, "MISSING")
        if extra:
            print_warning(f"EXTRA KEYS: {len(extra)}")
            for key in extra:
                print_info(key, "EXTRA (not in contract)")
    
    # Test dynamic values
    print("\n  Testing dynamic values (2 requests):")
    req1 = get_dashboard(location="PIT A")
    req2 = get_dashboard(location="PIT B")
    
    if req1["total_production"]["produce_ton"] != req2["total_production"]["produce_ton"]:
        print_success("Production values are DYNAMIC ✓")
    else:
        print_warning("Production values might be static")
    
    return len(missing) == 0 and len(extra) == 0


# ============================================================================
# MINE PLANNER API TEST
# ============================================================================

def test_mine_planner_contract():
    """Test mine planner endpoint against JSON contract"""
    print_header("TEST 2: MINE PLANNER API (/api/mine-planner)")
    
    expected_contract = {
        "environment_conditions": {
            "area": "",
            "location": "",
            "rainfall": "",
            "temperature": "",
            "humidity": "",
            "wind": "",
            "pressure": "",
            "visibility": "",
            "lightning": False,
            "updated": "",
            "risk": {
                "score": 0,
                "title": "",
                "subtitle": ""
            }
        },
        "ai_recommendation": {
            "scenarios": [
                {"title": "", "description": ""}
            ],
            "analysis_sources": ""
        },
        "road_conditions": {
            "segment_name": "",
            "road_condition_label": "",
            "travel_time": "",
            "friction_index": 0,
            "water_depth": "",
            "speed_limit": "",
            "actual_speed": "",
            "alert": {
                "title": "",
                "description": ""
            }
        },
        "equipment_status": {
            "summary": {
                "excellent": 0,
                "good": 0,
                "maintenanceRequired": 0,
                "slightlyDamaged": 0,
                "severelyDamaged": 0
            },
            "equipments": [
                {
                    "id": "",
                    "type": "",
                    "model": "",
                    "condition": "",
                    "operatingHours": 0,
                    "maintenanceHours": 0
                }
            ],
            "fleet_overview": [
                {
                    "equipmentType": "",
                    "active": 0,
                    "maintenance": 0,
                    "idle": 0
                }
            ]
        }
    }
    
    actual = get_mine_planner(area="PIT A")
    missing, extra = check_keys_recursive(expected_contract, actual)
    
    if not missing and not extra:
        print_success("ALL KEYS MATCH CONTRACT ✓")
        print(f"    Total sections: 4/4")
    else:
        if missing:
            print_error(f"MISSING KEYS: {len(missing)}")
            for key in missing[:5]:  # Show first 5
                print_info(key, "MISSING")
        if extra:
            print_warning(f"EXTRA KEYS: {len(extra)}")
            for key in extra[:5]:
                print_info(key, "EXTRA")
    
    return len(missing) == 0 and len(extra) == 0


# ============================================================================
# SHIPPING PLANNER API TEST
# ============================================================================

def test_shipping_planner_contract():
    """Test shipping planner endpoint against JSON contract"""
    print_header("TEST 3: SHIPPING PLANNER API (/api/shipping-planner)")
    
    expected_contract = {
        "port_weather_conditions": {
            "area": "",
            "location": "",
            "rainfall": "",
            "temperature": "",
            "humidity": "",
            "wind": "",
            "pressure": "",
            "visibility": "",
            "lightning": False,
            "updated": "",
            "riskScore": 0,
            "riskTitle": "",
            "riskSubtitle": ""
        },
        "ai_recommendation": {
            "scenarios": [{"title": "", "description": ""}],
            "analysis_sources": ""
        },
        "vessel_schedules": [
            {
                "vessel_name": "",
                "eta": "",
                "etb": "",
                "etd": "",
                "laycan_start": "",
                "laycan_end": "",
                "destination": "",
                "status": ""
            }
        ],
        "coal_volume_ready": [
            {
                "stockpile": "",
                "volume": 0,
                "grade": "",
                "updated_at": ""
            }
        ],
        "loading_progress": [
            {
                "vessel_name": "",
                "progress": 0,
                "tonnage_loaded": 0,
                "tonnage_target": 0,
                "last_update": ""
            }
        ],
        "port_congestion": {
            "updatedText": "",
            "shipsLoading": [{"name": ""}],
            "shipsWaiting": [{"name": "", "eta": ""}],
            "shipsCompletedText": "",
            "congestionLevel": "",
            "operationalNote": ""
        }
    }
    
    actual = get_shipping_planner(port="Port Taboneo")
    missing, extra = check_keys_recursive(expected_contract, actual)
    
    if not missing and not extra:
        print_success("ALL KEYS MATCH CONTRACT ✓")
        print(f"    Total sections: 6/6")
    else:
        if missing:
            print_error(f"MISSING KEYS: {len(missing)}")
            for key in missing[:5]:
                print_info(key, "MISSING")
        if extra:
            print_warning(f"EXTRA KEYS: {len(extra)}")
            for key in extra[:5]:
                print_info(key, "EXTRA")
    
    return len(missing) == 0 and len(extra) == 0


# ============================================================================
# CHATBOX API TEST
# ============================================================================

def test_chatbox_contract():
    """Test chatbox endpoint against JSON contract"""
    print_header("TEST 4: CHATBOX API (/api/chatbox)")
    
    expected_contract = {
        "ai_answer": "",
        "ai_time": "",
        "human_answer": "",
        "human_time": "",
        "quick_questions": [],
        "steps": [],
        "data_sources": {
            "weather": "",
            "equipment": "",
            "road": "",
            "vessel": ""
        }
    }
    
    actual = get_chatbox_response(human_answer="What is production status?")
    missing, extra = check_keys_recursive(expected_contract, actual)
    
    if not missing and not extra:
        print_success("ALL KEYS MATCH CONTRACT ✓")
        print(f"    Total sections: 7/7")
    else:
        if missing:
            print_error(f"MISSING KEYS: {len(missing)}")
            for key in missing:
                print_info(key, "MISSING")
        if extra:
            print_warning(f"EXTRA KEYS: {len(extra)}")
            for key in extra:
                print_info(key, "EXTRA")
    
    # Test dynamic response based on input
    print("\n  Testing user input responsiveness:")
    q1 = get_chatbox_response(human_answer="What is weather status?")
    q2 = get_chatbox_response(human_answer="Equipment failure prediction?")
    
    if q1["ai_answer"] != q2["ai_answer"]:
        print_success("AI responses vary based on user input ✓")
    else:
        print_warning("AI responses might be static")
    
    return len(missing) == 0 and len(extra) == 0


# ============================================================================
# REPORTS API TEST
# ============================================================================

def test_reports_contract():
    """Test reports endpoint against JSON contract"""
    print_header("TEST 5: REPORTS API (/api/reports)")
    
    expected_contract = {
        "generator_form": {
            "report_types": [],
            "time_periods": [],
            "formats": []
        },
        "recent_reports": [
            {
                "title": "",
                "date": "",
                "frequency": ""
            }
        ]
    }
    
    actual = get_reports()
    missing, extra = check_keys_recursive(expected_contract, actual)
    
    if not missing and not extra:
        print_success("ALL KEYS MATCH CONTRACT ✓")
        print(f"    Total sections: 2/2")
    else:
        if missing:
            print_error(f"MISSING KEYS: {len(missing)}")
            for key in missing:
                print_info(key, "MISSING")
        if extra:
            print_warning(f"EXTRA KEYS: {len(extra)}")
            for key in extra:
                print_info(key, "EXTRA")
    
    return len(missing) == 0 and len(extra) == 0


# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    """Run all contract compliance tests"""
    print_header("JSON CONTRACT COMPLIANCE TEST SUITE")
    print("Validating ALL endpoints against exact JSON contracts from contoh_API_JSON/\n")
    
    results = []
    
    results.append(("Dashboard", test_dashboard_contract()))
    results.append(("Mine Planner", test_mine_planner_contract()))
    results.append(("Shipping Planner", test_shipping_planner_contract()))
    results.append(("Chatbox", test_chatbox_contract()))
    results.append(("Reports", test_reports_contract()))
    
    # Final Summary
    print_header("FINAL SUMMARY")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = f"{Colors.GREEN}✓ PASS{Colors.RESET}" if result else f"{Colors.RED}✗ FAIL{Colors.RESET}"
        print(f"  {test_name}: {status}")
    
    print(f"\n  {Colors.BOLD}Contract Compliance: {passed}/{total} endpoints{Colors.RESET}")
    
    if passed == total:
        print(f"\n  {Colors.GREEN}✓ ALL ENDPOINTS 100% MATCH JSON CONTRACTS{Colors.RESET}")
        print(f"  {Colors.GREEN}✓ READY FOR FRONTEND INTEGRATION{Colors.RESET}")
        return 0
    else:
        print(f"\n  {Colors.RED}✗ Some endpoints have contract mismatches{Colors.RESET}")
        print(f"  {Colors.YELLOW}⚠ Review errors above and fix keys{Colors.RESET}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
