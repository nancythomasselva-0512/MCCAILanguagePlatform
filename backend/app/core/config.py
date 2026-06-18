import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MCC AI Multi-Tenant SaaS Platform"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-mcc-saas-platform-jwt-key")
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "t-Wd93Ym3uX2pLw_Kz7U8G1e5zP_y7q8W2-v8F5tZ84=")  # 32-byte URL safe base64 key
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 Hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # PostgreSQL Configuration
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "mcc_saas")
    
    @property
    def DATABASE_URL(self) -> str:
        # Fallback to local SQLite file for development if Postgres server is localhost (meaning not running in Docker Compose)
        if self.POSTGRES_SERVER == "localhost":
            return "sqlite:///./mcc_saas.db"
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Redis for rate limiting / session storage
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))

    class Config:
        case_sensitive = True

settings = Settings()
