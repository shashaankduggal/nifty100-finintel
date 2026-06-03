import pandas as pd
from db import engine

# ---------------- LOAD ----------------
pl = pd.read_sql("SELECT * FROM fact_profit_loss", engine)
bs = pd.read_sql("SELECT * FROM fact_balance_sheet", engine)
cf = pd.read_sql("SELECT * FROM fact_cashflow", engine)

# ---------------- MERGE ----------------
df = pl.merge(bs, on=["company_id", "year"], how="left")
df = df.merge(cf, on=["company_id", "year"], how="left")

# ---------------- YEAR NORMALIZATION ----------------
def normalize_year(x):
    if pd.isna(x):
        return None

    x = str(x).strip()

    try:
        return pd.to_datetime(x, format="%b %Y").strftime("%b %Y")
    except:
        try:
            return pd.to_datetime(x, format="%b-%y").strftime("%b %Y")
        except:
            try:
                return pd.to_datetime(x).strftime("%b %Y")
            except:
                return None

df["year"] = df["year"].apply(normalize_year)

# ---------------- FIX NUMERIC TYPES ----------------
numeric_cols = [
    "borrowings", "equity_capital", "reserves",
    "net_profit", "total_assets", "sales",
    "operating_profit", "interest", "operating_activity"
]

for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce").astype(float)

# avoid divide by zero
df["interest"] = df["interest"].replace(0, None)
df["net_profit"] = df["net_profit"].replace(0, None)
df["total_assets"] = df["total_assets"].replace(0, None)
df["sales"] = df["sales"].replace(0, None)

denominator = (df["equity_capital"] + df["reserves"]).replace(0, None)

# ---------------- METRICS ----------------

df["debt_equity"] = df["borrowings"] / denominator

df["roa"] = df["net_profit"] / df["total_assets"]

df["asset_turnover"] = df["sales"] / df["total_assets"]

df["interest_coverage"] = df["operating_profit"] / df["interest"]

df["net_profit_margin"] = df["net_profit"] / df["sales"]

df["cash_conversion_ratio"] = df["operating_activity"] / df["net_profit"]

df["roe_calc"] = df["net_profit"] / denominator

# ---------------- CLEAN OUTPUT ----------------

# remove infinities
df = df.replace([float("inf"), -float("inf")], None)

# drop bad rows (no year)
df = df[df["year"].notna()]

# remove duplicates
df = df.sort_values(["company_id", "year"])
df = df.drop_duplicates(subset=["company_id", "year"], keep="last")

# drop rows missing critical metrics
df = df[
    df["roa"].notna() &
    df["debt_equity"].notna() &
    df["net_profit_margin"].notna()
]

# remove weak-history companies
counts = df.groupby("company_id").size()
valid_companies = counts[counts >= 5].index
df = df[df["company_id"].isin(valid_companies)]

# fix year ordering
df["year_date"] = pd.to_datetime(df["year"], format="%b %Y", errors="coerce")
df = df.sort_values(["company_id", "year_date"])


# clip extreme garbage values
df["debt_equity"] = df["debt_equity"].clip(0, 10)
df["roa"] = df["roa"].clip(-1, 1)
df["roe_calc"] = df["roe_calc"].clip(-1, 1)
df["net_profit_margin"] = df["net_profit_margin"].clip(-1, 1)
df["interest_coverage"] = df["interest_coverage"].clip(0, 100)
df["cash_conversion_ratio"] = df["cash_conversion_ratio"].clip(-5, 5)

# ---------------- FINAL TABLE ----------------
metrics = df[
    [
        "company_id",
        "year",
        "debt_equity",
        "roa",
        "asset_turnover",
        "interest_coverage",
        "net_profit_margin",
        "cash_conversion_ratio",
        "roe_calc",
    ]
]

# ---------------- LOAD ----------------
metrics.to_sql("fact_metrics", engine, if_exists="replace", index=False)

print("Metrics computed and stored.")