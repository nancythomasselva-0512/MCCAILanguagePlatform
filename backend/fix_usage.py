"""
Quick fix script:
1. Reset all UsageTracking records (char counts back to 0)
2. Update Free plan translation_limit from 10000 → 500000
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.core.database import SessionLocal
from app.models.models import UsageTracking, SubscriptionPlan

db = SessionLocal()
try:
    # 1. Reset usage for all tenants
    updated = db.query(UsageTracking).all()
    for u in updated:
        u.translation_chars_used = 0
        u.audio_minutes_used = 0.0
        u.tts_chars_used = 0
        u.api_calls_used = 0
    print(f"Reset usage for {len(updated)} tenant(s)")

    # 2. Update Free plan to have a generous translation limit
    free_plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == "Free").first()
    if free_plan:
        old_limit = free_plan.translation_limit
        free_plan.translation_limit = 500000
        free_plan.tts_limit = 50000
        print(f"Free plan translation_limit: {old_limit} -> {free_plan.translation_limit}")
    else:
        print("Free plan not found in DB")

    db.commit()
    print("Done!")

except Exception as e:
    db.rollback()
    print(f"Error: {e}")
finally:
    db.close()
