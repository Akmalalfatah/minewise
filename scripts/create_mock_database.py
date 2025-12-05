"""
Create Mock DuckDB Database for Testing
========================================

Creates a minimal DuckDB database with sample data for API testing.

Author: Capstone Team
Date: 2025-12-03
"""

import duckdb
import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta
import random

# Configuration
DB_PATH = Path("data/warehouse/mining_datawarehouse.duckdb")
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

print("Creating mock database for testing...")
print(f"Database path: {DB_PATH}")

# Create connection
conn = duckdb.connect(str(DB_PATH))

# ============================================================================
# Table 1: fct_produksi_harian (Daily Production)
# ============================================================================

print("\n1. Creating fct_produksi_harian...")

production_data = []
for i in range(7):
    date = datetime.now().date() - timedelta(days=i)
    production_data.append({
        'tanggal': date,
        'tonase_aktual': random.uniform(15000, 20000),
        'tonase_target': 18000,
        'batubara': random.uniform(10000, 13000),
        'overburden': random.uniform(5000, 7000)
    })

df_production = pd.DataFrame(production_data)
conn.execute("CREATE TABLE IF NOT EXISTS fct_produksi_harian AS SELECT * FROM df_production")
print(f"   ✓ Inserted {len(df_production)} records")

# ============================================================================
# Table 2: dim_cuaca_harian (Daily Weather)
# ============================================================================

print("\n2. Creating dim_cuaca_harian...")

weather_data = []
for i in range(7):
    date = datetime.now().date() - timedelta(days=i)
    weather_data.append({
        'tanggal': date,
        'curah_hujan_mm': random.uniform(0, 50),
        'kecepatan_angin_kmh': random.uniform(10, 40),
        'suhu_celsius': random.uniform(24, 32),
        'kelembapan_persen': random.uniform(60, 90),
        'jarak_pandang_m': random.uniform(3000, 10000),
        'tinggi_gelombang_m': random.uniform(0.5, 2.5),
        'kondisi_cuaca': random.choice(['Cerah', 'Berawan', 'Hujan'])
    })

df_weather = pd.DataFrame(weather_data)
conn.execute("CREATE TABLE IF NOT EXISTS dim_cuaca_harian AS SELECT * FROM df_weather")
print(f"   ✓ Inserted {len(df_weather)} records")

# ============================================================================
# Table 3: fct_operasional_alat (Equipment Operations)
# ============================================================================

print("\n3. Creating fct_operasional_alat...")

operations_data = []
equipment_ids = [f"EXC-00{i}" for i in range(1, 11)] + [f"DMP-0{i}" for i in range(1, 11)]

for equip_id in equipment_ids:
    for i in range(7):
        date = datetime.now().date() - timedelta(days=i)
        operations_data.append({
            'tanggal': date,
            'id_alat': equip_id,
            'jam_operasi': random.uniform(8, 20),
            'utilitas_persen': random.uniform(60, 95),
            'fuel_consumption': random.uniform(100, 200),
            'status_operasional': random.choice(['Operational', 'Operational', 'Operational', 'Maintenance'])
        })

df_operations = pd.DataFrame(operations_data)
conn.execute("CREATE TABLE IF NOT EXISTS fct_operasional_alat AS SELECT * FROM df_operations")
print(f"   ✓ Inserted {len(df_operations)} records")

# ============================================================================
# Table 4: dim_alat_berat (Heavy Equipment Inventory)
# ============================================================================

print("\n4. Creating dim_alat_berat...")

equipment_data = []
for i in range(1, 11):
    equipment_data.append({
        'id_alat': f"EXC-00{i}",
        'jenis_alat': 'Excavator',
        'model': f"CAT {random.choice(['390F', '395', '349'])}",
        'tahun_pembuatan': random.randint(2010, 2022),
        'status_operasional': random.choice(['Operational', 'Operational', 'Operational', 'Maintenance', 'Standby'])
    })

for i in range(1, 11):
    equipment_data.append({
        'id_alat': f"DMP-0{i}",
        'jenis_alat': 'Dump Truck',
        'model': f"Hitachi EH{random.choice(['3500', '4000', '5000'])}",
        'tahun_pembuatan': random.randint(2010, 2022),
        'status_operasional': random.choice(['Operational', 'Operational', 'Operational', 'Maintenance', 'Standby'])
    })

df_equipment = pd.DataFrame(equipment_data)
conn.execute("CREATE TABLE IF NOT EXISTS dim_alat_berat AS SELECT * FROM df_equipment")
print(f"   ✓ Inserted {len(df_equipment)} records")

# ============================================================================
# Table 5: fct_pemuatan_kapal (Vessel Loading)
# ============================================================================

print("\n5. Creating fct_pemuatan_kapal...")

vessels_data = []
for i in range(10):
    vessels_data.append({
        'tanggal': datetime.now().date() - timedelta(days=random.randint(0, 7)),
        'kode_kapal': f"V-2024-{str(i+1).zfill(3)}",
        'tonase_rencana': random.uniform(40000, 60000),
        'tonase_aktual': random.uniform(30000, 55000),
        'status_pemuatan': random.choice(['Loading', 'Loading', 'Waiting', 'Completed', 'Completed']),
        'waktu_mulai': datetime.now() - timedelta(hours=random.randint(1, 48)),
        'waktu_selesai': datetime.now() if random.random() > 0.5 else None
    })

df_vessels = pd.DataFrame(vessels_data)
conn.execute("CREATE TABLE IF NOT EXISTS fct_pemuatan_kapal AS SELECT * FROM df_vessels")
print(f"   ✓ Inserted {len(df_vessels)} records")

# ============================================================================
# Table 6: dim_infrastruktur_jalan (Road Infrastructure)
# ============================================================================

print("\n6. Creating dim_infrastruktur_jalan...")

road_data = []
for i in range(1, 16):
    road_data.append({
        'lokasi_kode': f"M{str(i).zfill(3)}",
        'panjang_segmen_m': random.uniform(1000, 3000),
        'status_jalan': random.choice(['BAIK', 'BAIK', 'BAIK', 'WASPADA', 'TERBATAS']),
        'kecepatan_rekomendasi_km_jam': random.uniform(30, 60)
    })

df_roads = pd.DataFrame(road_data)
conn.execute("CREATE TABLE IF NOT EXISTS dim_infrastruktur_jalan AS SELECT * FROM df_roads")
print(f"   ✓ Inserted {len(df_roads)} records")

# ============================================================================
# Verify Tables
# ============================================================================

print("\n" + "="*70)
print("Database Schema Summary:")
print("="*70)

tables = conn.execute("SHOW TABLES").fetchall()
for table in tables:
    table_name = table[0]
    count = conn.execute(f"SELECT COUNT(*) FROM {table_name}").fetchone()[0]
    print(f"  ✓ {table_name.ljust(30)} {count:>5} records")

print("\n" + "="*70)
print("✓ Mock database created successfully!")
print(f"Location: {DB_PATH.absolute()}")
print("="*70)

conn.close()
