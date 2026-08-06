from app.core.database import SessionLocal
from app.models.models import EmailTemplate

db = SessionLocal()
try:
    print("Deleting existing generic templates...")
    db.query(EmailTemplate).filter(EmailTemplate.tenant_id == None).delete()
    db.commit()
    print("Deleted successfully!")
except Exception as e:
    print("Error:", e)
finally:
    db.close()
