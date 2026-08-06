import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker

# ==========================================
# CONFIGURATION
# ==========================================

# 1. SQL Server (Source) Connection String
SQL_SERVER_URI = "mssql+pyodbc://JESUS-CHRIST\\SQLEXPRESS/mcc_saas?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes&Trusted_Connection=yes"

# 2. PostgreSQL (Destination) Connection String
# IMPORTANT: Ensure your PostgreSQL database and schema are already created using the postgres_schema.sql script!
POSTGRES_URI = "postgresql+psycopg2://postgres:postgres123@localhost:5432/mcc_saas"

# ==========================================
# INITIALIZATION
# ==========================================

print("Connecting to source database (SQL Server)...")
source_engine = create_engine(SQL_SERVER_URI)
source_meta = MetaData()
source_meta.reflect(bind=source_engine)

print("Connecting to destination database (PostgreSQL)...")
dest_engine = create_engine(POSTGRES_URI)
dest_meta = MetaData()
dest_meta.reflect(bind=dest_engine)

# ==========================================
# MIGRATION ORDER (Topological Sort based on Foreign Keys)
# ==========================================
# It is critical to insert parent tables before child tables to avoid Foreign Key constraint errors.

TABLES_IN_ORDER = [
    "subscription_plans",
    "tenants",
    "users",
    "branding_settings",
    "theme_settings",
    "tenant_branding",
    "provider_configurations",
    "platform_settings",
    "billing_settings",
    "smtp_settings",
    "feature_flags",
    "website_pages",
    "website_sections",
    "navigation_items",
    "dashboard_widgets",
    "email_templates",
    "custom_forms",
    "media_library",
    "feature_provider_mapping",
    "subscriptions",
    "subscription_history",
    "invoices",
    "payments",
    "payment_transactions",
    "invoice_history",
    "usage_tracking",
    "transcription_history",
    "translation_history",
    "tts_history",
    "audit_logs"
]

def migrate_data():
    with source_engine.connect() as src_conn, dest_engine.connect() as dest_conn:
        
        for table_name in TABLES_IN_ORDER:
            print(f"\\nMigrating table: {table_name}...")
            
            if table_name not in source_meta.tables:
                print(f"  [SKIP] Table {table_name} not found in source database.")
                continue
                
            if table_name not in dest_meta.tables:
                print(f"  [SKIP] Table {table_name} not found in destination database.")
                continue

            src_table = source_meta.tables[table_name]
            dest_table = dest_meta.tables[table_name]

            # Read all rows from source
            result = src_conn.execute(src_table.select())
            rows = result.mappings().all()
            
            if not rows:
                print(f"  [INFO] No rows to migrate for {table_name}.")
                continue
                
            print(f"  [INFO] Found {len(rows)} rows. Inserting into PostgreSQL...")
            
            # Insert into destination in batches
            batch_size = 1000
            for i in range(0, len(rows), batch_size):
                batch = rows[i:i + batch_size]
                
                # Convert pyodbc rows to dictionaries
                insert_data = [dict(row) for row in batch]
                
                # Execute batch insert
                with dest_conn.begin():
                    dest_conn.execute(dest_table.insert(), insert_data)
                    
            print(f"  [SUCCESS] Finished migrating {table_name}.")

if __name__ == "__main__":
    print("Starting Data Migration...")
    try:
        migrate_data()
        print("\\n\\n[SUCCESS] ALL DATA MIGRATED SUCCESSFULLY!")
    except Exception as e:
        print(f"\\n[ERROR] Migration failed: {e}")
