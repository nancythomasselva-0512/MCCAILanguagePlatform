import os
import sys

# Ensure the app module can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.models import User
from app.core.security import get_password_hash

def force_reset_admin():
    db = SessionLocal()
    try:
        email = "aiadmin@gmail.com"
        password = "aiadmin123"
        
        user = db.query(User).filter(User.email == email).first()
        
        if user:
            print(f"User {email} found. Resetting password...")
            user.password_hash = get_password_hash(password)
            user.role = "super_admin"
            user.status = "active"
            db.commit()
            print("Password reset successful!")
        else:
            print(f"User {email} not found. Creating new super admin...")
            new_admin = User(
                name="Platform Owner",
                email=email,
                password_hash=get_password_hash(password),
                role="super_admin",
                status="active"
            )
            db.add(new_admin)
            db.commit()
            print("Super admin created successfully!")
            
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Connecting to database to reset admin credentials...")
    force_reset_admin()
