"""
Script untuk extract dan prepare data infrastructure dari dataset_rancangan.xlsx
Untuk EDA Infrastructure: Road Conditions dan Weather Analysis
"""

import pandas as pd
import os
from pathlib import Path

# Setup paths
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DATA = BASE_DIR / 'data' / 'raw' / 'dataset_rancangan.xlsx'
PROCESSED_DIR = BASE_DIR / 'data' / 'processed'

print("=" * 80)
print("EXTRACT INFRASTRUCTURE DATA FROM EXCEL")
print("=" * 80)

# Load Excel file
print(f"\nLoading Excel file: {RAW_DATA}")
xl = pd.ExcelFile(RAW_DATA)
print(f"Total sheets: {len(xl.sheet_names)}")

# Extract Road Conditions Data (Sheet 9: fct_kondisi_jalan)
print("\n" + "-" * 80)
print("EXTRACTING: fct_kondisi_jalan (Road Conditions)")
print("-" * 80)

df_roads = pd.read_excel(RAW_DATA, sheet_name='fct_kondisi_jalan')
print(f"Shape: {df_roads.shape}")
print(f"\nColumns:")
for i, col in enumerate(df_roads.columns, 1):
    print(f"  {i}. {col}")

print(f"\nFirst 3 rows:")
print(df_roads.head(3))

# Save to processed folder
output_roads = PROCESSED_DIR / 'fct_kondisi_jalan.csv'
df_roads.to_csv(output_roads, index=False)
print(f"\n✓ Saved to: {output_roads}")

# Extract Weather Data (Sheet 7: dim_cuaca_harian)
print("\n" + "-" * 80)
print("EXTRACTING: dim_cuaca_harian (Weather Data)")
print("-" * 80)

# Read with header=1 to use row 1 as column names
df_weather = pd.read_excel(RAW_DATA, sheet_name='dim_cuaca_harian', header=1)

# Row pertama adalah nama kolom yang sebenarnya
if df_weather.iloc[0, 0] == 'id_cuaca':
    # Set row pertama sebagai column names
    df_weather.columns = df_weather.iloc[0]
    df_weather = df_weather.iloc[1:]  # Remove row pertama
    df_weather = df_weather.reset_index(drop=True)

# Drop rows yang NaN di kolom penting
df_weather = df_weather.dropna(subset=df_weather.columns[0:3], how='all')

print(f"Shape: {df_weather.shape}")
print(f"\nColumns:")
for i, col in enumerate(df_weather.columns, 1):
    print(f"  {i}. {col}")

print(f"\nFirst 5 rows:")
print(df_weather.head(5))

# Save to processed folder
output_weather = PROCESSED_DIR / 'dim_cuaca_harian.csv'
df_weather.to_csv(output_weather, index=False)
print(f"\n✓ Saved to: {output_weather}")

# Data Quality Check
print("\n" + "=" * 80)
print("DATA QUALITY CHECK")
print("=" * 80)

print("\n1. ROAD CONDITIONS DATA")
print(f"   Total rows: {len(df_roads):,}")
print(f"   Total columns: {len(df_roads.columns)}")
print(f"   Missing values per column:")
for col in df_roads.columns:
    missing = df_roads[col].isnull().sum()
    if missing > 0:
        pct = (missing / len(df_roads)) * 100
        print(f"     - {col}: {missing} ({pct:.2f}%)")
    else:
        print(f"     - {col}: 0 (0.00%)")

print("\n2. WEATHER DATA")
print(f"   Total rows: {len(df_weather):,}")
print(f"   Total columns: {len(df_weather.columns)}")
print(f"   Missing values per column:")
for col in df_weather.columns:
    missing = df_weather[col].isnull().sum()
    if missing > 0:
        pct = (missing / len(df_weather)) * 100
        print(f"     - {col}: {missing} ({pct:.2f}%)")
    else:
        print(f"     - {col}: 0 (0.00%)")

# Date range check
if 'timestamp_utc' in df_roads.columns:
    df_roads['timestamp_utc'] = pd.to_datetime(df_roads['timestamp_utc'])
    print(f"\n3. ROAD DATA DATE RANGE")
    print(f"   Start: {df_roads['timestamp_utc'].min()}")
    print(f"   End: {df_roads['timestamp_utc'].max()}")
    print(f"   Duration: {(df_roads['timestamp_utc'].max() - df_roads['timestamp_utc'].min()).days} days")

if 'tanggal' in df_weather.columns:
    df_weather['tanggal'] = pd.to_datetime(df_weather['tanggal'], errors='coerce')
    df_weather = df_weather.dropna(subset=['tanggal'])  # Remove invalid dates
    print(f"\n4. WEATHER DATA DATE RANGE")
    print(f"   Start: {df_weather['tanggal'].min()}")
    print(f"   End: {df_weather['tanggal'].max()}")
    print(f"   Duration: {(df_weather['tanggal'].max() - df_weather['tanggal'].min()).days} days")

print("\n" + "=" * 80)
print("SUCCESS! Infrastructure data ready for EDA")
print("=" * 80)
print(f"\nOutput files:")
print(f"  1. {output_roads}")
print(f"  2. {output_weather}")
print("\nNext step: Run EDA_Infrastructure_Roads_Weather.ipynb")
