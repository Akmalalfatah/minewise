"""
Database Connection Manager
Handles PostgreSQL connection untuk production data access

Author: ML Team
Date: December 9, 2025
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
import pandas as pd
import os
from typing import Optional, Dict, Any, List
import logging
from contextlib import contextmanager

logger = logging.getLogger(__name__)

class DatabaseManager:
    """
    Singleton Database Manager
    Manages connection pool dan query execution
    """
    
    _instance = None
    _engine = None
    _SessionLocal = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize database connection"""
        if self._engine is None:
            self._initialize_connection()
    
    def _initialize_connection(self):
        """Setup database engine dan connection pool"""
        try:
            # Get database URL from environment variable
            database_url = os.getenv(
                "DATABASE_URL",
                "postgresql://user:password@localhost:5432/minewise_db"
            )
            
            # Create engine with connection pooling
            self._engine = create_engine(
                database_url,
                poolclass=QueuePool,
                pool_size=10,
                max_overflow=20,
                pool_pre_ping=True,  # Verify connections before using
                pool_recycle=3600,   # Recycle connections after 1 hour
                echo=False           # Set True for SQL debugging
            )
            
            # Create session factory
            self._SessionLocal = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self._engine
            )
            
            # Test connection
            with self._engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            
            logger.info("✓ Database connection established successfully")
            
        except Exception as e:
            logger.error(f"✗ Failed to initialize database connection: {e}")
            raise
    
    @contextmanager
    def get_session(self) -> Session:
        """
        Context manager untuk database session
        
        Usage:
            with db_manager.get_session() as session:
                result = session.execute(query)
        """
        session = self._SessionLocal()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            session.close()
    
    def execute_query(self, query: str, params: Optional[Dict[str, Any]] = None) -> pd.DataFrame:
        """
        Execute SQL query dan return sebagai pandas DataFrame
        
        Args:
            query: SQL query string
            params: Dictionary of query parameters
        
        Returns:
            pandas DataFrame dengan query results
        """
        try:
            with self._engine.connect() as conn:
                if params:
                    result = pd.read_sql(text(query), conn, params=params)
                else:
                    result = pd.read_sql(text(query), conn)
            
            logger.debug(f"Query executed successfully. Rows returned: {len(result)}")
            return result
            
        except Exception as e:
            logger.error(f"Query execution error: {e}")
            logger.error(f"Query: {query}")
            raise
    
    def execute_raw(self, query: str, params: Optional[Dict[str, Any]] = None) -> Any:
        """
        Execute raw SQL query (INSERT, UPDATE, DELETE)
        
        Args:
            query: SQL query string
            params: Dictionary of query parameters
        
        Returns:
            Query execution result
        """
        try:
            with self._engine.connect() as conn:
                result = conn.execute(text(query), params or {})
                conn.commit()
            
            logger.debug(f"Raw query executed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Raw query execution error: {e}")
            logger.error(f"Query: {query}")
            raise
    
    def get_table_columns(self, table_name: str, schema: str = "public") -> List[str]:
        """
        Get column names dari table
        
        Args:
            table_name: Nama table
            schema: Database schema (default: public)
        
        Returns:
            List of column names
        """
        query = """
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = :schema 
            AND table_name = :table_name
            ORDER BY ordinal_position
        """
        
        try:
            df = self.execute_query(query, {"schema": schema, "table_name": table_name})
            return df['column_name'].tolist()
        except Exception as e:
            logger.error(f"Failed to get columns for {table_name}: {e}")
            return []
    
    def test_connection(self) -> bool:
        """
        Test database connection
        
        Returns:
            True if connection successful, False otherwise
        """
        try:
            with self._engine.connect() as conn:
                result = conn.execute(text("SELECT 1 as test"))
                return result.fetchone()[0] == 1
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False
    
    def close(self):
        """Close database connection pool"""
        if self._engine:
            self._engine.dispose()
            logger.info("Database connection pool closed")


# Global database manager instance
db_manager = DatabaseManager()


