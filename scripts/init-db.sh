#!/bin/bash
# Initialize multiple PostgreSQL databases
# This script is used by docker-entrypoint-initdb.d

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create mining ML production database
    CREATE DATABASE mining_ml_prod;
    CREATE USER ml_api_user WITH PASSWORD 'change_this_password';
    GRANT ALL PRIVILEGES ON DATABASE mining_ml_prod TO ml_api_user;

    -- Create MLflow tracking database
    CREATE DATABASE mlflow;
    CREATE USER mlflow WITH PASSWORD 'change_this_password';
    GRANT ALL PRIVILEGES ON DATABASE mlflow TO mlflow;

    -- Connect to mining_ml_prod and create tables
    \c mining_ml_prod;

    -- Prediction logs table
    CREATE TABLE IF NOT EXISTS prediction_logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        model_name VARCHAR(100) NOT NULL,
        input_data JSONB NOT NULL,
        prediction JSONB NOT NULL,
        execution_time_ms FLOAT,
        user_id VARCHAR(100),
        request_id VARCHAR(100)
    );

    -- Create index for faster queries
    CREATE INDEX idx_prediction_logs_timestamp ON prediction_logs(timestamp);
    CREATE INDEX idx_prediction_logs_model ON prediction_logs(model_name);

    -- Model performance monitoring table
    CREATE TABLE IF NOT EXISTS model_metrics (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        model_name VARCHAR(100) NOT NULL,
        metric_name VARCHAR(100) NOT NULL,
        metric_value FLOAT NOT NULL,
        environment VARCHAR(50) DEFAULT 'production'
    );

    -- API usage tracking
    CREATE TABLE IF NOT EXISTS api_usage (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endpoint VARCHAR(255) NOT NULL,
        method VARCHAR(10) NOT NULL,
        status_code INTEGER NOT NULL,
        response_time_ms FLOAT,
        user_id VARCHAR(100),
        api_key_hash VARCHAR(255)
    );

    CREATE INDEX idx_api_usage_timestamp ON api_usage(timestamp);
    CREATE INDEX idx_api_usage_endpoint ON api_usage(endpoint);

EOSQL

echo "✅ Databases initialized successfully"
