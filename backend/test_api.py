import requests
import json
import sys
from app.core.database import SessionLocal
from app.models.models import User, SubscriptionPlan
from app.core.security import create_access_token

db = SessionLocal()
user = db.query(User).filter(User.email == "aachinancy@gmail.com").first()
if not user:
    print("User not found!")
    sys.exit(1)
token = create_access_token(user.id)

headers = {"Authorization": f"Bearer {token}"}
base_url = "http://127.0.0.1:8000/api"

print("GET /tenant/overview")
res1 = requests.get(f"{base_url}/billing/tenant/overview", headers=headers)
print("Status:", res1.status_code)
if res1.status_code == 200:
    plan = db.query(SubscriptionPlan).first()
    print("POST /payments/create-session for plan:", plan.id)
    res2 = requests.post(f"{base_url}/billing/payments/create-session", headers=headers, json={
        "plan_id": str(plan.id),
        "billing_cycle": "monthly"
    })
    print("Status:", res2.status_code)
    try:
        print("Response:", res2.json())
    except:
        print("Text:", res2.text)
else:
    try:
        print("GET Failed Response:", res1.json())
    except:
        pass

