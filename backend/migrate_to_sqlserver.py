"""
Migration script: SQLite --> SQL Server
Copies all data from mcc_saas.db into the SQL Server mcc_saas database.
Run this ONCE after updating config.py to SQL Server.
"""
import sqlite3
import pyodbc
from datetime import datetime

SQLITE_PATH = "mcc_saas.db"
SS_CONN_STR = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=JESUS-CHRIST\\SQLEXPRESS;"
    "DATABASE=mcc_saas;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

def parse_date(val):
    if not isinstance(val, str):
        return val
    # SQLite datetime fields are formatted as YYYY-MM-DD HH:MM:SS.mmmmmm or similar
    if len(val) >= 10 and '-' in val and ':' in val:
        for fmt in (
            '%Y-%m-%d %H:%M:%S.%f',
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%dT%H:%M:%S.%f',
            '%Y-%m-%dT%H:%M:%S',
            '%Y-%m-%d'
        ):
            try:
                return datetime.strptime(val, fmt)
            except ValueError:
                continue
    return val

def migrate():
    print("Connecting to SQLite...")
    src = sqlite3.connect(SQLITE_PATH)
    src.row_factory = sqlite3.Row
    src_cur = src.cursor()

    print("Connecting to SQL Server...")
    dst = pyodbc.connect(SS_CONN_STR)
    dst.autocommit = False
    dst_cur = dst.cursor()

    print("Disabling foreign key constraints in SQL Server for migration...")
    dst_cur.execute("EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'")
    dst.commit()

    # Get all tables from SQLite
    src_cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = [row[0] for row in src_cur.fetchall()]
    print(f"Found {len(tables)} tables: {tables}\n")

    print("Emptying existing data from SQL Server tables to ensure clean copy...")
    for table in tables:
        try:
            # Check if table exists in SQL Server
            dst_cur.execute(f"SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '{table}'")
            if dst_cur.fetchone()[0] > 0:
                dst_cur.execute(f"DELETE FROM [{table}]")
        except Exception as del_err:
            print(f"  Warning: could not empty table {table}: {del_err}")
    dst.commit()
    print("All tables cleared.\n")

    migrated = 0
    skipped = 0

    for table in tables:
        try:
            # Get row count in source
            src_cur.execute(f"SELECT COUNT(*) FROM [{table}]")
            count = src_cur.fetchone()[0]
            if count == 0:
                print(f"  [SKIP] {table}: empty")
                skipped += 1
                continue

            # Get all rows
            src_cur.execute(f"SELECT * FROM [{table}]")
            rows = src_cur.fetchall()
            columns = [desc[0] for desc in src_cur.description]

            # Check if table exists in SQL Server
            dst_cur.execute(f"SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '{table}'")
            if dst_cur.fetchone()[0] == 0:
                print(f"  [SKIP] {table}: not in SQL Server yet (will be created by SQLAlchemy)")
                skipped += 1
                continue

            # Build INSERT statement
            col_names = ", ".join([f"[{c}]" for c in columns])
            placeholders = ", ".join(["?" for _ in columns])
            insert_sql = f"INSERT INTO [{table}] ({col_names}) VALUES ({placeholders})"

            # Insert rows
            success = 0
            for row in rows:
                processed_row = [parse_date(val) for val in row]
                try:
                    dst_cur.execute(insert_sql, tuple(processed_row))
                    success += 1
                except Exception as row_err:
                    print(f"    Row error in {table}: {row_err}")

            dst.commit()
            print(f"  [OK] {table}: migrated {success}/{count} rows")
            migrated += 1

        except Exception as e:
            dst.rollback()
            print(f"  [ERROR] {table}: {e}")
            skipped += 1

    print("Re-enabling foreign key constraints in SQL Server...")
    try:
        dst_cur.execute("EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL'")
        dst.commit()
        print("Foreign key constraints re-enabled successfully.")
    except Exception as re_err:
        print(f"Error re-enabling foreign key constraints: {re_err}")

    print(f"\nMigration complete: {migrated} tables migrated, {skipped} skipped.")
    src.close()
    dst.close()

if __name__ == "__main__":
    migrate()
