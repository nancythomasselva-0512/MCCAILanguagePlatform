import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "MCC AI Multi-Tenant SaaS Platform"
    API_V1_STR: str = "/api"
    BACKEND_URL: str = "http://localhost:8000"
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174"
    
    # Security
    SECRET_KEY: str = "super-secret-mcc-saas-platform-jwt-key"
    ENCRYPTION_KEY: str = "t-Wd93Ym3uX2pLw_Kz7U8G1e5zP_y7q8W2-v8F5tZ84="  # 32-byte URL safe base64 key
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 Hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # Database Configuration (MySQL / PostgreSQL / SQLite)
    DB_TYPE: str = "sqlite"  # sqlite, mysql, postgresql
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "mcc_saas"
    
    # If DATABASE_URL is provided in .env, it will be used instead of building it
    DATABASE_URL: str | None = None

    @property
    def get_database_url(self) -> str:
        url = self.DATABASE_URL or os.environ.get("DATABASE_URL")
        if url:
            if url.startswith("mysql://"):
                url = url.replace("mysql://", "mysql+pymysql://", 1)
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+psycopg2://", 1)
            if url.startswith("sqlite") or url.startswith("mysql") or url.startswith("postgresql"):
                return url
            if url.startswith("file:"):
                clean_path = url.replace("file:", "").lstrip("./")
                candidates = [
                    clean_path,
                    os.path.join("..", clean_path),
                    os.path.join("..", "prisma", "dev.db"),
                    os.path.join("prisma", "dev.db"),
                    "dev.db"
                ]
                for cand in candidates:
                    if os.path.exists(cand):
                        return f"sqlite:///{os.path.abspath(cand)}"
                return f"sqlite:///{clean_path}"

        db_type = (os.environ.get("DB_TYPE") or self.DB_TYPE).lower()
        if db_type == "mysql":
            user = os.environ.get("DB_USER") or self.DB_USER
            password = os.environ.get("DB_PASSWORD") or self.DB_PASSWORD
            host = os.environ.get("DB_HOST") or self.DB_HOST
            port = os.environ.get("DB_PORT") or self.DB_PORT
            dbname = os.environ.get("DB_NAME") or self.DB_NAME
            pwd_part = f":{password}" if password else ""
            return f"mysql+pymysql://{user}{pwd_part}@{host}:{port}/{dbname}?charset=utf8mb4"

        if db_type in ("postgresql", "postgres"):
            user = os.environ.get("DB_USER") or self.DB_USER
            password = os.environ.get("DB_PASSWORD") or self.DB_PASSWORD
            host = os.environ.get("DB_HOST") or self.DB_HOST
            port = os.environ.get("DB_PORT") or self.DB_PORT
            dbname = os.environ.get("DB_NAME") or self.DB_NAME
            pwd_part = f":{password}" if password else ""
            return f"postgresql+psycopg2://{user}{pwd_part}@{host}:{port}/{dbname}"

        # Default fallback to SQLite dev.db
        db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../prisma/dev.db"))
        if os.path.exists(db_path):
            return f"sqlite:///{db_path}"
        return f"sqlite:///./mcc_saas.db"

    # Redis for rate limiting / session storage
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # SMTP Settings
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_SENDER: str = ""
    
    # Super Admin Settings
    SUPER_ADMIN_EMAIL: str | None = None
    SUPER_ADMIN_PASSWORD: str | None = None
    
    # Provider Keys
    OPENAI_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None
    NEMOTRON_API_KEY: str | None = None
    OPENROUTER_API_KEY: str | None = None
    ELEVENLABS_API_KEY: str | None = None
    DEEPGRAM_API_KEY: str | None = None
    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None

    model_config = SettingsConfigDict(
        env_file=[".env", "../.env"],
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
