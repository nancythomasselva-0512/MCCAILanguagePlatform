import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE smtp_settings ADD COLUMN from_name VARCHAR(255);"))
            print("Added from_name")
        except Exception as e:
            print("from_name might already exist")
            
        try:
            conn.execute(text("ALTER TABLE smtp_settings ADD COLUMN encryption_type VARCHAR(20) DEFAULT 'TLS';"))
            print("Added encryption_type")
        except Exception as e:
            print("encryption_type might already exist")
            
        try:
            conn.execute(text("ALTER TABLE smtp_settings ADD COLUMN connection_timeout INTEGER DEFAULT 10;"))
            print("Added connection_timeout")
        except Exception as e:
            print("connection_timeout might already exist")
            
        try:
            conn.execute(text("ALTER TABLE smtp_settings ADD COLUMN enable_authentication BOOLEAN DEFAULT TRUE;"))
            print("Added enable_authentication")
        except Exception as e:
            print("enable_authentication might already exist")
            
        try:
            conn.execute(text("ALTER TABLE smtp_settings ADD COLUMN is_enabled BOOLEAN DEFAULT TRUE;"))
            print("Added is_enabled")
        except Exception as e:
            print("is_enabled might already exist")
        
        conn.commit()

if __name__ == "__main__":
    migrate()
    print("Migration completed.")
