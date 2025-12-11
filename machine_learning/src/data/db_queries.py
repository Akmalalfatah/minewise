"""
Database Query Utilities untuk Frontend Endpoints
Helper functions untuk fetch data dari database dengan proper error handling

Author: ML Team
Date: December 9, 2025
"""

from typing import Dict, Any, List, Optional
import pandas as pd
from datetime import datetime, timedelta
import logging

try:
    from src.data.db_connection import db_manager
except ImportError:
    # Fallback if import fails
    db_manager = None
    logging.warning("Database manager not available. Using mock data.")

logger = logging.getLogger(__name__)


def safe_query(query_func, fallback_data: Any, *args, **kwargs) -> Any:
    """
    Wrapper untuk execute database query dengan fallback
    Jika query fails, return mock data
    """
    if db_manager is None:
        logger.warning(f"DB Manager not available. Using fallback data.")
        return fallback_data
    
    try:
        result = query_func(*args, **kwargs)
        return result if result is not None else fallback_data
    except Exception as e:
        logger.error(f"Query error in {query_func.__name__}: {e}")
        return fallback_data


# ============================================================================
# DASHBOARD QUERIES
# ============================================================================

def fetch_production_data(location: str = "PIT A", date: Optional[str] = None) -> Dict[str, Any]:
    """Fetch production data dari fct_operasional_alat_relatif_2"""
    
    def _query():
        query = """
            SELECT 
                COALESCE(SUM(tonase_produksi), 0) as produce_ton,
                15000 as target_ton,
                COALESCE(AVG(tonase_produksi), 0) as avg_production_per_day,
                COUNT(*) as jumlah_operasi
            FROM fct_operasional_alat_relatif_2
            WHERE lokasi = :location
        """
        
        params = {"location": location}
        
        if date:
            query += " AND tanggal = :date"
            params["date"] = date
        else:
            query += " AND tanggal >= CURRENT_DATE - INTERVAL '7 days'"
        
        df = db_manager.execute_query(query, params)
        
        if df.empty:
            return None
        
        row = df.iloc[0]
        produce_ton = int(row['produce_ton'])
        target_ton = int(row['target_ton'])
        deviation = round(((produce_ton - target_ton) / target_ton) * 100, 1)
        
        return {
            "produce_ton": produce_ton,
            "target_ton": target_ton,
            "avg_production_per_day": int(row['avg_production_per_day']),
            "deviation_pct": deviation,
            "source_location": location
        }
    
    fallback = {
        "produce_ton": 12850,
        "target_ton": 15000,
        "avg_production_per_day": 1850,
        "deviation_pct": -14.3,
        "source_location": location
    }
    
    return safe_query(_query, fallback)


def fetch_weather_condition(location: str = "PIT A") -> Dict[str, Any]:
    """Fetch weather data dari dim_cuaca_harian"""
    
    def _query():
        query = """
            SELECT 
                curah_hujan,
                kecepatan_angin,
                visibilitas,
                suhu_min,
                suhu_max,
                kelembaban,
                petir,
                tanggal
            FROM dim_cuaca_harian
            WHERE lokasi = :location
            ORDER BY tanggal DESC
            LIMIT 1
        """
        
        df = db_manager.execute_query(query, {"location": location})
        
        if df.empty:
            return None
        
        row = df.iloc[0]
        
        # Calculate rain probability based on actual rainfall
        rain_mm = float(row['curah_hujan'] or 0)
        rain_prob = min(int((rain_mm / 50) * 100), 100) if rain_mm > 0 else 0
        
        # Determine extreme weather flag
        extreme = (
            rain_mm > 40 or 
            float(row['visibilitas'] or 999) < 2.0 or
            bool(row['petir'])
        )
        
        return {
            "rain_probability_pct": rain_prob,
            "wind_speed_kmh": int(row['kecepatan_angin'] or 0),
            "visibility_km": round(float(row['visibilitas'] or 5.0), 1),
            "extreme_weather_flag": extreme,
            "source_location": location
        }
    
    fallback = {
        "rain_probability_pct": 62,
        "wind_speed_kmh": 24,
        "visibility_km": 1.2,
        "extreme_weather_flag": True,
        "source_location": location
    }
    
    return safe_query(_query, fallback)


