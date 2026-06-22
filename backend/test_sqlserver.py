import pyodbc
import sys

# Try Windows Authentication (no username/password needed)
try:
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 18 for SQL Server};"
        "SERVER=JESUS-CHRIST\\SQLEXPRESS;"
        "Trusted_Connection=yes;"
        "TrustServerCertificate=yes;"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT @@VERSION")
    print("OK Connected! SQL Server version:")
    print(cursor.fetchone()[0][:80])
    
    # Create the database
    conn.autocommit = True
    cursor.execute("IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'mcc_saas') CREATE DATABASE mcc_saas")
    print("OK Database mcc_saas ready!")
    conn.close()
except Exception as e:
    print(f"PYODBC Error: {e}")

# Try pymssql as fallback
try:
    import pymssql
    conn2 = pymssql.connect(server=r"JESUS-CHRIST\SQLEXPRESS", database="master", trusted=True)
    cursor2 = conn2.cursor()
    cursor2.execute("SELECT @@VERSION")
    print("PYMSSQL Connected!")
    print(cursor2.fetchone()[0][:80])
    conn2.close()
except Exception as e:
    print(f"PYMSSQL Error: {e}")
