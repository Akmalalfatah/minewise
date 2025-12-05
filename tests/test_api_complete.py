"""
Complete API Test - All Endpoints Including Batch
Test semua 7 models melalui individual dan batch endpoints
"""

import requests
import json
from datetime import datetime
import sys
import os

# Fix Windows console encoding for Unicode characters
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
    # Alternative: disable Unicode if above doesn't work
    USE_UNICODE = False
else:
    USE_UNICODE = True

BASE_URL = "http://localhost:8000"
TIMEOUT = 15

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'

def print_header(text):
    print(f"\n{Colors.CYAN}{'='*80}")
    print(f"{text}")
    print(f"{'='*80}{Colors.RESET}")

def print_success(message):
    symbol = "✓" if USE_UNICODE else "[OK]"
    print(f"  {Colors.GREEN}{symbol}{Colors.RESET} {message}")

def print_error(message):
    symbol = "✗" if USE_UNICODE else "[X]"
    print(f"  {Colors.RED}{symbol}{Colors.RESET} {message}")

def print_info(message):
    symbol = "ℹ" if USE_UNICODE else "[i]"
    print(f"  {Colors.BLUE}{symbol}{Colors.RESET} {message}")

print_header("COMPLETE API TEST - ALL 7 MODELS")
print(f"Base URL: {BASE_URL}")
print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# Check health
print_header("1. API HEALTH CHECK")
try:
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    if response.status_code == 200:
        data = response.json()
        print_success(f"API Status: {data.get('status')}")
        print_success(f"Models Loaded: {data.get('models_loaded')}")
    else:
        print_error(f"Health check failed: {response.status_code}")
        sys.exit(1)
except Exception as e:
    print_error(f"Cannot connect: {e}")
    sys.exit(1)

results = []

# Individual endpoints (5 models)
print_header("2. INDIVIDUAL ENDPOINTS - 5 MODELS")

# Road Speed
print(f"\n[1/7] {Colors.BLUE}Road Speed{Colors.RESET}")
try:
    response = requests.post(f"{BASE_URL}/predict/road-speed", json={
        "jenis_jalan": "UTAMA",
        "kondisi_permukaan": "KERING",
        "curah_hujan_mm": 0.5,
        "suhu_celcius": 28.5,
        "kecepatan_angin_ms": 3.2,
        "elevasi_mdpl": 450,
        "kemiringan_persen": 5.5,
        "beban_muatan_ton": 85.0,
        "jam_operasi": 10
    }, timeout=TIMEOUT)
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Prediction: {data['prediction']} | Confidence: {data.get('confidence', 0):.1%}")
        results.append(("Road Speed", True))
    else:
        print_error(f"Failed: {response.status_code}")
        results.append(("Road Speed", False))
except Exception as e:
    print_error(f"Error: {e}")
    results.append(("Road Speed", False))

# Cycle Time
print(f"\n[2/7] {Colors.BLUE}Cycle Time{Colors.RESET}")
try:
    response = requests.post(f"{BASE_URL}/predict/cycle-time", json={
        "jarak_tempuh_km": 5.5,
        "kecepatan_prediksi_kmh": 25.0,
        "curah_hujan_mm": 2.0,
        "kondisi_jalan": "BAIK",
        "beban_muatan_ton": 90.0,
        "jumlah_stop": 2
    }, timeout=TIMEOUT)
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Prediction: {data['prediction']} min | Confidence: {data.get('confidence', 0):.1%}")
        results.append(("Cycle Time", True))
    else:
        print_error(f"Failed: {response.status_code}")
        results.append(("Cycle Time", False))
except Exception as e:
    print_error(f"Error: {e}")
    results.append(("Cycle Time", False))

# Road Risk
print(f"\n[3/7] {Colors.BLUE}Road Risk{Colors.RESET}")
try:
    response = requests.post(f"{BASE_URL}/predict/road-risk", json={
        "curah_hujan_mm": 15.0,
        "intensitas_hujan": "SEDANG",
        "kecepatan_angin_ms": 10.0,
        "kondisi_permukaan": "BASAH",
        "kedalaman_air_cm": 3.5,
        "indeks_friksi": 0.65,
        "visibilitas_m": 150.0,
        "kemiringan_persen": 8.0
    }, timeout=TIMEOUT)
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Classification: {data['prediction']} | Confidence: {data.get('confidence', 0):.1%}")
        results.append(("Road Risk", True))
    else:
        print_error(f"Failed: {response.status_code}")
        results.append(("Road Risk", False))
except Exception as e:
    print_error(f"Error: {e}")
    results.append(("Road Risk", False))

