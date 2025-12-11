"""
Real API Testing - JSON Output Validation
==========================================
Test semua model ML dan endpoint API dengan validasi output JSON
sesuai contoh yang diberikan dari contoh_API_JSON/
"""

import requests
import json
import time
from typing import Dict, Any, List
from datetime import datetime

# API Configuration
API_BASE_URL = "http://localhost:8000"
TIMEOUT = 30

# Color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text: str):
    """Print formatted header"""
    print(f"\n{Colors.CYAN}{'='*80}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text:^80}{Colors.END}")
    print(f"{Colors.CYAN}{'='*80}{Colors.END}\n")

def print_success(text: str):
    """Print success message"""
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_error(text: str):
    """Print error message"""
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def print_info(text: str):
    """Print info message"""
    print(f"{Colors.BLUE}ℹ {text}{Colors.END}")

def print_warning(text: str):
    """Print warning message"""
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")


class APITester:
    """Real API testing with JSON validation"""
    
    def __init__(self, base_url: str = API_BASE_URL):
        self.base_url = base_url
        self.results = []
        self.start_time = None
        
    def test_endpoint(self, method: str, endpoint: str, data: Dict = None, 
                     expected_fields: List[str] = None, test_name: str = None) -> Dict[str, Any]:
        """Test single API endpoint"""
        url = f"{self.base_url}{endpoint}"
        test_name = test_name or endpoint
        
        try:
            start = time.time()
            
            if method.upper() == "GET":
                response = requests.get(url, params=data, timeout=TIMEOUT)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, timeout=TIMEOUT)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            elapsed = time.time() - start
            
            # Check status code
            if response.status_code != 200:
                return {
                    "test_name": test_name,
                    "endpoint": endpoint,
                    "method": method,
                    "status": "FAIL",
                    "error": f"HTTP {response.status_code}",
                    "response_time": elapsed
                }
            
            # Parse JSON
            result = response.json()
            
            # Validate expected fields
            missing_fields = []
            if expected_fields:
                missing_fields = [f for f in expected_fields if f not in result]
            
            return {
                "test_name": test_name,
                "endpoint": endpoint,
                "method": method,
                "status": "PASS" if not missing_fields else "PARTIAL",
                "response_time": elapsed,
                "missing_fields": missing_fields,
                "response_size": len(json.dumps(result)),
                "result": result
            }
            
        except requests.exceptions.Timeout:
            return {
                "test_name": test_name,
                "endpoint": endpoint,
                "method": method,
                "status": "FAIL",
                "error": "Timeout",
                "response_time": TIMEOUT
            }
        except Exception as e:
            return {
                "test_name": test_name,
                "endpoint": endpoint,
                "method": method,
                "status": "FAIL",
                "error": str(e),
                "response_time": 0
            }
    
    def validate_json_structure(self, result: Dict, expected_structure: Dict, path: str = "root") -> List[str]:
        """Recursively validate JSON structure"""
        errors = []
        
        for key, expected_type in expected_structure.items():
            if key not in result:
                errors.append(f"{path}.{key} is missing")
                continue
            
            actual_value = result[key]
            
            if isinstance(expected_type, dict):
                if not isinstance(actual_value, dict):
                    errors.append(f"{path}.{key} should be dict, got {type(actual_value).__name__}")
                else:
                    errors.extend(self.validate_json_structure(actual_value, expected_type, f"{path}.{key}"))
            elif isinstance(expected_type, list):
                if not isinstance(actual_value, list):
                    errors.append(f"{path}.{key} should be list, got {type(actual_value).__name__}")
                elif len(expected_type) > 0 and len(actual_value) > 0:
                    # Validate first item structure
                    if isinstance(expected_type[0], dict):
                        errors.extend(self.validate_json_structure(actual_value[0], expected_type[0], f"{path}.{key}[0]"))
            else:
                # Check type
                if not isinstance(actual_value, expected_type):
                    errors.append(f"{path}.{key} should be {expected_type.__name__}, got {type(actual_value).__name__}")
        
        return errors


# ============================================================================
# TEST SUITE 1: ML MODEL PREDICTIONS
# ============================================================================

