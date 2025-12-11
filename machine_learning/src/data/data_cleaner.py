"""
Data Cleaning Module
Utilities untuk data cleaning, preprocessing, dan quality checks
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Optional, Tuple
from sklearn.impute import SimpleImputer
import warnings

warnings.filterwarnings('ignore')


class DataCleaner:
    """Class untuk data cleaning operations"""
    
    def __init__(self, verbose: bool = True):
        """
        Initialize DataCleaner
        
        Args:
            verbose: Print cleaning steps
        """
        self.verbose = verbose
        self.cleaning_report = {}
        
    def _log(self, message: str):
        """Log message if verbose"""
        if self.verbose:
            print(f"[DataCleaner] {message}")
    
    def handle_missing_values(
        self, 
        df: pd.DataFrame, 
        strategy: str = 'drop',
        columns: Optional[List[str]] = None,
        threshold: float = 0.5
    ) -> pd.DataFrame:
        """
        Handle missing values
        
        Args:
            df: Input DataFrame
            strategy: 'drop', 'ffill', 'bfill', 'mean', 'median', 'mode'
            columns: Specific columns (None = all columns)
            threshold: For 'drop', drop column if missing > threshold
            
        Returns:
            Cleaned DataFrame
        """
        df_clean = df.copy()
        cols = columns if columns else df.columns
        
        missing_before = df_clean[cols].isnull().sum().sum()
        self._log(f"Missing values before: {missing_before}")
        
        if strategy == 'drop':
            # Drop columns with too many missing values
            for col in cols:
                missing_ratio = df_clean[col].isnull().sum() / len(df_clean)
                if missing_ratio > threshold:
                    df_clean = df_clean.drop(columns=[col])
                    self._log(f"Dropped column '{col}' ({missing_ratio:.2%} missing)")
            
            # Drop rows with any remaining missing values
            df_clean = df_clean.dropna()
            
        elif strategy == 'ffill':
            df_clean[cols] = df_clean[cols].fillna(method='ffill')
            
        elif strategy == 'bfill':
            df_clean[cols] = df_clean[cols].fillna(method='bfill')
            
        elif strategy in ['mean', 'median']:
            imputer = SimpleImputer(strategy=strategy)
            numeric_cols = df_clean[cols].select_dtypes(include=[np.number]).columns
            df_clean[numeric_cols] = imputer.fit_transform(df_clean[numeric_cols])
            
        elif strategy == 'mode':
            for col in cols:
                if df_clean[col].isnull().sum() > 0:
                    mode_value = df_clean[col].mode()[0]
                    df_clean[col].fillna(mode_value, inplace=True)
        
        missing_after = df_clean[cols].isnull().sum().sum()
        self._log(f"Missing values after: {missing_after}")
        
        self.cleaning_report['missing_values'] = {
            'before': int(missing_before),
            'after': int(missing_after),
            'removed': int(missing_before - missing_after)
        }
        
        return df_clean
    
    def handle_outliers(
        self, 
        df: pd.DataFrame, 
        columns: List[str],
        method: str = 'iqr',
        action: str = 'clip',
        threshold: float = 1.5
    ) -> pd.DataFrame:
        """
        Handle outliers in numerical columns
        
        Args:
            df: Input DataFrame
            columns: Columns to check for outliers
            method: 'iqr' or 'zscore'
            action: 'clip' (cap values) or 'remove' (drop rows)
            threshold: IQR multiplier (default 1.5) or z-score threshold (default 3)
            
        Returns:
            Cleaned DataFrame
        """
        df_clean = df.copy()
        outliers_count = 0
        
        for col in columns:
            if col not in df_clean.columns:
                continue
                
            if method == 'iqr':
                Q1 = df_clean[col].quantile(0.25)
                Q3 = df_clean[col].quantile(0.75)
                IQR = Q3 - Q1
                
                lower_bound = Q1 - threshold * IQR
                upper_bound = Q3 + threshold * IQR
                
                outliers = ((df_clean[col] < lower_bound) | (df_clean[col] > upper_bound)).sum()
                outliers_count += outliers
                
                if action == 'clip':
                    df_clean[col] = df_clean[col].clip(lower=lower_bound, upper=upper_bound)
                elif action == 'remove':
                    df_clean = df_clean[
                        (df_clean[col] >= lower_bound) & (df_clean[col] <= upper_bound)
                    ]
                
                self._log(f"Column '{col}': {outliers} outliers detected (bounds: [{lower_bound:.2f}, {upper_bound:.2f}])")
            
            elif method == 'zscore':
                z_scores = np.abs((df_clean[col] - df_clean[col].mean()) / df_clean[col].std())
                outliers = (z_scores > threshold).sum()
                outliers_count += outliers
                
                if action == 'clip':
                    # Cap at mean ± threshold * std
                    lower_bound = df_clean[col].mean() - threshold * df_clean[col].std()
                    upper_bound = df_clean[col].mean() + threshold * df_clean[col].std()
                    df_clean[col] = df_clean[col].clip(lower=lower_bound, upper=upper_bound)
                elif action == 'remove':
                    df_clean = df_clean[z_scores <= threshold]
                
                self._log(f"Column '{col}': {outliers} outliers detected (z-score > {threshold})")
        
        self.cleaning_report['outliers'] = {
            'method': method,
            'action': action,
            'total_outliers': int(outliers_count)
        }
        
        return df_clean
    
    def convert_datatypes(
        self, 
        df: pd.DataFrame, 
        datetime_cols: Optional[List[str]] = None,
        categorical_cols: Optional[List[str]] = None
    ) -> pd.DataFrame:
        """
        Convert column datatypes
        
        Args:
            df: Input DataFrame
            datetime_cols: Columns to convert to datetime
            categorical_cols: Columns to convert to category
            
        Returns:
            DataFrame with converted types
        """
        df_clean = df.copy()
        
        if datetime_cols:
            for col in datetime_cols:
                if col in df_clean.columns:
                    df_clean[col] = pd.to_datetime(df_clean[col], errors='coerce')
                    self._log(f"Converted '{col}' to datetime")
        
        if categorical_cols:
            for col in categorical_cols:
                if col in df_clean.columns:
                    df_clean[col] = df_clean[col].astype('category')
                    self._log(f"Converted '{col}' to category")
        
        return df_clean
    
    def remove_duplicates(
        self, 
        df: pd.DataFrame, 
        subset: Optional[List[str]] = None,
        keep: str = 'first'
    ) -> pd.DataFrame:
        """
        Remove duplicate rows
        
        Args:
            df: Input DataFrame
            subset: Columns to consider for duplicate check
            keep: 'first', 'last', or False (remove all duplicates)
            
        Returns:
            DataFrame without duplicates
        """
        df_clean = df.copy()
        duplicates_before = df_clean.duplicated(subset=subset).sum()
        
        df_clean = df_clean.drop_duplicates(subset=subset, keep=keep)
        
        duplicates_removed = duplicates_before
        self._log(f"Removed {duplicates_removed} duplicate rows")
        
        self.cleaning_report['duplicates'] = {
            'removed': int(duplicates_removed)
        }
        
        return df_clean
    
    def validate_data_quality(self, df: pd.DataFrame) -> Dict:
        """
        Generate data quality report
        
        Args:
            df: DataFrame to validate
            
        Returns:
            Dictionary with quality metrics
        """
        report = {
            'total_rows': len(df),
            'total_columns': len(df.columns),
            'missing_values': df.isnull().sum().to_dict(),
            'missing_percentage': (df.isnull().sum() / len(df) * 100).to_dict(),
            'duplicate_rows': df.duplicated().sum(),
            'memory_usage_mb': df.memory_usage(deep=True).sum() / 1024**2,
            'dtypes': df.dtypes.astype(str).to_dict()
        }
        
        return report
    
    def get_cleaning_report(self) -> Dict:
        """Get full cleaning report"""
        return self.cleaning_report


# Utility functions
def quick_clean(
    df: pd.DataFrame,
    missing_strategy: str = 'drop',
    handle_outliers_cols: Optional[List[str]] = None,
    datetime_cols: Optional[List[str]] = None,
    categorical_cols: Optional[List[str]] = None
) -> pd.DataFrame:
    """
    Quick cleaning pipeline
    
    Args:
        df: Input DataFrame
        missing_strategy: Strategy for missing values
        handle_outliers_cols: Columns to check for outliers
        datetime_cols: Columns to convert to datetime
        categorical_cols: Columns to convert to category
        
    Returns:
        Cleaned DataFrame
    """
    cleaner = DataCleaner(verbose=True)
    
    # Remove duplicates
    df = cleaner.remove_duplicates(df)
    
    # Convert datatypes
    df = cleaner.convert_datatypes(df, datetime_cols, categorical_cols)
    
    # Handle missing values
    df = cleaner.handle_missing_values(df, strategy=missing_strategy)
    
    # Handle outliers
    if handle_outliers_cols:
        df = cleaner.handle_outliers(df, columns=handle_outliers_cols, method='iqr', action='clip')
    
    print("\n=== Cleaning Report ===")
    print(cleaner.get_cleaning_report())
    
    return df