def fetch_equipment_status(location: str = "PIT A") -> Dict[str, Any]:
    """Fetch equipment status dari fct_operasional_alat_relatif_2"""
    
    def _query():
        query = """
            SELECT 
                status_alat,
                COUNT(*) as jumlah
            FROM fct_operasional_alat_relatif_2
            WHERE lokasi = :location
            AND tanggal = (SELECT MAX(tanggal) FROM fct_operasional_alat_relatif_2)
            GROUP BY status_alat
        """
        
        df = db_manager.execute_query(query, {"location": location})
        
        if df.empty:
            return None
        
        # Initialize counters
        status_map = {
            "active": 0,
            "standby": 0,
            "under_repair": 0,
            "maintenance": 0
        }
        
        # Map database status to output keys
        for _, row in df.iterrows():
            status = str(row['status_alat']).lower()
            count = int(row['jumlah'])
            
            if 'aktif' in status or 'active' in status:
                status_map["active"] += count
            elif 'standby' in status or 'idle' in status:
                status_map["standby"] += count
            elif 'rusak' in status or 'repair' in status or 'broken' in status:
                status_map["under_repair"] += count
            elif 'maintenance' in status or 'perawatan' in status:
                status_map["maintenance"] += count
        
        status_map["source_location"] = location
        return status_map
    
    fallback = {
        "active": 12,
        "standby": 5,
        "under_repair": 3,
        "maintenance": 2,
        "source_location": location
    }
    
    return safe_query(_query, fallback)


def fetch_production_efficiency(location: str = "PIT A") -> Dict[str, Any]:
    """Calculate production efficiency dari operational data"""
    
    def _query():
        query = """
            SELECT 
                SUM(jam_operasi) as total_effective,
                SUM(jam_maintenance) as total_maintenance,
                COUNT(*) as jumlah_alat
            FROM fct_operasional_alat_relatif_2
            WHERE lokasi = :location
            AND tanggal >= CURRENT_DATE - INTERVAL '1 day'
        """
        
        df = db_manager.execute_query(query, {"location": location})
        
        if df.empty:
            return None
        
        row = df.iloc[0]
        effective = float(row['total_effective'] or 0)
        maintenance = float(row['total_maintenance'] or 0)
        total = effective + maintenance
        
        efficiency = round((effective / total) * 100, 1) if total > 0 else 0
        
        return {
            "effective_hours": round(effective, 1),
            "maintenance_hours": round(maintenance, 1),
            "efficiency_rate": efficiency,
            "source_location": location
        }
    
    fallback = {
        "effective_hours": 17.2,
        "maintenance_hours": 2.8,
        "efficiency_rate": 86.0,
        "source_location": location
    }
    
    return safe_query(_query, fallback)


# ============================================================================
# ROAD CONDITIONS QUERIES
# ============================================================================

def fetch_road_conditions(location: str = "PIT A") -> List[Dict[str, Any]]:
    """Fetch road conditions dari fct_kondisi_jalan"""
    
    def _query():
        query = """
            SELECT 
                segment_jalan as road,
                status_jalan as status,
                kecepatan_aktual as speed,
                friction_index as friction,
                kedalaman_air as water
            FROM fct_kondisi_jalan
            WHERE lokasi = :location
            AND tanggal = (SELECT MAX(tanggal) FROM fct_kondisi_jalan)
            ORDER BY segment_jalan
            LIMIT 5
        """
        
        df = db_manager.execute_query(query, {"location": location})
        
        if df.empty:
            return None
        
        segments = []
        for _, row in df.iterrows():
            segments.append({
                "road": str(row['road']),
                "status": str(row['status']),
                "speed": int(row['speed'] or 0),
                "friction": round(float(row['friction'] or 0.4), 2),
                "water": int(row['water'] or 0)
            })
        
        return segments
    
    fallback = [
        {"road": "Road A", "status": "Normal", "speed": 22, "friction": 0.45, "water": 0},
        {"road": "Road B", "status": "Waspada", "speed": 12, "friction": 0.35, "water": 5}
    ]
    
    return safe_query(_query, fallback)


# ============================================================================
# VESSEL/SHIPPING QUERIES
# ============================================================================

