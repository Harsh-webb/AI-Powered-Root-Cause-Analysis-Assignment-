import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseModel):
    APP_NAME: str = "PharmaRCA - AI-Powered Root Cause Analysis"
    API_V1_PREFIX: str = "/api"
    
    # Database URL: default SQLite for instant out-of-the-box run,
    # or PostgreSQL e.g. postgresql://postgres:postgres@localhost:5432/rca_db
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./rca_database.db")
    
    # Groq AI settings
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