def test_ml_models():
    """Test all 7 ML models"""
    print_header("TEST SUITE 1: ML MODEL PREDICTIONS (7 Models)")
    
    tester = APITester()
    test_results = []
    
    # Test 1: Road Speed Prediction
    print(f"\n{Colors.BOLD}Test 1.1: Road Speed Prediction{Colors.END}")
    result = tester.test_endpoint(
        method="POST",
        endpoint="/predict/road-speed",
        data={
            "jenis_jalan": "UTAMA",
            "kondisi_permukaan": "KERING",
            "curah_hujan_mm": 0.5,
            "suhu_celcius": 28.5,
            "kecepatan_angin_ms": 3.2,
            "elevasi_mdpl": 450.0,
            "kemiringan_persen": 5.5,
            "beban_muatan_ton": 85.0,
            "jam_operasi": 10
        },
        expected_fields=["prediction", "confidence"],
        test_name="Road Speed Model"
    )
    test_results.append(result)
    
    if result["status"] == "PASS":
        print_success(f"Road Speed: {result['response_time']:.2f}s")
        print_info(f"   Prediction: {result['result'].get('prediction', 'N/A')}")
        print_info(f"   Confidence: {result['result'].get('confidence', 0)*100:.1f}%")
    else:
        print_error(f"Road Speed: {result.get('error', 'Unknown error')}")
    
    # Test 2: Cycle Time Prediction
    print(f"\n{Colors.BOLD}Test 1.2: Cycle Time Prediction{Colors.END}")
    result = tester.test_endpoint(
        method="POST",
        endpoint="/predict/cycle-time",
        data={
            "jarak_tempuh_km": 12.5,
            "kecepatan_prediksi_kmh": 25.0,
            "curah_hujan_mm": 1.2,
            "kondisi_jalan": "BAIK",
            "beban_muatan_ton": 90.0,
            "jumlah_stop": 2
        },
        expected_fields=["prediction", "confidence"],
        test_name="Cycle Time Model"
    )
    test_results.append(result)
    
    if result["status"] == "PASS":
        print_success(f"Cycle Time: {result['response_time']:.2f}s")
        print_info(f"   Prediction: {result['result'].get('prediction', 'N/A')} minutes")
        print_info(f"   Confidence: {result['result'].get('confidence', 0)*100:.1f}%")
    else:
        print_error(f"Cycle Time: {result.get('error', 'Unknown error')}")
    
    # Test 3: Road Risk Classification
    print(f"\n{Colors.BOLD}Test 1.3: Road Risk Classification{Colors.END}")
    result = tester.test_endpoint(
        method="POST",
        endpoint="/predict/road-risk",
        data={
            "jenis_jalan": "UTAMA",
            "kondisi_permukaan": "BASAH",
            "curah_hujan_mm": 15.5,
            "kemiringan_persen": 8.0
        },
        expected_fields=["prediction", "confidence"],
        test_name="Road Risk Model"
    )
    test_results.append(result)
    
    if result["status"] == "PASS":
        print_success(f"Road Risk: {result['response_time']:.2f}s")
        print_info(f"   Classification: {result['result'].get('prediction', 'N/A')}")
        print_info(f"   Confidence: {result['result'].get('confidence', 0)*100:.1f}%")
    else:
        print_error(f"Road Risk: {result.get('error', 'Unknown error')}")
    
    # Test 4: Equipment Failure Prediction
    print(f"\n{Colors.BOLD}Test 1.4: Equipment Failure Prediction{Colors.END}")
    result = tester.test_endpoint(
        method="POST",
        endpoint="/predict/equipment-failure",
        data={
            "jenis_equipment": "Excavator",
            "umur_tahun": 5.5,
            "jam_operasional_harian": 12.0,
            "ritase_harian": 55.0
        },
        expected_fields=["prediction", "confidence"],
        test_name="Equipment Failure Model"
    )
    test_results.append(result)
    
    if result["status"] == "PASS":
        print_success(f"Equipment Failure: {result['response_time']:.2f}s")
        print_info(f"   Prediction: {result['result'].get('prediction', 'N/A')}")
        print_info(f"   Confidence: {result['result'].get('confidence', 0)*100:.1f}%")
    else:
        print_error(f"Equipment Failure: {result.get('error', 'Unknown error')}")
    
    # Test 5: Port Operability
    print(f"\n{Colors.BOLD}Test 1.5: Port Operability Prediction{Colors.END}")
    result = tester.test_endpoint(
        method="POST",
        endpoint="/predict/port-operability",
        data={
            "tinggi_gelombang_m": 2.5,
            "kecepatan_angin_kmh": 28.0,
            "tipe_kapal": "Bulk Carrier",
            "kapasitas_muatan_ton": 65000.0
        },
        expected_fields=["prediction", "confidence"],
        test_name="Port Operability Model"
    )
    test_results.append(result)
    
    if result["status"] == "PASS":
        print_success(f"Port Operability: {result['response_time']:.2f}s")
        print_info(f"   Status: {result['result'].get('prediction', 'N/A')}")
        print_info(f"   Confidence: {result['result'].get('confidence', 0)*100:.1f}%")
    else:
        print_error(f"Port Operability: {result.get('error', 'Unknown error')}")
    
    # Test 6: Performance Degradation
    print(f"\n{Colors.BOLD}Test 1.6: Performance Degradation Prediction{Colors.END}")
    result = tester.test_endpoint(
        method="POST",
        endpoint="/predict/performance-degradation",
        data={
            "equipment_age_years": 5.5,
            "jam_operasi": 12500.0,
            "beban_rata_rata_ton": 85.0,
            "kecepatan_rata_rata_kmh": 22.5,
            "frekuensi_maintenance": 12,
            "jumlah_breakdown": 2,
            "utilization_rate": 0.78
        },
        expected_fields=["prediction", "confidence"],
        test_name="Performance Degradation Model"
    )
    test_results.append(result)
    
    if result["status"] == "PASS":
        print_success(f"Performance Degradation: {result['response_time']:.2f}s")
        print_info(f"   Degradation: {result['result'].get('prediction', 'N/A')}%")
        print_info(f"   Confidence: {result['result'].get('confidence', 0)*100:.1f}%")
    else:
        print_error(f"Performance Degradation: {result.get('error', 'Unknown error')}")
    
    # Test 7: Fleet Risk Assessment
    print(f"\n{Colors.BOLD}Test 1.7: Fleet Risk Assessment{Colors.END}")
    result = tester.test_endpoint(
        method="POST",
        endpoint="/predict/fleet-risk",
        data={
            "total_unit": 50,
            "umur_rata_rata_tahun": 6.5,
            "utilisasi_persen": 78.5,
            "frekuensi_breakdown": 15,
            "skor_maintenance": 82.0,
            "equipment_readiness": 0.85,
            "jumlah_unit_critical": 3
        },
        expected_fields=["prediction", "confidence"],
        test_name="Fleet Risk Model"
    )
    test_results.append(result)
    
    if result["status"] == "PASS":
        print_success(f"Fleet Risk: {result['response_time']:.2f}s")
        print_info(f"   Risk Score: {result['result'].get('prediction', 'N/A')}")
        print_info(f"   Confidence: {result['result'].get('confidence', 0)*100:.1f}%")
    else:
        print_error(f"Fleet Risk: {result.get('error', 'Unknown error')}")
    
    return test_results


