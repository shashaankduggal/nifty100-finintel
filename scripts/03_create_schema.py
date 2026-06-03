from db import get_engine

engine = get_engine()

DDL = """

-- DIMENSIONS

CREATE TABLE IF NOT EXISTS dim_company (
    company_id SERIAL PRIMARY KEY,
    symbol TEXT UNIQUE,
    name TEXT,
    sector TEXT
);

CREATE TABLE IF NOT EXISTS dim_year (
    year_id SERIAL PRIMARY KEY,
    year_label TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS dim_sector (
    sector_id SERIAL PRIMARY KEY,
    sector_name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS dim_health_label (
    label_id SERIAL PRIMARY KEY,
    label TEXT UNIQUE
);

-- FACT TABLES

CREATE TABLE IF NOT EXISTS fact_profit_loss (
    id SERIAL PRIMARY KEY,
    company_id INT,
    year_id INT,
    revenue NUMERIC,
    net_profit NUMERIC,
    ebit NUMERIC,
    FOREIGN KEY (company_id) REFERENCES dim_company(company_id),
    FOREIGN KEY (year_id) REFERENCES dim_year(year_id)
);

CREATE TABLE IF NOT EXISTS fact_balance_sheet (
    id SERIAL PRIMARY KEY,
    company_id INT,
    year_id INT,
    total_assets NUMERIC,
    equity NUMERIC,
    total_debt NUMERIC,
    FOREIGN KEY (company_id) REFERENCES dim_company(company_id),
    FOREIGN KEY (year_id) REFERENCES dim_year(year_id)
);

CREATE TABLE IF NOT EXISTS fact_cash_flow (
    id SERIAL PRIMARY KEY,
    company_id INT,
    year_id INT,
    operating_cash_flow NUMERIC,
    capex NUMERIC,
    FOREIGN KEY (company_id) REFERENCES dim_company(company_id),
    FOREIGN KEY (year_id) REFERENCES dim_year(year_id)
);

CREATE TABLE IF NOT EXISTS fact_analysis (
    id SERIAL PRIMARY KEY,
    company_id INT,
    year_id INT,
    de_ratio NUMERIC,
    net_profit_margin NUMERIC,
    roa NUMERIC,
    asset_turnover NUMERIC,
    equity_ratio NUMERIC,
    cash_conversion_ratio NUMERIC,
    FOREIGN KEY (company_id) REFERENCES dim_company(company_id),
    FOREIGN KEY (year_id) REFERENCES dim_year(year_id)
);

CREATE TABLE IF NOT EXISTS fact_ml_scores (
    id SERIAL PRIMARY KEY,
    company_id INT,
    year_id INT,
    score NUMERIC,
    label_id INT,
    FOREIGN KEY (company_id) REFERENCES dim_company(company_id),
    FOREIGN KEY (year_id) REFERENCES dim_year(year_id),
    FOREIGN KEY (label_id) REFERENCES dim_health_label(label_id)
);

CREATE TABLE IF NOT EXISTS fact_pros_cons (
    id SERIAL PRIMARY KEY,
    company_id INT,
    pros TEXT,
    cons TEXT,
    FOREIGN KEY (company_id) REFERENCES dim_company(company_id)
);

"""

with engine.connect() as conn:
    conn.execute(DDL)
    print("Schema created successfully.")