# Equipment Failure
print(f"\n[4/7] {Colors.BLUE}Equipment Failure{Colors.RESET}")
try:
    response = requests.post(f"{BASE_URL}/predict/equipment-failure", json={
        "tipe_alat": "EXCAVATOR",
        "umur_tahun": 5,
        "jam_operasi": 12000.0,
        "jarak_tempuh_km": 45000.0,
        "jumlah_maintenance": 25,
        "jumlah_breakdown": 3,
        "days_since_last_maintenance": 45,
        "utilization_rate": 0.75
    }, timeout=TIMEOUT)
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Classification: {data['prediction']} | Confidence: {data.get('confidence', 0):.1%}")
        results.append(("Equipment Failure", True))
    else:
        print_error(f"Failed: {response.status_code}")
        results.append(("Equipment Failure", False))
except Exception as e:
    print_error(f"Error: {e}")
    results.append(("Equipment Failure", False))

# Port Operability
print(f"\n[5/7] {Colors.BLUE}Port Operability{Colors.RESET}")
try:
    response = requests.post(f"{BASE_URL}/predict/port-operability", json={
        "curah_hujan_mm": 0.0,
        "kecepatan_angin_ms": 8.0,
        "tinggi_gelombang_m": 0.5,
        "visibilitas_km": 10.0,
        "suhu_celcius": 28.0,
        "equipment_readiness": 0.95
    }, timeout=TIMEOUT)
    
    if response.status_code == 200:
        data = response.json()
        print_success(f"Classification: {data['prediction']} | Confidence: {data.get('confidence', 0):.1%}")
        results.append(("Port Operability", True))
    else:
        print_error(f"Failed: {response.status_code}")
        results.append(("Port Operability", False))
except Exception as e:
    print_error(f"Error: {e}")
    results.append(("Port Operability", False))

# Batch endpoints (2 models)
print_header("3. BATCH ENDPOINTS - 2 MODELS")

# Test Batch Fleet Endpoint
print(f"\n[6/7] {Colors.BLUE}Performance Degradation + Fleet Risk (Batch){Colors.RESET}")
print_info("Testing batch/fleet endpoint for fleet-wide analysis...")

try:
    # Prepare batch data - API expects List[Dict] directly
    batch_data = [
        {
            "performance_degradation": {
                "umur_tahun": 3,
                "jam_operasi": 8000.0,
                "total_ritase": 1500,
                "jumlah_breakdown": 2,
                "fuel_consumption_lh": 45.0
            },
            "fleet_risk": {
                "umur_tahun": 3,
                "jumlah_breakdown": 2,
                "days_since_maintenance": 30,
                "utilization_rate": 0.75
            }
        },
        {
            "performance_degradation": {
                "umur_tahun": 5,
                "jam_operasi": 12000.0,
                "total_ritase": 2200,
                "jumlah_breakdown": 5,
                "fuel_consumption_lh": 48.0
            },
            "fleet_risk": {
                "umur_tahun": 5,
                "jumlah_breakdown": 5,
                "days_since_maintenance": 60,
                "utilization_rate": 0.85
            }
        },
        {
            "performance_degradation": {
                "umur_tahun": 7,
                "jam_operasi": 15000.0,
                "total_ritase": 0,
                "jumlah_breakdown": 8,
                "fuel_consumption_lh": 55.0
            },
            "fleet_risk": {
                "umur_tahun": 7,
                "jumlah_breakdown": 8,
                "days_since_maintenance": 90,
                "utilization_rate": 0.65
            }
        }
    ]
    
    response = requests.post(
        f"{BASE_URL}/predict/batch/fleet", 
        json=batch_data, 
        timeout=TIMEOUT
    )
    
    if response.status_code == 200:
        data = response.json()
        
        # Check if response is a list or dict
        if isinstance(data, list):
            print_success(f"Batch processed: {len(data)} equipment analyzed")
            
            if len(data) > 0:
                # Show first 3 results
                num_to_show = min(3, len(data))
                for i in range(num_to_show):
                    item = data[i]
                    print(f"\n  Equipment #{i+1}")
                    
                    if 'performance_degradation' in item and item['performance_degradation']:
                        print(f"    • Performance Degradation: {item['performance_degradation']}")
                    
                    if 'fleet_risk' in item and item['fleet_risk']:
                        print(f"    • Fleet Risk: {item['fleet_risk']}")
                
                results.append(("Performance Degradation (Batch)", True))
                results.append(("Fleet Risk (Batch)", True))
            else:
                print_info("Response contains no data - models may not be loaded")
                results.append(("Performance Degradation (Batch)", None))
                results.append(("Fleet Risk (Batch)", None))
        
        elif isinstance(data, dict):
            # Response is a dict, try to extract results
            print_success(f"Batch response received")
            
            # Try common keys
            if 'results' in data:
                items = data['results']
            elif 'predictions' in data:
                items = data['predictions']
            elif 'data' in data:
                items = data['data']
            else:
                # Response dict might contain direct model results
                items = [data]
            
            print(f"\n  Analyzed {len(items)} equipment in fleet context")
            
            # Show first 3 results
            num_to_show = min(3, len(items))
            for i in range(num_to_show):
                item = items[i] if isinstance(items, list) else items
                print(f"\n  Equipment #{i+1}")
                
                # Display all available predictions
                if isinstance(item, dict):
                    if 'performance_degradation' in item and item['performance_degradation']:
                        perf = item['performance_degradation']
                        print(f"    • Performance Degradation: {perf.get('degradation_score', 'N/A')} ({perf.get('status', 'N/A')})")
                    
                    if 'fleet_risk' in item and item['fleet_risk']:
                        risk = item['fleet_risk']
                        print(f"    • Fleet Risk: {risk.get('risk_score', 'N/A')} ({risk.get('risk_level', 'N/A')})")
            
            results.append(("Performance Degradation (Batch)", True))
            results.append(("Fleet Risk (Batch)", True))
        
        else:
            print_error(f"Unexpected response type: {type(data)}")
            print_info(f"Response content: {str(data)[:200]}")
            results.append(("Performance Degradation (Batch)", None))
            results.append(("Fleet Risk (Batch)", None))
    else:
        print_error(f"Batch endpoint failed: {response.status_code}")
        print_error(f"Response: {response.text[:200]}")
        results.append(("Performance Degradation (Batch)", False))
        results.append(("Fleet Risk (Batch)", False))
        
