import pandas as pd
from db import engine

# ---------------- LOAD ----------------
df = pd.read_sql("SELECT * FROM fact_metrics", engine)

# ensure numeric
cols = [
    "debt_equity", "roa", "asset_turnover",
    "interest_coverage", "net_profit_margin",
    "cash_conversion_ratio", "roe_calc"
]

for col in cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# ---------------- NORMALIZATION ----------------
# percentile rank (0 to 1)
def pct_rank(series):
    return series.rank(pct=True)

# positive metrics (higher = better)
df["roa_score"] = pct_rank(df["roa"])
df["asset_turnover_score"] = pct_rank(df["asset_turnover"])
df["interest_coverage_score"] = pct_rank(df["interest_coverage"])
df["net_profit_margin_score"] = pct_rank(df["net_profit_margin"])
df["cash_conversion_score"] = pct_rank(df["cash_conversion_ratio"])
df["roe_score"] = pct_rank(df["roe_calc"])

# negative metric (lower = better)
df["debt_equity_score"] = 1 - pct_rank(df["debt_equity"])

# ---------------- WEIGHTED SCORE ----------------
df["health_score"] = (
    df["roa_score"] * 0.20 +
    df["net_profit_margin_score"] * 0.15 +
    df["roe_score"] * 0.15 +
    df["asset_turnover_score"] * 0.10 +
    df["interest_coverage_score"] * 0.15 +
    df["cash_conversion_score"] * 0.10 +
    df["debt_equity_score"] * 0.15
)

# scale to 0–100
df["health_score"] = df["health_score"] * 100

# ---------------- LABELS ----------------
def label(score):
    if score >= 80:
        return "EXCELLENT"
    elif score >= 60:
        return "GOOD"
    elif score >= 40:
        return "AVERAGE"
    elif score >= 20:
        return "WEAK"
    else:
        return "POOR"

df["health_label"] = df["health_score"].apply(label)

# ---------------- FINAL ----------------
result = df[
    ["company_id", "year", "health_score", "health_label"]
]

# save
result.to_sql("fact_health_scores", engine, if_exists="replace", index=False)

print("Health scoring complete.")