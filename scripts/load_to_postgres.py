import pandas as pd
from db import engine
from ingest_excel_structured import main

data = main()

data["companies"].to_sql("dim_company", engine, if_exists="replace", index=False)
data["profitandloss"].to_sql("fact_profit_loss", engine, if_exists="replace", index=False)
data["balancesheet"].to_sql("fact_balance_sheet", engine, if_exists="replace", index=False)
data["cashflow"].to_sql("fact_cashflow", engine, if_exists="replace", index=False)
data["analysis"].to_sql("fact_analysis", engine, if_exists="replace", index=False)
data["documents"].to_sql("fact_documents", engine, if_exists="replace", index=False)
data["prosandcons"].to_sql("fact_pros_cons", engine, if_exists="replace", index=False)

print("Loaded successfully.")