# Helper functions untuk common queries
def get_latest_weather_data(location: str) -> pd.DataFrame:
    """Get latest weather data untuk specific location"""
    query = """
        SELECT 
            curah_hujan,
            kecepatan_angin,
            visibilitas,
            suhu_min,
            suhu_max,
            kelembaban,
            tekanan_udara,
            petir,
            tanggal
        FROM dim_cuaca_harian
        WHERE lokasi = :location
        ORDER BY tanggal DESC
        LIMIT 1
    """
    return db_manager.execute_query(query, {"location": location})


def get_equipment_operational_data(location: str, date: Optional[str] = None) -> pd.DataFrame:
    """Get equipment operational data"""
    query = """
        SELECT 
            alat_id,
            jam_operasi,
            jam_maintenance,
            status_alat,
            lokasi,
            tanggal
        FROM fct_operasional_alat_relatif_2
        WHERE lokasi = :location
    """
    
    params = {"location": location}
    
    if date:
        query += " AND tanggal = :date"
        params["date"] = date
    else:
        query += " ORDER BY tanggal DESC LIMIT 100"
    
    return db_manager.execute_query(query, params)


def get_equipment_master_data() -> pd.DataFrame:
    """Get equipment master data"""
    query = """
        SELECT 
            alat_id,
            tipe_alat,
            model,
            kondisi,
            status
        FROM dim_alat_berat_relatif_2
        ORDER BY alat_id
    """
    return db_manager.execute_query(query)


def get_road_conditions(location: str) -> pd.DataFrame:
    """Get road condition data"""
    query = """
        SELECT 
            segment_jalan,
            friction_index,
            kedalaman_air,
            kecepatan_aktual,
            batas_kecepatan,
            status_jalan,
            waktu_tempuh,
            lokasi,
            tanggal
        FROM fct_kondisi_jalan
        WHERE lokasi = :location
        ORDER BY tanggal DESC
        LIMIT 10
    """
    return db_manager.execute_query(query, {"location": location})


def get_vessel_loading_data() -> pd.DataFrame:
    """Get vessel loading data"""
    query = """
        SELECT 
            nama_kapal,
            eta,
            etb,
            etd,
            laycan_start,
            laycan_end,
            tujuan,
            status_kapal,
            progress_loading,
            tonase_dimuat,
            tonase_target,
            last_update
        FROM fct_pemuatan_kapal
        ORDER BY eta DESC
        LIMIT 10
    """
    return db_manager.execute_query(query)


def get_production_summary(location: str, date: Optional[str] = None) -> Dict[str, Any]:
    """Get production summary untuk dashboard"""
    query = """
        SELECT 
            SUM(tonase_produksi) as total_produksi,
            AVG(tonase_produksi) as avg_produksi,
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
        return {"total_produksi": 0, "avg_produksi": 0, "jumlah_operasi": 0}
    
    return df.iloc[0].to_dict()


# Test function
def test_database_connection():
    """Test database connection dan basic queries"""
    print("Testing Database Connection...")
    print("=" * 80)
    
    # Test 1: Connection
    print("\n1. Testing connection...")
    if db_manager.test_connection():
        print("   ✓ Connection successful")
    else:
        print("   ✗ Connection failed")
        return False
    
    # Test 2: Weather data
    print("\n2. Testing weather data query...")
    try:
        weather_df = get_latest_weather_data("PIT A")
        print(f"   ✓ Weather data: {len(weather_df)} rows")
        if not weather_df.empty:
            print(f"   Latest data: {weather_df.iloc[0].to_dict()}")
    except Exception as e:
        print(f"   ✗ Weather query failed: {e}")
    
    # Test 3: Equipment data
    print("\n3. Testing equipment data query...")
    try:
        equipment_df = get_equipment_master_data()
        print(f"   ✓ Equipment master data: {len(equipment_df)} rows")
    except Exception as e:
        print(f"   ✗ Equipment query failed: {e}")
    
    # Test 4: Production summary
    print("\n4. Testing production summary...")
    try:
        prod_summary = get_production_summary("PIT A")
        print(f"   ✓ Production summary: {prod_summary}")
    except Exception as e:
        print(f"   ✗ Production query failed: {e}")
    
    print("\n" + "=" * 80)
    print("Database connection test completed!")
    return True


if __name__ == "__main__":
    # Run connection test
    test_database_connection()
