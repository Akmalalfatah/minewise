"""
Feature Engineering Module
Utilities untuk creating features dari raw data
"""

import pandas as pd
import numpy as np
from typing import List, Optional, Dict
from datetime import datetime, timedelta


class FeatureEngineer:
    """Class untuk feature engineering operations"""
    
    def __init__(self, verbose: bool = True):
        """
        Initialize FeatureEngineer
        
        Args:
            verbose: Print feature engineering steps
        """
        self.verbose = verbose
        self.created_features = []
        
    def _log(self, message: str):
        """Log message if verbose"""
        if self.verbose:
            print(f"[FeatureEngineer] {message}")
    
    def create_temporal_features(
        self, 
        df: pd.DataFrame, 
        datetime_col: str,
        features: List[str] = None
    ) -> pd.DataFrame:
        """
        Create temporal features dari datetime column
        
        Args:
            df: Input DataFrame
            datetime_col: Name of datetime column
            features: List of features to create. Options:
                     ['hour', 'day', 'month', 'year', 'day_of_week', 
                      'is_weekend', 'quarter', 'week_of_year']
            
        Returns:
            DataFrame with new temporal features
        """
        df = df.copy()
        
        if features is None:
            features = ['hour', 'day_of_week', 'is_weekend', 'month']
        
        # Ensure datetime type
        if not pd.api.types.is_datetime64_any_dtype(df[datetime_col]):
            df[datetime_col] = pd.to_datetime(df[datetime_col])
        
        feature_map = {
            'hour': lambda x: x.hour,
            'day': lambda x: x.day,
            'month': lambda x: x.month,
            'year': lambda x: x.year,
            'day_of_week': lambda x: x.dayofweek,  # Monday=0, Sunday=6
            'is_weekend': lambda x: x.dayofweek >= 5,
            'quarter': lambda x: x.quarter,
            'week_of_year': lambda x: x.isocalendar().week
        }
        
        for feature in features:
            if feature in feature_map:
                new_col = f"{datetime_col}_{feature}"
                df[new_col] = df[datetime_col].apply(feature_map[feature])
                self.created_features.append(new_col)
                self._log(f"Created feature: {new_col}")
        
        return df
    
    def create_lag_features(
        self, 
        df: pd.DataFrame, 
        columns: List[str],
        lag_periods: List[int],
        groupby_col: Optional[str] = None
    ) -> pd.DataFrame:
        """
        Create lag features
        
        Args:
            df: Input DataFrame (must be sorted by time)
            columns: Columns to create lags for
            lag_periods: List of lag periods (e.g., [1, 3, 7])
            groupby_col: Optional groupby column (e.g., 'id_alat')
            
        Returns:
            DataFrame with lag features
        """
        df = df.copy()
        
        for col in columns:
            for lag in lag_periods:
                new_col = f"{col}_lag_{lag}"
                
                if groupby_col:
                    df[new_col] = df.groupby(groupby_col)[col].shift(lag)
                else:
                    df[new_col] = df[col].shift(lag)
                
                self.created_features.append(new_col)
                self._log(f"Created lag feature: {new_col}")
        
        return df
    
    def create_rolling_features(
        self, 
        df: pd.DataFrame, 
        columns: List[str],
        windows: List[int],
        agg_funcs: List[str] = ['mean', 'std'],
        groupby_col: Optional[str] = None
    ) -> pd.DataFrame:
        """
        Create rolling window features
        
        Args:
            df: Input DataFrame (must be sorted by time)
            columns: Columns to create rolling features for
            windows: List of window sizes (e.g., [7, 14, 30])
            agg_funcs: Aggregation functions ('mean', 'std', 'min', 'max', 'sum')
            groupby_col: Optional groupby column
            
        Returns:
            DataFrame with rolling features
        """
        df = df.copy()
        
        for col in columns:
            for window in windows:
                for agg_func in agg_funcs:
                    new_col = f"{col}_rolling_{window}_{agg_func}"
                    
                    if groupby_col:
                        df[new_col] = df.groupby(groupby_col)[col].transform(
                            lambda x: x.rolling(window=window, min_periods=1).agg(agg_func)
                        )
                    else:
                        df[new_col] = df[col].rolling(window=window, min_periods=1).agg(agg_func)
                    
                    self.created_features.append(new_col)
                    self._log(f"Created rolling feature: {new_col}")
        
        return df
    
    def create_interaction_features(
        self, 
        df: pd.DataFrame, 
        feature_pairs: List[tuple],
        operations: List[str] = ['multiply', 'divide']
    ) -> pd.DataFrame:
        """
        Create interaction features
        
        Args:
            df: Input DataFrame
            feature_pairs: List of feature pairs to interact, e.g., [('col1', 'col2')]
            operations: Operations to perform ('multiply', 'divide', 'add', 'subtract')
            
        Returns:
            DataFrame with interaction features
        """
        df = df.copy()
        
        for col1, col2 in feature_pairs:
            if col1 not in df.columns or col2 not in df.columns:
                continue
            
            for op in operations:
                if op == 'multiply':
                    new_col = f"{col1}_x_{col2}"
                    df[new_col] = df[col1] * df[col2]
                elif op == 'divide':
                    new_col = f"{col1}_div_{col2}"
                    # Avoid division by zero
                    df[new_col] = df[col1] / (df[col2].replace(0, np.nan))
                elif op == 'add':
                    new_col = f"{col1}_plus_{col2}"
                    df[new_col] = df[col1] + df[col2]
                elif op == 'subtract':
                    new_col = f"{col1}_minus_{col2}"
                    df[new_col] = df[col1] - df[col2]
                
                self.created_features.append(new_col)
                self._log(f"Created interaction feature: {new_col}")
        
        return df
    
    def create_aggregated_features(
        self, 
        df: pd.DataFrame, 
        groupby_col: str,
        agg_dict: Dict[str, List[str]]
    ) -> pd.DataFrame:
        """
        Create aggregated features
        
        Args:
            df: Input DataFrame
            groupby_col: Column to group by
            agg_dict: Dictionary mapping columns to aggregation functions
                     e.g., {'total_muatan_ton': ['mean', 'sum', 'std']}
            
        Returns:
            DataFrame with aggregated features merged back
        """
        df = df.copy()
        
        # Create aggregations
        agg_df = df.groupby(groupby_col).agg(agg_dict)
        
        # Flatten column names
        agg_df.columns = ['_'.join(col).strip() for col in agg_df.columns.values]
        agg_df = agg_df.reset_index()
        
        # Rename columns
        new_cols = {}
        for col in agg_df.columns:
            if col != groupby_col:
                new_cols[col] = f"{groupby_col}_{col}"
                self.created_features.append(f"{groupby_col}_{col}")
        agg_df = agg_df.rename(columns=new_cols)
        
        # Merge back
        df = df.merge(agg_df, on=groupby_col, how='left')
        
        self._log(f"Created {len(new_cols)} aggregated features for '{groupby_col}'")
        
        return df
    
    def create_weather_severity_index(
        self, 
        df: pd.DataFrame,
        rain_col: str = 'hujan_mm',
        wind_col: str = 'angin_kecepatan_avg_ms',
        visibility_col: str = 'visibilitas_km_avg'
    ) -> pd.DataFrame:
        """
        Create weather severity index
        
        Args:
            df: Input DataFrame
            rain_col: Rain column name
            wind_col: Wind speed column name
            visibility_col: Visibility column name
            
        Returns:
            DataFrame with weather_severity_index column
        """
        df = df.copy()
        
        # Normalize each component to 0-1 scale
        rain_norm = (df[rain_col] - df[rain_col].min()) / (df[rain_col].max() - df[rain_col].min())
        wind_norm = (df[wind_col] - df[wind_col].min()) / (df[wind_col].max() - df[wind_col].min())
        
        # Visibility: inverse (lower visibility = higher severity)
        vis_norm = 1 - (df[visibility_col] - df[visibility_col].min()) / (df[visibility_col].max() - df[visibility_col].min())
        
        # Weighted combination
        df['weather_severity_index'] = (0.4 * rain_norm + 0.35 * wind_norm + 0.25 * vis_norm) * 100
        
        self.created_features.append('weather_severity_index')
        self._log("Created weather_severity_index")
        
        return df
    
    def get_created_features(self) -> List[str]:
        """Return list of created features"""
        return self.created_features


# Utility functions
def create_basic_features(
    df: pd.DataFrame,
    datetime_col: str,
    temporal_features: List[str] = None
) -> pd.DataFrame:
    """
    Quick function untuk create basic temporal features
    
    Args:
        df: Input DataFrame
        datetime_col: Datetime column name
        temporal_features: List of temporal features to create
        
    Returns:
        DataFrame with new features
    """
    fe = FeatureEngineer(verbose=True)
    
    df = fe.create_temporal_features(df, datetime_col, temporal_features)
    
    print(f"\nCreated {len(fe.get_created_features())} features:")
    print(fe.get_created_features())
    
    return df
