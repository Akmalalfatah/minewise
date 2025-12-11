"""
Test Frontend-Compatible API Endpoints
Verify bahwa response structure match dengan contract JSON

Author: ML Team
Date: December 9, 2025
"""

import requests
import json
import sys
from typing import Dict, Any
from datetime import datetime

# API Base URL
BASE_URL = "http://localhost:8000"

# ANSI Colors
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    """Print section header"""
    print(f"\n{Colors.CYAN}{'='*80}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text}{Colors.RESET}")
    print(f"{Colors.CYAN}{'='*80}{Colors.RESET}\n")

def print_success(message: str):
    """Print success message"""
    print(f"  {Colors.GREEN}✓{Colors.RESET} {message}")

def print_error(message: str):
    """Print error message"""
    print(f"  {Colors.RED}✗{Colors.RESET} {message}")

def print_info(message: str):
    """Print info message"""
    print(f"  {Colors.YELLOW}ℹ{Colors.RESET} {message}")

def verify_keys(response: Dict[Any, Any], expected_keys: list, endpoint_name: str) -> bool:
    """Verify bahwa response memiliki semua keys yang dibutuhkan"""
    missing_keys = []
    for key in expected_keys:
        if key not in response:
            missing_keys.append(key)
    
    if missing_keys:
        print_error(f"{endpoint_name}: Missing keys: {missing_keys}")
        return False
    else:
        print_success(f"{endpoint_name}: All required keys present ✓")
        return True

def test_dashboard_endpoint():
    """Test /api/dashboard endpoint"""
    print_header("1. TESTING DASHBOARD ENDPOINT")
    
    try:
        # Test GET request
        response = requests.get(f"{BASE_URL}/api/dashboard?location=PIT A")
        
        if response.status_code == 200:
            print_success(f"GET /api/dashboard - Status: {response.status_code}")
            data = response.json()
            
            # Expected top-level keys
            expected_keys = [
                "total_production",
                "weather_condition",
                "production_efficiency",
                "equipment_status",
                "vessel_status",
                "production_weather_overview",
                "road_condition_overview",
                "causes_of_downtime",
                "decision_impact",
                "ai_summary"
            ]
            
            if verify_keys(data, expected_keys, "Dashboard"):
                # Verify nested structures
                print_info("Verifying nested structures...")
                
                # Check total_production
                prod_keys = ["produce_ton", "target_ton", "avg_production_per_day", "deviation_pct", "source_location"]
                verify_keys(data["total_production"], prod_keys, "  → total_production")
                
                # Check weather_condition
                weather_keys = ["rain_probability_pct", "wind_speed_kmh", "visibility_km", "extreme_weather_flag", "source_location"]
                verify_keys(data["weather_condition"], weather_keys, "  → weather_condition")
                
                # Check equipment_status
                equip_keys = ["active", "standby", "under_repair", "maintenance", "source_location"]
                verify_keys(data["equipment_status"], equip_keys, "  → equipment_status")
                
                # Check road_condition_overview
                road_keys = ["segments", "route_efficiency_score", "ai_flag"]
                verify_keys(data["road_condition_overview"], road_keys, "  → road_condition_overview")
                
                print_success("Dashboard endpoint: PASS ✓")
                return True
        else:
            print_error(f"Dashboard endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Dashboard endpoint error: {e}")
        return False

