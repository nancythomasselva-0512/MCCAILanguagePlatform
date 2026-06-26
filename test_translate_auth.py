import os
import requests
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Setup DB connection
DB_URL = "mssql+pyodbc://sa:Admin123@localhost/master?driver=ODBC+Driver+17+for+SQL+Server"
engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Get the first tenant
result = db.execute(text("SELECT id, slug FROM tenants WHERE slug IS NOT NULL")).first()
tenant_id, tenant_slug = result[0], result[1]

# Get a user for that tenant
user = db.execute(text("SELECT email FROM users WHERE tenant_id = :tid"), {"tid": tenant_id}).first()
if not user:
    # Get any active user
    user = db.execute(text("SELECT email FROM users WHERE status = 'active'")).first()

user_email = user[0]

# Login to get token
r = requests.post("http://localhost:8000/api/auth/login", data={"username": user_email, "password": "admin123"})
token = r.json().get("access_token")
print(f"Got token: {token[:10]}...")

# Now test translation
headers = {
    "x-tenant-slug": tenant_slug,
    "Authorization": f"Bearer {token}"
}
data = {"text": "Hello world", "source_lang": "Auto Detect", "target_lang": "Spanish"}
r = requests.post("http://localhost:8000/api/tools/translate", data=data, headers=headers)
print("Translation Status:", r.status_code)
print("Translation Response:", r.text)

