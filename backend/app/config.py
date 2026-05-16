import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


@lru_cache
def get_settings():
    return Settings()


class Settings:
    google_client_id: str = os.getenv("GOOGLE_CLIENT_ID", "")
    google_client_secret: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    frontend_url: str = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    backend_url: str = os.getenv("BACKEND_URL", "http://localhost:8000").rstrip("/")

    @property
    def google_redirect_uri(self) -> str:
        return f"{self.backend_url}/auth/google/callback"
