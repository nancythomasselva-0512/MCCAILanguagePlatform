import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal
from app.models.models import SubscriptionPlan

db = SessionLocal()
try:
    free_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == "Free").first()
    if free_plan:
        free_plan.translation_limit = 10000000  # 10 Million characters per month
        db.commit()
        print(f"Updated Free plan to {free_plan.translation_limit} characters.")
    else:
        print("Free plan not found.")
except Exception as e:
    db.rollback()
    print(e)
finally:
    db.close()