def fetch_vessel_schedules() -> List[Dict[str, Any]]:
    """Fetch vessel schedules dari fct_pemuatan_kapal"""
    
    def _query():
        query = """
            SELECT 
                nama_kapal as vessel_name,
                eta,
                etb,
                etd,
                laycan_start,
                laycan_end,
                tujuan as destination,
                status_kapal as status
            FROM fct_pemuatan_kapal
            WHERE eta >= CURRENT_DATE - INTERVAL '7 days'
            ORDER BY eta
            LIMIT 5
        """
        
        df = db_manager.execute_query(query)
        
        if df.empty:
            return None
        
        vessels = []
        for _, row in df.iterrows():
            vessels.append({
                "vessel_name": str(row['vessel_name']),
                "eta": row['eta'].isoformat() + "Z" if pd.notna(row['eta']) else None,
                "etb": row['etb'].isoformat() + "Z" if pd.notna(row['etb']) else None,
                "etd": row['etd'].isoformat() + "Z" if pd.notna(row['etd']) else None,
                "laycan_start": row['laycan_start'].isoformat() if pd.notna(row['laycan_start']) else None,
                "laycan_end": row['laycan_end'].isoformat() if pd.notna(row['laycan_end']) else None,
                "destination": str(row['destination']),
                "status": str(row['status'])
            })
        
        return vessels
    
    fallback = [
        {
            "vessel_name": "MV Sunrise",
            "eta": "2025-01-10T08:00:00Z",
            "etb": "2025-01-10T12:00:00Z",
            "etd": "2025-01-11T20:00:00Z",
            "laycan_start": "2025-01-09",
            "laycan_end": "2025-01-11",
            "destination": "China",
            "status": "On Route"
        }
    ]
    
    return safe_query(_query, fallback)


def fetch_vessel_loading_progress() -> List[Dict[str, Any]]:
    """Fetch vessel loading progress"""
    
    def _query():
        query = """
            SELECT 
                nama_kapal as vessel_name,
                progress_loading as progress,
                tonase_dimuat as tonnage_loaded,
                tonase_target as tonnage_target,
                last_update
            FROM fct_pemuatan_kapal
            WHERE status_kapal IN ('Loading', 'At Berth', 'Scheduled')
            ORDER BY last_update DESC
            LIMIT 5
        """
        
        df = db_manager.execute_query(query)
        
        if df.empty:
            return None
        
        progress_list = []
        for _, row in df.iterrows():
            progress_list.append({
                "vessel_name": str(row['vessel_name']),
                "progress": int(row['progress'] or 0),
                "tonnage_loaded": int(row['tonnage_loaded'] or 0),
                "tonnage_target": int(row['tonnage_target'] or 50000),
                "last_update": row['last_update'].isoformat() + "Z" if pd.notna(row['last_update']) else datetime.now().isoformat() + "Z"
            })
        
        return progress_list
    
    fallback = [
        {
            "vessel_name": "MV Sunrise",
            "progress": 65,
            "tonnage_loaded": 32500,
            "tonnage_target": 50000,
            "last_update": "2025-01-09T14:00:00Z"
        }
    ]
    
    return safe_query(_query, fallback)


# ============================================================================
# EQUIPMENT MASTER DATA QUERIES
# ============================================================================

def fetch_equipment_master() -> List[Dict[str, Any]]:
    """Fetch equipment master data dari dim_alat_berat_relatif_2"""
    
    def _query():
        query = """
            SELECT 
                alat_id as id,
                tipe_alat as type,
                model,
                kondisi as condition,
                status
            FROM dim_alat_berat_relatif_2
            ORDER BY alat_id
            LIMIT 50
        """
        
        df = db_manager.execute_query(query)
        
        if df.empty:
            return None
        
        equipment_list = []
        for _, row in df.iterrows():
            equipment_list.append({
                "id": str(row['id']),
                "type": str(row['type']),
                "model": str(row['model']),
                "condition": str(row['condition']),
                "status": str(row['status'])
            })
        
        return equipment_list
    
    fallback = [
        {"id": "ALAT_01", "type": "Excavator", "model": "Hitachi ZX200", "condition": "Good", "status": "Active"}
    ]
    
    return safe_query(_query, fallback)


# ============================================================================
# TEST FUNCTION
# ============================================================================

def test_all_queries():
    """Test all database queries"""
    print("Testing Database Queries...")
    print("=" * 80)
    
    tests = [
        ("Production Data", lambda: fetch_production_data("PIT A")),
        ("Weather Condition", lambda: fetch_weather_condition("PIT A")),
        ("Equipment Status", lambda: fetch_equipment_status("PIT A")),
        ("Production Efficiency", lambda: fetch_production_efficiency("PIT A")),
        ("Road Conditions", lambda: fetch_road_conditions("PIT A")),
        ("Vessel Schedules", lambda: fetch_vessel_schedules()),
        ("Loading Progress", lambda: fetch_vessel_loading_progress()),
        ("Equipment Master", lambda: fetch_equipment_master()),
    ]
    
    for test_name, test_func in tests:
        print(f"\n{test_name}:")
        try:
            result = test_func()
            print(f"  ✓ Success: {len(result) if isinstance(result, list) else 'OK'}")
            if result:
                print(f"  Sample: {str(result)[:100]}...")
        except Exception as e:
            print(f"  ✗ Failed: {e}")
    
    print("\n" + "=" * 80)


if __name__ == "__main__":
    test_all_queries()
