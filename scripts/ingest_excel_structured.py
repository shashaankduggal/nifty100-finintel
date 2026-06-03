import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"

import pandas as pd
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(BASE_DIR, "data", "raw")


# ---------- COMMON HELPERS ----------

def standardize_year(col):
    def fix(x):
        if pd.isna(x):
            return x
        x = str(x).strip()

        if re.match(r"[A-Za-z]{3}-\d{2}", x):
            m, y = x.split("-")
            return f"{m} 20{y}"

        return x

    return col.apply(fix)


def to_numeric(df):
    NON_NUMERIC_COLS = ["company_id", "company_name", "year", "document_url", "pros", "cons"]

    for col in df.columns:
        if col in NON_NUMERIC_COLS:
            continue

        df[col] = (
            df[col]
            .astype(str)
            .str.replace(",", "")
            .replace("None", None)
        )

        df[col] = pd.to_numeric(df[col], errors="coerce")

    return df


def base_clean(df):
    df = df.dropna(how="all")
    df = df.loc[:, ~df.columns.astype(str).str.contains("Unnamed")]

    df.columns = (
        df.columns.astype(str)
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    # remove duplicate header rows
    df = df[df[df.columns[0]].astype(str).str.lower() != "id"]

    return df


def finalize_df(df):
    df = base_clean(df)

    if "year" in df.columns:
        df["year"] = standardize_year(df["year"])

    df = to_numeric(df)

    return df


# ---------- LOADERS ----------

def detect_header(df, keyword="company"):
    for i in range(5):
        if df.iloc[i].astype(str).str.contains(keyword, case=False).any():
            return i
    return None


def load_companies(path):
    import pandas as pd

    csv_path = path.replace(".xlsx", "_companies.csv")

    # FIX: skip junk title row
    df = pd.read_csv(csv_path, skiprows=1)

    # normalize columns
    df.columns = (
        df.columns.astype(str)
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    print("Clean CSV columns:", df.columns.tolist())

    # rename
    df = df.rename(columns={
        "roce_percentage": "roce",
        "roe_percentage": "roe"
    })

    keep_cols = [
        "id",
        "company_name",
        "website",
        "face_value",
        "book_value",
        "roce",
        "roe"
    ]

    df = df[[c for c in keep_cols if c in df.columns]]

    for col in ["face_value", "book_value", "roce", "roe"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df = df.dropna(subset=["company_name"])

    print("Companies columns:", df.columns.tolist())
    return df


def load_profit_loss(path):
    df = pd.read_excel(path, header=None)

    header_row = detect_header(df, "company_id")
    if header_row is None:
        raise Exception("company_id not found in profitandloss")

    df.columns = df.iloc[header_row]
    df = df[header_row + 1:]

    df = finalize_df(df)

    print("P&L columns:", df.columns.tolist())
    return df


def load_balance_sheet(path):
    df = pd.read_excel(path, header=None)

    header_row = detect_header(df, "company_id")
    if header_row is None:
        raise Exception("company_id not found in balancesheet")

    df.columns = df.iloc[header_row]
    df = df[header_row + 1:]

    df = finalize_df(df)

    print("Balance columns:", df.columns.tolist())
    return df


def load_cashflow(path):
    df = pd.read_excel(path, header=None)

    header_row = detect_header(df, "company_id")
    if header_row is None:
        raise Exception("company_id not found in cashflow")

    df.columns = df.iloc[header_row]
    df = df[header_row + 1:]

    df = finalize_df(df)

    print("Cashflow columns:", df.columns.tolist())
    return df


def load_analysis(path):
    df = pd.read_excel(path, header=None)

    header_row = detect_header(df, "company_id")
    if header_row is None:
        raise Exception("company_id not found in analysis")

    df.columns = df.iloc[header_row]
    df = df[header_row + 1:]

    df = base_clean(df)

    print("Analysis columns:", df.columns.tolist())

    company_col = [c for c in df.columns if "company" in c][0]

    melted = []

    for _, row in df.iterrows():
        company = row[company_col]

        for col in df.columns:
            if col in [company_col, "id"]:
                continue

            val = str(row[col])
            match = re.search(r"(\d+\.?\d*)", val)

            if match:
                melted.append({
                    "company_id": company,
                    "metric": col,
                    "value_pct": float(match.group(1))
                })

    return pd.DataFrame(melted)


def load_pros_cons(path):
    df = pd.read_excel(path, header=None)

    header_row = detect_header(df, "company")
    if header_row is None:
        raise Exception("Header not found in prosandcons.xlsx")

    df.columns = df.iloc[header_row]
    df = df[header_row + 1:]

    df = finalize_df(df)

    print("Pros/Cons columns:", df.columns.tolist())

    company_col = [c for c in df.columns if "company" in c][0]
    pros_col = [c for c in df.columns if "pro" in c][0]
    cons_col = [c for c in df.columns if "con" in c][0]

    return df[[company_col, pros_col, cons_col]].rename(columns={
        company_col: "company_id",
        pros_col: "pros",
        cons_col: "cons"
    })


def load_documents(path):
    import pandas as pd

    # switch to CSV
    csv_path = path.replace(".xlsx", "_documents.csv")

    # skip junk title row
    df = pd.read_csv(csv_path, skiprows=1)

    # normalize columns
    df.columns = (
        df.columns.astype(str)
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    print("Clean Documents columns:", df.columns.tolist())

    # rename to standard schema
    df = df.rename(columns={
        "annual_report": "document_url"
    })

    # keep only required
    df = df[["company_id", "year", "document_url"]]

    # clean year
    df["year"] = pd.to_numeric(df["year"], errors="coerce")

    # drop bad rows
    df = df.dropna(subset=["company_id", "year", "document_url"])

    return df


# ---------- MAIN ----------

def main():
    loaders = {
        "companies": load_companies,
        "profitandloss": load_profit_loss,
        "balancesheet": load_balance_sheet,
        "cashflow": load_cashflow,
        "analysis": load_analysis,
        "prosandcons": load_pros_cons,
        "documents": load_documents,
    }

    data = {}

    for file in os.listdir(RAW_DIR):
        if not file.endswith(".xlsx"):
            continue

        name = file.replace(".xlsx", "").lower()
        path = os.path.join(RAW_DIR, file)

        if name not in loaders:
            print(f"Skipping {file}")
            continue

        print(f"Processing {file}")
        df = loaders[name](path)

        print(f"{name} : {df.shape}")
        print(df.head(), "\n")

        data[name] = df

    return data


if __name__ == "__main__":
    main()