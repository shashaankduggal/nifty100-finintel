import pandas as pd
import numpy as np
from db import engine
from sklearn.linear_model import LinearRegression

# ---------------- LOAD ----------------
df = pd.read_sql("SELECT * FROM fact_profit_loss", engine)

# normalize year → datetime
def normalize_year(x):
    try:
        return pd.to_datetime(x)
    except:
        return pd.to_datetime(x, errors="coerce")

df["year_date"] = df["year"].apply(normalize_year)

# keep only needed
df = df[["company_id", "year_date", "sales", "net_profit"]]

# force numeric
df["sales"] = pd.to_numeric(df["sales"], errors="coerce")
df["net_profit"] = pd.to_numeric(df["net_profit"], errors="coerce")

# drop bad rows
df = df.dropna()

# ---------------- FORECAST ----------------
results = []

for company, group in df.groupby("company_id"):
    group = group.sort_values("year_date")

    # need at least 4 points
    if len(group) < 4:
        continue

    # create time index
    X = np.arange(len(group)).reshape(-1, 1)

    # -------- SALES MODEL --------
    y_sales = group["sales"].values

    model_sales = LinearRegression()
    model_sales.fit(X, y_sales)

    trend_slope = model_sales.coef_[0]

    # classify trend
    if trend_slope > 0:
        trend = "UP"
    elif trend_slope < 0:
        trend = "DOWN"
    else:
        trend = "FLAT"

    # forecast next year
    next_x = np.array([[len(group)]])
    sales_forecast = model_sales.predict(next_x)[0]

    # -------- PROFIT MODEL --------
    y_profit = group["net_profit"].values

    model_profit = LinearRegression()
    model_profit.fit(X, y_profit)

    profit_forecast = model_profit.predict(next_x)[0]

    results.append({
        "company_id": company,
        "last_year": group["year_date"].max(),
        "sales_forecast": float(sales_forecast),
        "profit_forecast": float(profit_forecast),
        "trend": trend
    })

# ---------------- SAVE ----------------
forecast_df = pd.DataFrame(results)

forecast_df.to_sql("fact_forecasts", engine, if_exists="replace", index=False)

print("Forecasting complete.")