# ============================================================================
# TEST SUITE 2: FRONTEND API ENDPOINTS
# ============================================================================

def test_frontend_endpoints():
    """Test all 6 frontend endpoints with JSON structure validation"""
    print_header("TEST SUITE 2: FRONTEND API ENDPOINTS (6 Endpoints)")
    
    tester = APITester()
    test_results = []
    
    # Test 2.1: Dashboard API
    print(f"\n{Colors.BOLD}Test 2.1: Dashboard API{Colors.END}")
    result = tester.test_endpoint(
        method="GET",
        endpoint="/api/dashboard",
        expected_fields=[
            "total_production",
            "weather_condition",
            "production_efficiency",
            "equipment_status",
            "vessel_status"
        ],
        test_name="Dashboard Endpoint"
    )
    test_results.append(result)
    
    if result["status"] in ["PASS", "PARTIAL"]:
        print_success(f"Dashboard: {result['response_time']:.2f}s, Size: {result['response_size']} bytes")
        
        # Validate structure against example
        dashboard_structure = {
            "total_production": {
                "produce_ton": (int, float),
                "target_ton": (int, float),
                "deviation_pct": (int, float)
            },
            "weather_condition": {
                "rain_probability_pct": (int, float),
                "wind_speed_kmh": (int, float)
            },
            "equipment_status": {
                "active": int,
                "standby": int,
                "under_repair": int
            }
        }
        
        errors = validate_structure_flexible(result["result"], dashboard_structure)
        if errors:
            print_warning(f"   Structure issues: {len(errors)}")
            for error in errors[:3]:  # Show first 3
                print_warning(f"     - {error}")
        else:
            print_info("   ✓ JSON structure matches expected format")
        
        # Show key metrics
        if "total_production" in result["result"]:
            prod = result["result"]["total_production"]
            print_info(f"   Production: {prod.get('produce_ton', 0):,.0f} / {prod.get('target_ton', 0):,.0f} ton")
    else:
        print_error(f"Dashboard: {result.get('error', 'Unknown error')}")
    
    # Test 2.2: Mine Planner API
    print(f"\n{Colors.BOLD}Test 2.2: Mine Planner API{Colors.END}")
    result = tester.test_endpoint(
        method="GET",
        endpoint="/api/mine-planner",
        expected_fields=[
            "environment_conditions",
            "ai_recommendation",
            "road_conditions",
            "equipment_status"
        ],
        test_name="Mine Planner Endpoint"
    )
    test_results.append(result)
    
    if result["status"] in ["PASS", "PARTIAL"]:
        print_success(f"Mine Planner: {result['response_time']:.2f}s, Size: {result['response_size']} bytes")
        
        # Check AI recommendations
        if "ai_recommendation" in result["result"]:
            ai_rec = result["result"]["ai_recommendation"]
            if "scenarios" in ai_rec:
                print_info(f"   AI Scenarios: {len(ai_rec['scenarios'])} scenarios generated")
            else:
                print_warning("   AI Scenarios: Not found in response")
        
        # Check environment risk
        if "environment_conditions" in result["result"]:
            env = result["result"]["environment_conditions"]
            if "risk" in env:
                print_info(f"   Risk Score: {env['risk'].get('score', 'N/A')}")
    else:
        print_error(f"Mine Planner: {result.get('error', 'Unknown error')}")
    
    # Test 2.3: Shipping Planner API
    print(f"\n{Colors.BOLD}Test 2.3: Shipping Planner API{Colors.END}")
    result = tester.test_endpoint(
        method="GET",
        endpoint="/api/shipping-planner",
        expected_fields=[
            "port_weather_conditions",
            "ai_recommendation",
            "vessel_schedules",
            "coal_volume_ready"
        ],
        test_name="Shipping Planner Endpoint"
    )
    test_results.append(result)
    
    if result["status"] in ["PASS", "PARTIAL"]:
        print_success(f"Shipping Planner: {result['response_time']:.2f}s, Size: {result['response_size']} bytes")
        
        if "vessel_schedules" in result["result"]:
            vessels = result["result"]["vessel_schedules"]
            print_info(f"   Vessels: {len(vessels)} vessels scheduled")
        
        if "port_congestion" in result["result"]:
            congestion = result["result"]["port_congestion"]
            level = congestion.get("congestionLevel", "Unknown")
            print_info(f"   Congestion Level: {level}")
    else:
        print_error(f"Shipping Planner: {result.get('error', 'Unknown error')}")
    
    # Test 2.4: Simulation Analysis API
    print(f"\n{Colors.BOLD}Test 2.4: Simulation Analysis API{Colors.END}")
    result = tester.test_endpoint(
        method="POST",
        endpoint="/api/simulation-analysis",
        data={
            "expected_rainfall_mm": 50.0,
            "equipment_health_pct": 80.0,
            "vessel_delay_hours": 5.0
        },
        expected_fields=[
            "input_parameters",
            "scenarios",
            "ai_recommendations"
        ],
        test_name="Simulation Analysis Endpoint"
    )
    test_results.append(result)
    
    if result["status"] in ["PASS", "PARTIAL"]:
        print_success(f"Simulation Analysis: {result['response_time']:.2f}s, Size: {result['response_size']} bytes")
        
        if "scenarios" in result["result"]:
            scenarios = result["result"]["scenarios"]
            print_info(f"   Scenarios: {len(scenarios)} scenarios analyzed")
            
            for scenario_name, scenario_data in scenarios.items():
                if isinstance(scenario_data, dict) and "production_output_pct" in scenario_data:
                    print_info(f"     - {scenario_name}: {scenario_data['production_output_pct']}% output")
    else:
        print_error(f"Simulation Analysis: {result.get('error', 'Unknown error')}")
    
    # Test 2.5: Chatbox API
    print(f"\n{Colors.BOLD}Test 2.5: Chatbox API{Colors.END}")
    result = tester.test_endpoint(
        method="POST",
        endpoint="/api/chatbox",
        data={
            "human_answer": "What caused the slowdown today?"
        },
        expected_fields=[
            "ai_answer",
            "human_answer",
            "quick_questions"
        ],
        test_name="Chatbox Endpoint"
    )
    test_results.append(result)
    
    if result["status"] in ["PASS", "PARTIAL"]:
        print_success(f"Chatbox: {result['response_time']:.2f}s, Size: {result['response_size']} bytes")
        
        if "ai_answer" in result["result"]:
            answer = result["result"]["ai_answer"]
            print_info(f"   AI Answer: {answer[:80]}...")
        
        if "quick_questions" in result["result"]:
            questions = result["result"]["quick_questions"]
            print_info(f"   Quick Questions: {len(questions)} suggestions")
    else:
        print_error(f"Chatbox: {result.get('error', 'Unknown error')}")
    
    # Test 2.6: Reports API
    print(f"\n{Colors.BOLD}Test 2.6: Reports API{Colors.END}")
    result = tester.test_endpoint(
        method="GET",
        endpoint="/api/reports",
        expected_fields=[
            "generator_form",
            "recent_reports"
        ],
        test_name="Reports Endpoint"
    )
    test_results.append(result)
    
    if result["status"] in ["PASS", "PARTIAL"]:
        print_success(f"Reports: {result['response_time']:.2f}s, Size: {result['response_size']} bytes")
        
        if "recent_reports" in result["result"]:
            reports = result["result"]["recent_reports"]
            print_info(f"   Recent Reports: {len(reports)} reports available")
    else:
        print_error(f"Reports: {result.get('error', 'Unknown error')}")
    
    return test_results