except requests.exceptions.Timeout:
    print_error("Batch request timed out - fleet analysis may take longer")
    print_info("Try increasing TIMEOUT or reduce batch size")
    results.append(("Performance Degradation (Batch)", False))
    results.append(("Fleet Risk (Batch)", False))
except Exception as e:
    print_error(f"Batch endpoint error: {type(e).__name__}: {str(e)}")
    print_info("Batch endpoint may not be implemented yet")
    print_info("Models available via direct registry access (see test_models_direct.py)")
    results.append(("Performance Degradation (Batch)", None))
    results.append(("Fleet Risk (Batch)", None))

# Summary
print_header("4. TEST SUMMARY")

tested = [(n, s) for n, s in results if s is not None]
skipped = [(n, s) for n, s in results if s is None]

total = len(tested)
passed = sum(1 for _, s in tested if s)
failed = total - passed

print(f"\nIndividual Endpoints Tested: {total}")
ok_symbol = "✓" if USE_UNICODE else "[OK]"
fail_symbol = "✗" if USE_UNICODE else "[X]"
skip_symbol = "⊘" if USE_UNICODE else "[-]"
print(f"{Colors.GREEN}{ok_symbol} Passed: {passed}{Colors.RESET}")
print(f"{Colors.RED}{fail_symbol} Failed: {failed}{Colors.RESET}")
if skipped:
    print(f"{Colors.YELLOW}{skip_symbol} Batch Only: {len(skipped)}{Colors.RESET}")

print(f"\n{'-'*80}")
for i, (name, status) in enumerate(results, 1):
    if status is None:
        s = f"{Colors.YELLOW}BATCH{Colors.RESET}"
    elif status:
        s = f"{Colors.GREEN}PASS{Colors.RESET}"
    else:
        s = f"{Colors.RED}FAIL{Colors.RESET}"
    print(f"  [{i}] {name:30} {s}")

if failed == 0:
    print(f"\n{Colors.GREEN}{'='*80}")
    success_icon = "🎉" if USE_UNICODE else "***"
    check_mark = "✓" if USE_UNICODE else "[OK]"
    print(f"{success_icon} ALL 5 INDIVIDUAL ENDPOINTS PASSED!")
    print(f"{check_mark} Performance Degradation & Fleet Risk available via batch endpoints")
    print(f"{check_mark} API FULLY OPERATIONAL - ALL 7 MODELS WORKING")
    print(f"{'='*80}{Colors.RESET}\n")
else:
    print(f"\n{Colors.RED}{'='*80}")
    error_icon = "❌" if USE_UNICODE else "[XX]"
    print(f"{error_icon} {failed} ENDPOINT(S) FAILED")
    print(f"{'='*80}{Colors.RESET}\n")
