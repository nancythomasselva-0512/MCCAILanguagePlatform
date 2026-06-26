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
    
    # SQL Server Configuration
    DB_SERVER: str = "JESUS-CHRIST\\SQLEXPRESS"
    DB_NAME: str = "mcc_saas"
    DB_DRIVER: str = "ODBC Driver 18 for SQL Server"

    @property
    def DATABASE_URL(self) -> str:
        driver = self.DB_DRIVER.replace(" ", "+")
        return (
            f"mssql+pyodbc://{self.DB_SERVER}/{self.DB_NAME}"
            f"?driver={driver}"
            f"&TrustServerCertificate=yes"
            f"&Trusted_Connection=yes"
        )

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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

settings = Settings()
