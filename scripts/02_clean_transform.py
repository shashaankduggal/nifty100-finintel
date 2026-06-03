import os
import pandas as pd
import numpy as np
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")
OUT_DIR = os.path.join(BASE_DIR, "data", "processed")

os.makedirs(OUT_DIR, exist_ok=True)


# ---------- HELPERS ----------

def clean_columns(df):
    df.columns = (
        df.columns.str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace(r"[^\w_]", "", regex=True)
    )
    return df


def standardize_year(col):
    def fix(x):
        if pd.isna(x):
            return x
        x = str(x).strip()

        # Mar-24 → Mar 2024
        if re.match(r"[A-Za-z]{3}-\d{2}", x):
            m, y = x.split("-")
            return f"{m} 20{y}"

        return x

    return col.apply(fix)


def to_numeric(df):
    for col in df.columns:
        df[col] = (
            df[col]
            .astype(str)
            .str.replace(",", "")
            .replace("None", np.nan)
        )
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


# ---------- CORE TRANSFORM ----------

def reshape_financial(df, value_name, company_name):
    """
    Correct reshape:
    rows = metrics
    columns = years
    """

    # first column = metric (like Revenue, Profit etc)
    metric_col = df.columns[0]

    df_long = df.melt(
        id_vars=[metric_col],
        var_name="year",
        value_name=value_name
    )

    df_long.rename(columns={metric_col: "metric"}, inplace=True)

    df_long["company"] = company_name

    df_long["year"] = standardize_year(df_long["year"])

    return df_long

# ---------- PROCESS EACH FILE ----------
def process_file(file):
    path = os.path.join(RAW_DIR, file)
    df = pd.read_csv(path)

    df = clean_columns(df)
    df = to_numeric(df)

    # TEMP: derive company from filename (we’ll improve later)
    company_name = file.split("_")[0]

    name = file.lower()

    if "profit" in name:
        df = reshape_financial(df, "value", company_name)

    elif "balance" in name:
        df = reshape_financial(df, "value", company_name)

    elif "cash" in name:
        df = reshape_financial(df, "value", company_name)

    else:
        df = reshape_financial(df, "value", company_name)

    out_path = os.path.join(OUT_DIR, file)
    df.to_csv(out_path, index=False)

    print(f"Processed: {file} -> {df.shape}")


# ---------- MAIN ----------

def main():
    files = [f for f in os.listdir(RAW_DIR) if f.endswith(".csv")]

    for f in files:
        process_file(f)


if __name__ == "__main__":
    main()