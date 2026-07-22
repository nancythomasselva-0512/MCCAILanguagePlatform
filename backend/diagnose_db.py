import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine
from app.core.config import settings
from app.models.models import User
from app.core.security import get_password_hash, verify_password

def diagnose():
    print(f"\n=== DATABASE URL ===")
    print(f"{settings.DATABASE_URL}")
    
    print(f"\n=== Checking DB Engine ===")
    print(f"Engine: {engine.url}")

    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"\n=== ALL USERS IN DATABASE ({len(users)} total) ===")
        for u in users:
            print(f"  id={u.id} | email={u.email} | role={u.role} | status={u.status} | hash={u.password_hash[:30]}...")
        
        print(f"\n=== Testing password verification ===")
        admin = db.query(User).filter(User.email == "aiadmin@gmail.com").first()
        if admin:
            result = verify_password("aiadmin123", admin.password_hash)
            print(f"  verify_password('aiadmin123', hash) = {result}")
        else:
            print("  User aiadmin@gmail.com NOT FOUND in DB!")

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    diagnose()
