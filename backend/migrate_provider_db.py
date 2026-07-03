import logging
from sqlalchemy import text
from app.core.database import engine, Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("migration")

def run_migration():
    logger.info("Starting database migration for Provider Manager...")
    
    # 1. Create any missing tables (like provider_logs)
    try:
        logger.info("Creating any missing tables using metadata...")
        Base.metadata.create_all(bind=engine)
        logger.info("Tables checked/created successfully.")
    except Exception as e:
        logger.error(f"Error during metadata.create_all: {e}")
        raise e

    # 2. Add missing columns to provider_configurations
    logger.info("Checking/adding missing columns to provider_configurations table...")
    queries = [
        "ALTER TABLE provider_configurations ADD COLUMN IF NOT EXISTS circuit_breaker_failures INTEGER DEFAULT 0;",
        "ALTER TABLE provider_configurations ADD COLUMN IF NOT EXISTS circuit_breaker_opened_at TIMESTAMP WITHOUT TIME ZONE NULL;"
    ]
    
    with engine.begin() as conn:
        for q in queries:
            try:
                conn.execute(text(q))
                logger.info(f"Executed: {q.strip()}")
            except Exception as e:
                logger.error(f"Error executing query '{q}': {e}")
                raise e

    logger.info("Migration completed successfully!")

if __name__ == "__main__":
    run_migration()
