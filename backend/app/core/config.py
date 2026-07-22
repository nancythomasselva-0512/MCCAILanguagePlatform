import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "MCC AI Multi-Tenant SaaS Platform"
    API_V1_STR: str = "/api"
    BACKEND_URL: str = "http://localhost:8000"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174"
    
    # Security
    SECRET_KEY: str = "super-secret-mcc-saas-platform-jwt-key"
    ENCRYPTION_KEY: str = "t-Wd93Ym3uX2pLw_Kz7U8G1e5zP_y7q8W2-v8F5tZ84="  # 32-byte URL safe base64 key
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 Hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # PostgreSQL Configuration
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres123"
    DB_NAME: str = "mcc_saas"
    
    # If DATABASE_URL is provided in .env, it will be used instead of building it
    DATABASE_URL: str | None = None

    @property
    def get_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        import os
        url = os.environ.get("DATABASE_URL")
        if url:
            return url
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

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
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
