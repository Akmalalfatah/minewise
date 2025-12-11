"""
Comprehensive ML Model Testing with Real Mining Data
Tests all 7 models with realistic mining operation scenarios
"""
import requests
import json
from datetime import datetime
from typing import Dict, Any

API_BASE_URL = "http://localhost:8000"

def print_header(title: str):
    """Print formatted section header"""
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80)

def print_result(model_name: str, response: Dict[Any, Any], scenario: str):
    """Print formatted test result"""
    import re
    print(f"\nModel: {model_name}")
    print(f"Scenario: {scenario}")
    print(f"Success: {response.get('success', False)}")
    print(f"Prediction: {response.get('prediction', 'N/A')}")
    print(f"Confidence: {response.get('confidence', 'N/A')}")
    print(f"Risk Level: {response.get('risk_level', 'N/A')}")
    print(f"Recommendations:")
    for rec in response.get('recommendations', []):
        # Remove emojis
        rec_clean = re.sub(r'[^\x00-\x7F]+', '', rec)
        print(f"   - {rec_clean}")
    print(f"Timestamp: {response.get('timestamp', 'N/A')}")

def test_road_speed():
    """Test Road Speed Prediction with real hauling road conditions"""
    print_header("1. ROAD SPEED PREDICTION MODEL")
    
    scenarios = [
        {
            "name": "Main Haul Road - Dry Condition",
            "payload": {
                "jenis_jalan": "UTAMA",
                "kondisi_permukaan": "KERING",
                "curah_hujan_mm": 0.0,
                "suhu_celcius": 32.5,
                "kecepatan_angin_ms": 3.2,
                "elevasi_mdpl": 450,
                "kemiringan_persen": 8.5,
                "beban_muatan_ton": 85.0,
                "jam_operasi": 10
            }
        },
        {
            "name": "Secondary Road - After Heavy Rain",
            "payload": {
                "jenis_jalan": "PENGHUBUNG",
                "kondisi_permukaan": "BASAH",
                "curah_hujan_mm": 45.0,
                "suhu_celcius": 28.0,
                "kecepatan_angin_ms": 5.5,
                "elevasi_mdpl": 380,
                "kemiringan_persen": 12.0,
                "beban_muatan_ton": 75.0,
                "jam_operasi": 14
            }
        },
        {
            "name": "Pit Access Road - Steep Uphill Muddy",
            "payload": {
                "jenis_jalan": "CABANG",
                "kondisi_permukaan": "BERLUMPUR",
                "curah_hujan_mm": 25.0,
                "suhu_celcius": 30.0,
                "kecepatan_angin_ms": 4.0,
                "elevasi_mdpl": 520,
                "kemiringan_persen": 18.0,
                "beban_muatan_ton": 90.0,
                "jam_operasi": 6
            }
        }
    ]
    
    for scenario in scenarios:
        try:
            response = requests.post(
                f"{API_BASE_URL}/predict/road-speed",
                json=scenario["payload"],
                timeout=10
            )
            if response.status_code == 200:
                print_result("Road Speed", response.json(), scenario["name"])
            else:
                print(f"[ERROR] Status {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[ERROR] Request failed: {str(e)}")

def test_cycle_time():
    """Test Cycle Time Prediction with real hauling operations"""
    print_header("2. CYCLE TIME PREDICTION MODEL")
    
    scenarios = [
        {
            "name": "Pit A to Port - Full Load",
            "payload": {
                "jarak_tempuh_km": 8.5,
                "kecepatan_prediksi_kmh": 25.0,
                "curah_hujan_mm": 0.0,
                "kondisi_jalan": "BAIK",
                "beban_muatan_ton": 95.0,
                "jumlah_stop": 1
            }
        },
        {
            "name": "Pit B to Crusher - Rainy Weather",
            "payload": {
                "jarak_tempuh_km": 6.2,
                "kecepatan_prediksi_kmh": 18.0,
                "curah_hujan_mm": 25.0,
                "kondisi_jalan": "BASAH",
                "beban_muatan_ton": 75.0,
                "jumlah_stop": 2
            }
        },
        {
            "name": "Short Haul - Optimal Conditions",
            "payload": {
                "jarak_tempuh_km": 3.5,
                "kecepatan_prediksi_kmh": 28.0,
                "curah_hujan_mm": 0.0,
                "kondisi_jalan": "BAIK",
                "beban_muatan_ton": 90.0,
                "jumlah_stop": 0
            }
        }
    ]
    
    for scenario in scenarios:
        try:
            response = requests.post(
                f"{API_BASE_URL}/predict/cycle-time",
                json=scenario["payload"],
                timeout=10
            )
            if response.status_code == 200:
                print_result("Cycle Time", response.json(), scenario["name"])
            else:
                print(f"[ERROR] {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[ERROR] Request failed: {e}")

