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
        # 1. Super Admin
        sa_email = "superadmin@gmail.com"
        sa_pass = "aisuperadmin123"
        user_sa = db.query(User).filter(User.email.in_(["superadmin@gmail.com", "aiadmin@gmail.com"])).first()
        if user_sa:
            user_sa.email = sa_email
            user_sa.password_hash = get_password_hash(sa_pass)
            user_sa.role = "super_admin"
            user_sa.status = "active"
        else:
            db.add(User(
                name="Platform Super Admin",
                email=sa_email,
                password_hash=get_password_hash(sa_pass),
                role="super_admin",
                status="active"
            ))

        # 2. Workspace Admin
        wa_email = "admin@gmail.com"
        wa_pass = "aiadmin123"
        user_wa = db.query(User).filter(User.email.in_(["admin@gmail.com", "workspaceadmin@gmail.com", "admin@workspace.com"])).first()
        if user_wa:
            user_wa.email = wa_email
            user_wa.password_hash = get_password_hash(wa_pass)
            user_wa.role = "tenant_admin"
            user_wa.status = "active"
        else:
            db.add(User(
                name="Workspace Manager",
                email=wa_email,
                password_hash=get_password_hash(wa_pass),
                role="tenant_admin",
                status="active"
            ))

        db.commit()
        print(f"Successfully seeded Super Admin ({sa_email}) and Admin ({wa_email})!")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Connecting to database to reset admin credentials...")
    force_reset_admin()
