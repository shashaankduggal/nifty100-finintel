import pandas as pd
from db import engine

# ---------------- LOAD ----------------
df = pd.read_sql("SELECT * FROM fact_metrics", engine)

# force numeric types (critical fix)
numeric_cols = [
    "debt_equity",
    "roa",
    "asset_turnover",
    "interest_coverage",
    "net_profit_margin",
    "cash_conversion_ratio",
    "roe_calc"
]

for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")


print("\n--- DATA QUALITY REPORT ---\n")

# ---------------- 1. ROW COUNT ----------------
print(f"Total rows: {len(df)}")

# ---------------- 2. NULL CHECK ----------------
nulls = df.isnull().sum()
print("\nNULL COUNTS:")
print(nulls)

# flag if too many nulls
for col in df.columns:
    pct = (df[col].isnull().sum() / len(df)) * 100
    if pct > 30:
        print(f"WARNING: {col} has {pct:.2f}% NULLs")

# ---------------- 3. RANGE CHECKS ----------------
print("\nRANGE CHECKS:")

issues = df[
    (df["roa"] > 1) | (df["roa"] < -1) |
    (df["debt_equity"] < 0) |
    (df["interest_coverage"] > 200) |
    (df["net_profit_margin"] > 1)
]

print(f"Suspicious rows: {len(issues)}")

# ---------------- 4. DUPLICATE CHECK ----------------
dupes = df.duplicated(subset=["company_id", "year"]).sum()
print(f"\nDuplicate (company_id, year): {dupes}")

# ---------------- 5. COMPLETENESS CHECK ----------------
counts = df.groupby("company_id").size()

print("\nCompany coverage check:")
print(counts.describe())

low_data = counts[counts < counts.mean() * 0.5]
if not low_data.empty:
    print("\nWARNING: Companies with low data:")
    print(low_data)

# ---------------- 6. BASIC STATS ----------------
print("\nSUMMARY STATS:")
print(df.describe())

print("\n--- DONE ---")