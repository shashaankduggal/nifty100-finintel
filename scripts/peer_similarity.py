import pandas as pd
from db import engine
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity

# ---------------- LOAD ----------------
df = pd.read_sql("SELECT * FROM fact_metrics", engine)

# latest year per company (important)
df["year_date"] = pd.to_datetime(df["year"], format="%b %Y", errors="coerce")
latest = df.sort_values("year_date").groupby("company_id").tail(1)

# ---------------- FEATURES ----------------
features = [
    "debt_equity",
    "roa",
    "asset_turnover",
    "interest_coverage",
    "net_profit_margin",
    "cash_conversion_ratio",
    "roe_calc"
]

# clean
X = latest[features].copy()

# force numeric (critical fix)
for col in X.columns:
    X[col] = pd.to_numeric(X[col], errors="coerce")

# now fill missing values safely
X = X.fillna(X.median(numeric_only=True))

# normalize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ---------------- SIMILARITY ----------------
sim_matrix = cosine_similarity(X_scaled)

companies = latest["company_id"].tolist()

# ---------------- BUILD PEER TABLE ----------------
rows = []

for i, company in enumerate(companies):
    similarities = list(enumerate(sim_matrix[i]))

    # sort by similarity (exclude self)
    similarities = sorted(similarities, key=lambda x: x[1], reverse=True)[1:6]

    for j, score in similarities:
        rows.append({
            "company_id": company,
            "peer_company_id": companies[j],
            "similarity_score": float(score)
        })

peer_df = pd.DataFrame(rows)

# ---------------- SAVE ----------------
peer_df.to_sql("fact_peers", engine, if_exists="replace", index=False)

print("Peer similarity computed.")