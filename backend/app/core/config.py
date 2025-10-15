# backend/app/core/config.py
from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    S3_ENDPOINT_URL: Optional[str] = None
    S3_PUBLIC_ENDPOINT_URL: Optional[str] = None
    S3_ACCESS_KEY: str
    S3_SECRET_KEY: str
    S3_BUCKET: str
    SECRET_KEY: str = "change-me"

    class Config:
        env_file = ".env"

settings = Settings()