def validate_structure_flexible(data: Dict, structure: Dict) -> List[str]:
    """Flexible structure validation"""
    errors = []
    
    for key, expected_type in structure.items():
        if key not in data:
            errors.append(f"Missing key: {key}")
            continue
        
        value = data[key]
        
        if isinstance(expected_type, dict):
            if isinstance(value, dict):
                errors.extend(validate_structure_flexible(value, expected_type))
            else:
                errors.append(f"{key} should be dict, got {type(value).__name__}")
        elif isinstance(expected_type, tuple):
            # Multiple allowed types
            if not any(isinstance(value, t) for t in expected_type):
                errors.append(f"{key} should be one of {expected_type}, got {type(value).__name__}")
    
    return errors


# ============================================================================
# SUMMARY & REPORTING
# ============================================================================

def generate_summary(ml_results: List[Dict], frontend_results: List[Dict]):
    """Generate comprehensive test summary"""
    print_header("TEST RESULTS SUMMARY")
    
    all_results = ml_results + frontend_results
    
    total_tests = len(all_results)
    passed = sum(1 for r in all_results if r["status"] == "PASS")
    partial = sum(1 for r in all_results if r["status"] == "PARTIAL")
    failed = sum(1 for r in all_results if r["status"] == "FAIL")
    
    avg_response_time = sum(r["response_time"] for r in all_results) / total_tests if total_tests > 0 else 0
    
    print(f"\n{Colors.BOLD}Overall Statistics:{Colors.END}")
    print(f"  Total Tests: {total_tests}")
    print(f"  {Colors.GREEN}✓ Passed: {passed}{Colors.END}")
    print(f"  {Colors.YELLOW}⚠ Partial: {partial}{Colors.END}")
    print(f"  {Colors.RED}✗ Failed: {failed}{Colors.END}")
    print(f"  Average Response Time: {avg_response_time:.2f}s")
    
    success_rate = (passed + partial) / total_tests * 100 if total_tests > 0 else 0
    print(f"\n  {Colors.BOLD}Success Rate: {success_rate:.1f}%{Colors.END}")
    
    if success_rate >= 90:
        print(f"\n  {Colors.GREEN}{Colors.BOLD}🎉 EXCELLENT! System is production-ready!{Colors.END}")
    elif success_rate >= 70:
        print(f"\n  {Colors.YELLOW}{Colors.BOLD}⚠ GOOD! Minor issues need attention.{Colors.END}")
    else:
        print(f"\n  {Colors.RED}{Colors.BOLD}❌ NEEDS WORK! Multiple failures detected.{Colors.END}")
    
    # ML Models Summary
    print(f"\n{Colors.BOLD}ML Models Performance:{Colors.END}")
    for result in ml_results:
        status_icon = "✓" if result["status"] == "PASS" else "✗"
        status_color = Colors.GREEN if result["status"] == "PASS" else Colors.RED
        print(f"  {status_color}{status_icon} {result['test_name']}: {result['response_time']:.2f}s{Colors.END}")
    
    # Frontend Endpoints Summary
    print(f"\n{Colors.BOLD}Frontend Endpoints Performance:{Colors.END}")
    for result in frontend_results:
        status_icon = "✓" if result["status"] in ["PASS", "PARTIAL"] else "✗"
        status_color = Colors.GREEN if result["status"] == "PASS" else (Colors.YELLOW if result["status"] == "PARTIAL" else Colors.RED)
        print(f"  {status_color}{status_icon} {result['test_name']}: {result['response_time']:.2f}s{Colors.END}")
    
    # Failed Tests Details
    failed_tests = [r for r in all_results if r["status"] == "FAIL"]
    if failed_tests:
        print(f"\n{Colors.RED}{Colors.BOLD}Failed Tests Details:{Colors.END}")
        for result in failed_tests:
            print(f"  {Colors.RED}✗ {result['test_name']}{Colors.END}")
            print(f"    Error: {result.get('error', 'Unknown')}")
            print(f"    Endpoint: {result['endpoint']}")
    
    # Save results to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"api_test_results_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_tests": total_tests,
                "passed": passed,
                "partial": partial,
                "failed": failed,
                "success_rate": success_rate,
                "avg_response_time": avg_response_time
            },
            "ml_models": ml_results,
            "frontend_endpoints": frontend_results
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n{Colors.CYAN}📄 Detailed results saved to: {filename}{Colors.END}")


