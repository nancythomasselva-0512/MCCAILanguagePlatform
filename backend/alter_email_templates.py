import sys
from sqlalchemy import text
from app.core.database import engine

def run():
    print("Altering table email_templates...")
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE email_templates ADD COLUMN from_email VARCHAR(255);"))
            print("Added from_email")
        except Exception as e:
            print(f"Error adding from_email: {e}")
            
        try:
            conn.execute(text("ALTER TABLE email_templates ADD COLUMN reply_to VARCHAR(255);"))
            print("Added reply_to")
        except Exception as e:
            print(f"Error adding reply_to: {e}")
            
        try:
            conn.execute(text("ALTER TABLE email_templates ADD COLUMN is_enabled BOOLEAN DEFAULT TRUE;"))
            print("Added is_enabled")
        except Exception as e:
            print(f"Error adding is_enabled: {e}")
            
        try:
            conn.execute(text("ALTER TABLE email_templates ADD COLUMN updated_at TIMESTAMP;"))
            print("Added updated_at")
        except Exception as e:
            print(f"Error adding updated_at: {e}")
        
        conn.commit()
    print("Done!")

if __name__ == "__main__":
    run()
