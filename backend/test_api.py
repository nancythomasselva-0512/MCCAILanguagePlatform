import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.models import User
from app.core.security import create_access_token
import requests

def run_test():
    db = SessionLocal()
    # Find a superadmin user
    admin = db.query(User).filter(User.role == "super_admin").first()
    if not admin:
        print("No super_admin found")
        return
        
    token = create_access_token(subject=admin.id)
    
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"to_email": "test@example.com"}
    
    res = requests.post("http://localhost:8000/api/super-admin/smtp-settings/test", json=payload, headers=headers)
    print("Status:", res.status_code)
    print("Response:", res.json())

if __name__ == "__main__":
    run_test()
