"""
Data Loader Module
Utilities untuk loading dataset dari berbagai format (Excel, CSV, Parquet)
"""

import pandas as pd
import yaml
from pathlib import Path
from typing import Union, Dict, List, Optional


class DataLoader:
    """Class untuk loading dan managing dataset"""
    
    def __init__(self, config_path: str = "configs/config.yaml"):
        """
        Initialize DataLoader dengan configuration file
        
        Args:
            config_path: Path ke config YAML file
        """
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        self.data_raw_path = Path(self.config['paths']['data_raw'])
        self.data_processed_path = Path(self.config['paths']['data_processed'])
        
    def load_excel(
        self, 
        filename: str, 
        sheet_name: Optional[Union[str, int, List]] = 0,
        **kwargs
    ) -> Union[pd.DataFrame, Dict[str, pd.DataFrame]]:
        """
        Load Excel file
        
        Args:
            filename: Nama file Excel
            sheet_name: Sheet name atau list of sheet names
            **kwargs: Additional arguments untuk pd.read_excel
            
        Returns:
            DataFrame atau dict of DataFrames
        """
        filepath = self.data_raw_path / filename
        print(f"Loading {filepath}...")
        
        df = pd.read_excel(filepath, sheet_name=sheet_name, **kwargs)
        
        if isinstance(df, dict):
            print(f"Loaded {len(df)} sheets: {list(df.keys())}")
        else:
            print(f"Loaded shape: {df.shape}")
        
        return df
    
    def load_csv(
        self, 
        filename: str, 
        **kwargs
    ) -> pd.DataFrame:
        """
        Load CSV file
        
        Args:
            filename: Nama file CSV
            **kwargs: Additional arguments untuk pd.read_csv
            
        Returns:
            DataFrame
        """
        filepath = self.data_raw_path / filename
        print(f"Loading {filepath}...")
        
        encoding = kwargs.pop('encoding', self.config['data']['encoding'])
        df = pd.read_csv(filepath, encoding=encoding, **kwargs)
        
        print(f"Loaded shape: {df.shape}")
        return df
    
    def load_main_datasets(self) -> Dict[str, pd.DataFrame]:
        """
        Load semua main datasets sesuai config
        
        Returns:
            Dictionary of DataFrames
        """
        datasets = {}
        
        # Assuming main dataset is in Excel
        main_file = "dataset_rancangan.xlsx"
        sheets = self.load_excel(main_file, sheet_name=None)
        
        # Map sheet names ke dataset names
        dataset_mapping = {
            'fct_operasional_alat_relatif_2': 'equipment_operations',
            'dim_alat_berat_relatif_2': 'equipment_master',
            'fct_kondisi_jalan': 'road_conditions',
            'dim_cuaca_harian (relatif)': 'weather_daily',
            'cuaca 10k': 'weather_extended',
            'plan_produksi_harian': 'production_plan',
            'fct_pemuatan_kapal': 'vessel_loading',
            'dim_kapal': 'vessel_master',
            'fct_biaya_operasional': 'cost_operations',
            'ref_harga_komoditas': 'commodity_price'
        }
        
        for sheet_name, dataset_name in dataset_mapping.items():
            if sheet_name in sheets:
                datasets[dataset_name] = sheets[sheet_name]
                print(f"✓ Loaded {dataset_name}: {sheets[sheet_name].shape}")
        
        return datasets
    
    def save_processed(
        self, 
        df: pd.DataFrame, 
        filename: str, 
        format: str = 'parquet'
    ) -> None:
        """
        Save processed dataframe
        
        Args:
            df: DataFrame to save
            filename: Output filename
            format: 'parquet', 'csv', or 'pickle'
        """
        self.data_processed_path.mkdir(parents=True, exist_ok=True)
        
        if format == 'parquet':
            filepath = self.data_processed_path / f"{filename}.parquet"
            df.to_parquet(filepath, index=False)
        elif format == 'csv':
            filepath = self.data_processed_path / f"{filename}.csv"
            df.to_csv(filepath, index=False)
        elif format == 'pickle':
            filepath = self.data_processed_path / f"{filename}.pkl"
            df.to_pickle(filepath)
        else:
            raise ValueError(f"Unsupported format: {format}")
        
        print(f"✓ Saved to {filepath}")
    
    def load_processed(
        self, 
        filename: str, 
        format: str = 'parquet'
    ) -> pd.DataFrame:
        """
        Load processed dataframe
        
        Args:
            filename: Filename (without extension)
            format: 'parquet', 'csv', or 'pickle'
            
        Returns:
            DataFrame
        """
        if format == 'parquet':
            filepath = self.data_processed_path / f"{filename}.parquet"
            df = pd.read_parquet(filepath)
        elif format == 'csv':
            filepath = self.data_processed_path / f"{filename}.csv"
            df = pd.read_csv(filepath)
        elif format == 'pickle':
            filepath = self.data_processed_path / f"{filename}.pkl"
            df = pd.read_pickle(filepath)
        else:
            raise ValueError(f"Unsupported format: {format}")
        
        print(f"Loaded {filepath}: {df.shape}")
        return df


# Helper functions
def quick_load_excel(filename: str, sheet_name: str = None) -> pd.DataFrame:
    """
    Quick load Excel file without DataLoader class
    
    Args:
        filename: Excel filename in data/raw/
        sheet_name: Sheet name
        
    Returns:
        DataFrame
    """
    filepath = Path("data/raw") / filename
    return pd.read_excel(filepath, sheet_name=sheet_name)


def quick_info(df: pd.DataFrame) -> None:
    """
    Print quick info about DataFrame
    
    Args:
        df: DataFrame to inspect
    """
    print(f"Shape: {df.shape}")
    print(f"\nColumn types:\n{df.dtypes}")
    print(f"\nMissing values:\n{df.isnull().sum()}")
    print(f"\nMemory usage: {df.memory_usage(deep=True).sum() / 1024**2:.2f} MB")
