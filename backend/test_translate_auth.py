import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.routers.tools import translate_text
from app.models.models import User, Tenant

def test():
    db = SessionLocal()
    user = db.query(User).first()
    tenant = db.query(Tenant).filter(Tenant.status == "active").first()
    
    # We will just print what the code would do.
    # Actually, we can just test the function directly!
    try:
        res = translate_text(text="Hello world", source_lang="English", target_lang="Spanish", db=db, user=user, tenant=tenant)
        print("Result:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
