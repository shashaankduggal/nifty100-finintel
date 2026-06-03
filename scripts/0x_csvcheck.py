import os
os.environ["OPENBLAS_NUM_THREADS"] = "1"  # fix OpenBLAS memory issue

import pandas as pd

# get project root (nifty100-finintel)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# target file
FILE_PATH = os.path.join(BASE_DIR, "data", "processed", "profitandloss_profit_&_loss.csv")

print("Checking path:", FILE_PATH)
print("Exists:", os.path.exists(FILE_PATH))

# load
df = pd.read_csv(FILE_PATH)

# output
print("\nHEAD:\n", df.head())
print("\nNULLS:\n", df.isnull().sum())