def test_road_risk():
    """Test Road Risk Classification with real infrastructure data"""
    print_header("3. ROAD RISK CLASSIFICATION MODEL")
    
    scenarios = [
        {
            "name": "Main Highway - Low Risk (Dry, Light Rain)",
            "payload": {
                "curah_hujan_mm": 15.0,
                "intensitas_hujan": "RINGAN",
                "kecepatan_angin_ms": 3.5,
                "kondisi_permukaan": "KERING",
                "kedalaman_air_cm": 0.0,
                "indeks_friksi": 0.85,
                "visibilitas_m": 500.0,
                "kemiringan_persen": 6.0
            }
        },
        {
            "name": "Pit Access Road - High Risk (Heavy Rain, Flooded)",
            "payload": {
                "curah_hujan_mm": 120.0,
                "intensitas_hujan": "LEBAT",
                "kecepatan_angin_ms": 15.5,
                "kondisi_permukaan": "BERLUMPUR",
                "kedalaman_air_cm": 12.5,
                "indeks_friksi": 0.35,
                "visibilitas_m": 80.0,
                "kemiringan_persen": 15.0
            }
        },
        {
            "name": "Bypass Road - Moderate Risk (Moderate Rain, Wet)",
            "payload": {
                "curah_hujan_mm": 55.0,
                "intensitas_hujan": "SEDANG",
                "kecepatan_angin_ms": 8.5,
                "kondisi_permukaan": "BASAH",
                "kedalaman_air_cm": 4.5,
                "indeks_friksi": 0.58,
                "visibilitas_m": 180.0,
                "kemiringan_persen": 9.0
            }
        }
    ]
    
    for scenario in scenarios:
        try:
            response = requests.post(
                f"{API_BASE_URL}/predict/road-risk",
                json=scenario["payload"],
                timeout=10
            )
            if response.status_code == 200:
                print_result("Road Risk", response.json(), scenario["name"])
            else:
                print(f"[ERROR] {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[ERROR] Request failed: {e}")

def test_equipment_failure():
    """Test Equipment Failure Prediction with real fleet data"""
    print_header("4. EQUIPMENT FAILURE PREDICTION MODEL")
    
    scenarios = [
        {
            "name": "Excavator CAT 320 - Well Maintained",
            "payload": {
                "tipe_alat": "EXCAVATOR",
                "umur_tahun": 3,
                "jam_operasi": 8500.0,
                "jarak_tempuh_km": 25000.0,
                "jumlah_maintenance": 12,
                "jumlah_breakdown": 0,
                "days_since_last_maintenance": 15,
                "utilization_rate": 0.72
            }
        },
        {
            "name": "Dump Truck HD785 - High Risk",
            "payload": {
                "tipe_alat": "DUMP_TRUCK",
                "umur_tahun": 9,
                "jam_operasi": 28500.0,
                "jarak_tempuh_km": 145000.0,
                "jumlah_maintenance": 6,
                "jumlah_breakdown": 4,
                "days_since_last_maintenance": 45,
                "utilization_rate": 0.92
            }
        },
        {
            "name": "Loader 980K - Moderate Condition",
            "payload": {
                "tipe_alat": "LOADER",
                "umur_tahun": 5,
                "jam_operasi": 15000.0,
                "jarak_tempuh_km": 68000.0,
                "jumlah_maintenance": 8,
                "jumlah_breakdown": 1,
                "days_since_last_maintenance": 25,
                "utilization_rate": 0.78
            }
        }
    ]
    
    for scenario in scenarios:
        try:
            response = requests.post(
                f"{API_BASE_URL}/predict/equipment-failure",
                json=scenario["payload"],
                timeout=10
            )
            if response.status_code == 200:
                print_result("Equipment Failure", response.json(), scenario["name"])
            else:
                print(f"[ERROR] {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[ERROR] Request failed: {e}")

def test_port_operability():
    """Test Port Operability Prediction with real marine conditions"""
    print_header("5. PORT OPERABILITY PREDICTION MODEL")
    
    scenarios = [
        {
            "name": "Calm Weather - Full Operations",
            "payload": {
                "curah_hujan_mm": 0.0,
                "kecepatan_angin_ms": 6.2,
                "tinggi_gelombang_m": 0.8,
                "visibilitas_km": 15.0,
                "suhu_celcius": 30.0,
                "equipment_readiness": 0.95
            }
        },
        {
            "name": "Moderate Sea - Limited Operations",
            "payload": {
                "curah_hujan_mm": 15.0,
                "kecepatan_angin_ms": 14.4,
                "tinggi_gelombang_m": 2.5,
                "visibilitas_km": 8.0,
                "suhu_celcius": 27.0,
                "equipment_readiness": 0.78
            }
        },
        {
            "name": "Rough Sea - Operations Stopped",
            "payload": {
                "curah_hujan_mm": 35.0,
                "kecepatan_angin_ms": 21.6,
                "tinggi_gelombang_m": 4.2,
                "visibilitas_km": 3.0,
                "suhu_celcius": 25.0,
                "equipment_readiness": 0.45
            }
        }
    ]
    
    for scenario in scenarios:
        try:
            response = requests.post(
                f"{API_BASE_URL}/predict/port-operability",
                json=scenario["payload"],
                timeout=10
            )
            if response.status_code == 200:
                print_result("Port Operability", response.json(), scenario["name"])
            else:
                print(f"[ERROR] {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[ERROR] Request failed: {e}")

