import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "MCC AI Multi-Tenant SaaS Platform"
    API_V1_STR: str = "/api"
    
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

    @property
    def DATABASE_URL(self) -> str:
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
    
    # Provider Keys
    OPENAI_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None
    NEMOTRON_API_KEY: str | None = None
    OPENROUTER_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

settings = Settings()
