from sqlalchemy import create_engine

DB_URL = "postgresql://postgres:12345@localhost:5432/nifty100"

engine = create_engine(DB_URL)

if __name__ == "__main__":
    with engine.connect() as conn:
        print("DB connection successful")