def test_mine_planner_endpoint():
    """Test /api/mine-planner endpoint"""
    print_header("2. TESTING MINE PLANNER ENDPOINT")
    
    try:
        response = requests.get(f"{BASE_URL}/api/mine-planner?area=PIT A")
        
        if response.status_code == 200:
            print_success(f"GET /api/mine-planner - Status: {response.status_code}")
            data = response.json()
            
            # Expected top-level keys
            expected_keys = [
                "environment_conditions",
                "ai_recommendation",
                "road_conditions",
                "equipment_status"
            ]
            
            if verify_keys(data, expected_keys, "Mine Planner"):
                # Verify nested structures
                print_info("Verifying nested structures...")
                
                # Check environment_conditions
                env_keys = ["area", "location", "rainfall", "temperature", "humidity", "wind", "pressure", "visibility", "lightning", "updated", "risk"]
                verify_keys(data["environment_conditions"], env_keys, "  → environment_conditions")
                
                # Check ai_recommendation
                ai_keys = ["scenarios", "analysis_sources"]
                verify_keys(data["ai_recommendation"], ai_keys, "  → ai_recommendation")
                
                # Check scenarios array
                if len(data["ai_recommendation"]["scenarios"]) >= 3:
                    print_success("  → ai_recommendation: 3 scenarios present ✓")
                    scenario_keys = ["title", "description"]
                    verify_keys(data["ai_recommendation"]["scenarios"][0], scenario_keys, "    → scenario[0]")
                
                # Check equipment_status
                equip_keys = ["summary", "equipments", "fleet_overview"]
                verify_keys(data["equipment_status"], equip_keys, "  → equipment_status")
                
                print_success("Mine Planner endpoint: PASS ✓")
                return True
        else:
            print_error(f"Mine Planner endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Mine Planner endpoint error: {e}")
        return False

def test_shipping_planner_endpoint():
    """Test /api/shipping-planner endpoint"""
    print_header("3. TESTING SHIPPING PLANNER ENDPOINT")
    
    try:
        response = requests.get(f"{BASE_URL}/api/shipping-planner?location=PIT A")
        
        if response.status_code == 200:
            print_success(f"GET /api/shipping-planner - Status: {response.status_code}")
            data = response.json()
            
            # Expected top-level keys
            expected_keys = [
                "port_weather_conditions",
                "ai_recommendation",
                "vessel_schedules",
                "coal_volume_ready",
                "loading_progress",
                "port_congestion"
            ]
            
            if verify_keys(data, expected_keys, "Shipping Planner"):
                # Verify nested structures
                print_info("Verifying nested structures...")
                
                # Check port_weather_conditions
                weather_keys = ["area", "location", "rainfall", "temperature", "humidity", "wind", "pressure", "visibility", "lightning", "updated", "riskScore", "riskTitle", "riskSubtitle"]
                verify_keys(data["port_weather_conditions"], weather_keys, "  → port_weather_conditions")
                
                # Check vessel_schedules (array)
                if len(data["vessel_schedules"]) > 0:
                    print_success(f"  → vessel_schedules: {len(data['vessel_schedules'])} vessels ✓")
                    vessel_keys = ["vessel_name", "eta", "etb", "etd", "laycan_start", "laycan_end", "destination", "status"]
                    verify_keys(data["vessel_schedules"][0], vessel_keys, "    → vessel_schedules[0]")
                
                # Check port_congestion
                congestion_keys = ["updatedText", "shipsLoading", "shipsWaiting", "shipsCompletedText", "congestionLevel", "operationalNote"]
                verify_keys(data["port_congestion"], congestion_keys, "  → port_congestion")
                
                print_success("Shipping Planner endpoint: PASS ✓")
                return True
        else:
            print_error(f"Shipping Planner endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Shipping Planner endpoint error: {e}")
        return False