def test_performance_degradation():
    """Test Performance Degradation Prediction with real equipment data"""
    print_header("6. PERFORMANCE DEGRADATION PREDICTION MODEL")
    
    scenarios = [
        {
            "name": "New Equipment - Optimal Performance",
            "payload": {
                "equipment_age_years": 1.5,
                "jam_operasi": 3500.0,
                "beban_rata_rata_ton": 92.0,
                "kecepatan_rata_rata_kmh": 26.0,
                "frekuensi_maintenance": 12,
                "jumlah_breakdown": 0,
                "utilization_rate": 0.68
            }
        },
        {
            "name": "Mid-Life Equipment - Moderate Degradation",
            "payload": {
                "equipment_age_years": 5.5,
                "jam_operasi": 12500.0,
                "beban_rata_rata_ton": 85.0,
                "kecepatan_rata_rata_kmh": 22.5,
                "frekuensi_maintenance": 10,
                "jumlah_breakdown": 2,
                "utilization_rate": 0.78
            }
        },
        {
            "name": "Old Equipment - High Degradation",
            "payload": {
                "equipment_age_years": 10.0,
                "jam_operasi": 25000.0,
                "beban_rata_rata_ton": 70.0,
                "kecepatan_rata_rata_kmh": 18.0,
                "frekuensi_maintenance": 6,
                "jumlah_breakdown": 8,
                "utilization_rate": 0.95
            }
        }
    ]
    
    for scenario in scenarios:
        try:
            response = requests.post(
                f"{API_BASE_URL}/predict/performance-degradation",
                json=scenario["payload"],
                timeout=10
            )
            if response.status_code == 200:
                result = response.json()
                import re
                print(f"\nModel: Performance Degradation")
                print(f"Scenario: {scenario['name']}")
                print(f"Success: {result.get('success', False)}")
                print(f"Efficiency: {result.get('prediction', 'N/A')}%")
                print(f"Confidence: {result.get('confidence', 'N/A')}")
                print(f"Risk Level: {result.get('risk_level', 'N/A')}")
                print(f"Recommendations:")
                for rec in result.get('recommendations', []):
                    rec_clean = re.sub(r'[^\x00-\x7F]+', '', rec)
                    print(f"   - {rec_clean}")
                print(f"Timestamp: {result.get('timestamp', 'N/A')}")
            else:
                print(f"[ERROR] {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[ERROR] Request failed: {e}")

def test_fleet_risk():
    """Test Fleet Risk Scoring with real fleet management data"""
    print_header("7. FLEET RISK SCORING MODEL")
    
    scenarios = [
        {
            "name": "Well-Managed Fleet - Low Risk",
            "payload": {
                "total_unit": 50,
                "umur_rata_rata_tahun": 4.5,
                "utilisasi_persen": 72.0,
                "frekuensi_breakdown": 8,
                "skor_maintenance": 85.0,
                "equipment_readiness": 0.92,
                "jumlah_unit_critical": 2
            }
        },
        {
            "name": "Aging Fleet - High Risk",
            "payload": {
                "total_unit": 35,
                "umur_rata_rata_tahun": 8.5,
                "utilisasi_persen": 88.0,
                "frekuensi_breakdown": 28,
                "skor_maintenance": 58.0,
                "equipment_readiness": 0.68,
                "jumlah_unit_critical": 8
            }
        },
        {
            "name": "Mixed Fleet - Moderate Risk",
            "payload": {
                "total_unit": 42,
                "umur_rata_rata_tahun": 6.0,
                "utilisasi_persen": 78.0,
                "frekuensi_breakdown": 15,
                "skor_maintenance": 72.0,
                "equipment_readiness": 0.82,
                "jumlah_unit_critical": 4
            }
        }
    ]
    
    for scenario in scenarios:
        try:
            response = requests.post(
                f"{API_BASE_URL}/predict/fleet-risk",
                json=scenario["payload"],
                timeout=10
            )
            if response.status_code == 200:
                print_result("Fleet Risk", response.json(), scenario["name"])
            else:
                print(f"[ERROR] {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[ERROR] Request failed: {e}")

def run_all_tests():
    """Run all model tests"""
    start_time = datetime.now()
    
    print("\n" + "="*80)
    print("  COMPREHENSIVE ML MODEL TESTING - REAL MINING DATA")
    print("  Testing 7 Models with 21 Real-World Scenarios")
    print("="*80)
    print(f"\nTest Started: {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"API Base URL: {API_BASE_URL}")
    
    try:
        # Test each model
        test_road_speed()
        test_cycle_time()
        test_road_risk()
        test_equipment_failure()
        test_port_operability()
        test_performance_degradation()
        test_fleet_risk()
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        print("\n" + "="*80)
        print(f"  ALL TESTS COMPLETED")
        print(f"  Duration: {duration:.2f} seconds")
        print(f"  Average: {duration/21:.2f} seconds per prediction")
        print("="*80 + "\n")
        
    except Exception as e:
        print(f"\n[ERROR] Test suite failed: {str(e)}")

if __name__ == "__main__":
    run_all_tests()
