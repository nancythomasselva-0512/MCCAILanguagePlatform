import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine
from app.models.models import Base

print("Creating missing tables...")
Base.metadata.create_all(bind=engine)
print("Done!")