def test_chatbox_endpoint():
    """Test /api/chatbox endpoint"""
    print_header("4. TESTING CHATBOX ENDPOINT")
    
    try:
        # POST request dengan question
        payload = {
            "human_answer": "What caused the slowdown today?",
            "context": {}
        }
        
        response = requests.post(f"{BASE_URL}/api/chatbox", json=payload)
        
        if response.status_code == 200:
            print_success(f"POST /api/chatbox - Status: {response.status_code}")
            data = response.json()
            
            # Expected keys
            expected_keys = [
                "ai_answer",
                "ai_time",
                "human_answer",
                "human_time",
                "quick_questions",
                "steps",
                "data_sources"
            ]
            
            if verify_keys(data, expected_keys, "Chatbox"):
                # Verify data_sources structure
                ds_keys = ["weather", "equipment", "road", "vessel"]
                verify_keys(data["data_sources"], ds_keys, "  → data_sources")
                
                # Verify arrays
                if len(data["quick_questions"]) >= 4:
                    print_success(f"  → quick_questions: {len(data['quick_questions'])} questions ✓")
                
                if len(data["steps"]) >= 4:
                    print_success(f"  → steps: {len(data['steps'])} steps ✓")
                
                print_success("Chatbox endpoint: PASS ✓")
                return True
        else:
            print_error(f"Chatbox endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Chatbox endpoint error: {e}")
        return False

def test_reports_endpoint():
    """Test /api/reports endpoint"""
    print_header("5. TESTING REPORTS ENDPOINT")
    
    try:
        response = requests.get(f"{BASE_URL}/api/reports")
        
        if response.status_code == 200:
            print_success(f"GET /api/reports - Status: {response.status_code}")
            data = response.json()
            
            # Expected keys
            expected_keys = ["generator_form", "recent_reports"]
            
            if verify_keys(data, expected_keys, "Reports"):
                # Verify generator_form
                form_keys = ["report_types", "time_periods", "formats"]
                verify_keys(data["generator_form"], form_keys, "  → generator_form")
                
                # Verify recent_reports array
                if len(data["recent_reports"]) > 0:
                    print_success(f"  → recent_reports: {len(data['recent_reports'])} reports ✓")
                    report_keys = ["title", "date", "frequency"]
                    verify_keys(data["recent_reports"][0], report_keys, "    → recent_reports[0]")
                
                print_success("Reports endpoint: PASS ✓")
                return True
        else:
            print_error(f"Reports endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Reports endpoint error: {e}")
        return False

def main():
    """Run all frontend endpoint tests"""
    print_header("FRONTEND-COMPATIBLE API ENDPOINT TESTS")
    print(f"{Colors.YELLOW}Testing API compatibility with frontend JSON contracts{Colors.RESET}")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # Check API health first
    try:
        health_check = requests.get(f"{BASE_URL}/health", timeout=5)
        if health_check.status_code == 200:
            print_success("API Server is running ✓\n")
        else:
            print_error("API Server health check failed")
            print_info("Make sure to start the server first:")
            print_info("  python run_api.py")
            sys.exit(1)
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to API server")
        print_info("Please start the server first:")
        print_info("  python run_api.py")
        sys.exit(1)
    
    # Run all tests
    results = {
        "Dashboard": test_dashboard_endpoint(),
        "Mine Planner": test_mine_planner_endpoint(),
        "Shipping Planner": test_shipping_planner_endpoint(),
        "Chatbox": test_chatbox_endpoint(),
        "Reports": test_reports_endpoint()
    }
    
    # Summary
    print_header("TEST SUMMARY")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for endpoint, result in results.items():
        status = f"{Colors.GREEN}PASS{Colors.RESET}" if result else f"{Colors.RED}FAIL{Colors.RESET}"
        print(f"  [{status}] {endpoint}")
    
    print(f"\n{Colors.CYAN}{'='*80}{Colors.RESET}")
    
    if passed == total:
        print(f"{Colors.GREEN}{Colors.BOLD}*** ALL {total} FRONTEND ENDPOINTS PASSED! ***{Colors.RESET}")
        print(f"{Colors.GREEN}✓ API is fully compatible with frontend JSON contracts{Colors.RESET}")
    else:
        print(f"{Colors.YELLOW}Passed: {passed}/{total}{Colors.RESET}")
        print(f"{Colors.RED}Failed: {total - passed}/{total}{Colors.RESET}")
    
    print(f"{Colors.CYAN}{'='*80}{Colors.RESET}\n")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
