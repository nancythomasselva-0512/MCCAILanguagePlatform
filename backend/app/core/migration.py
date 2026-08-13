import logging
from sqlalchemy import inspect, text
from sqlalchemy.types import Integer, Float, Boolean, String, Text, DateTime, Date, Numeric

logger = logging.getLogger("mcc-ai-saas-backend")

def auto_migrate_db(engine, Base):
    """
    Automatically detects missing columns in existing database tables
    compared to the SQLAlchemy Base metadata models and adds them via ALTER TABLE.
    Works dynamically for SQLite, MySQL, PostgreSQL, SQL Server.
    """
    try:
        inspector = inspect(engine)
        existing_tables = set(inspector.get_table_names())
        db_dialect = engine.dialect.name.lower()

        logger.info("Running automatic database schema column synchronization...")
        migrated_count = 0

        for table_name, table in Base.metadata.tables.items():
            if table_name not in existing_tables:
                continue

            existing_columns = {col["name"]: col for col in inspector.get_columns(table_name)}
            
            for column in table.columns:
                col_name = column.name
                if col_name in existing_columns:
                    continue

                # Column missing in actual DB table! Add it via ALTER TABLE
                col_type = column.type.compile(engine.dialect)
                
                # Determine sensible DEFAULT clause
                default_str = ""
                if column.default is not None and hasattr(column.default, "arg"):
                    arg = column.default.arg
                    if isinstance(arg, (int, float)):
                        default_str = f" DEFAULT {arg}"
                    elif isinstance(arg, bool):
                        default_str = f" DEFAULT {1 if arg else 0}" if ("sqlite" in db_dialect or "mysql" in db_dialect) else f" DEFAULT {'TRUE' if arg else 'FALSE'}"
                    elif isinstance(arg, str):
                        default_str = f" DEFAULT '{arg}'"
                elif column.nullable:
                    default_str = " DEFAULT NULL"
                else:
                    if isinstance(column.type, Integer):
                        default_str = " DEFAULT 0"
                    elif isinstance(column.type, (Float, Numeric)):
                        default_str = " DEFAULT 0.0"
                    elif isinstance(column.type, Boolean):
                        default_str = " DEFAULT 0" if ("sqlite" in db_dialect or "mysql" in db_dialect) else " DEFAULT FALSE"
                    elif isinstance(column.type, (String, Text)):
                        default_str = " DEFAULT ''" if "sqlite" in db_dialect else " DEFAULT NULL"
                    else:
                        default_str = " DEFAULT NULL"

                sql = f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type}{default_str}"
                logger.info(f"Auto-migrating DB: Executing '{sql}'")
                
                with engine.connect() as conn:
                    conn.execute(text(sql))
                    if hasattr(conn, "commit"):
                        conn.commit()
                migrated_count += 1

        if migrated_count > 0:
            logger.info(f"Auto-migration successfully added {migrated_count} missing column(s).")
        else:
            logger.info("Auto-migration complete: all table schemas are up-to-date.")
    except Exception as e:
        logger.warning(f"Auto-migration check notice: {e}")