def check_api_health():
    """Check if API is running"""
    print_header("PRE-TEST: API HEALTH CHECK")
    
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print_success("API is running and healthy")
            result = response.json()
            print_info(f"   Status: {result.get('status', 'unknown')}")
            print_info(f"   Models Loaded: {result.get('models_loaded', 0)}")
            return True
        else:
            print_error(f"API returned status code {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to API. Is it running?")
        print_warning(f"Make sure the API is running at {API_BASE_URL}")
        print_warning("Run: python run_api.py")
        return False
    except Exception as e:
        print_error(f"Health check failed: {e}")
        return False


# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main test execution"""
    print("\n" + "="*80)
    print(f"{Colors.BOLD}{Colors.CYAN}{'REAL API TESTING - COMPREHENSIVE VALIDATION':^80}{Colors.END}")
    print(f"{Colors.CYAN}{'Testing all ML models and frontend endpoints':^80}{Colors.END}")
    print("="*80 + "\n")
    
    # Check API health first
    if not check_api_health():
        print(f"\n{Colors.RED}❌ Cannot proceed without API running. Exiting.{Colors.END}\n")
        return
    
    # Run test suites
    ml_results = test_ml_models()
    frontend_results = test_frontend_endpoints()
    
    # Generate summary
    generate_summary(ml_results, frontend_results)
    
    print("\n" + "="*80 + "\n")


if __name__ == "__main__":
    main()
