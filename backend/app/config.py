from __future__ import annotations

import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self) -> None:
        self.allowed_origins = [
            origin.strip()
            for origin in os.getenv("FRONTEND_ORIGINS", "http://127.0.0.1:3000,http://localhost:3000").split(",")
            if origin.strip()
        ]
        self.max_upload_mb = int(os.getenv("MAX_UPLOAD_MB", "10"))
        self.max_columns = int(os.getenv("MAX_COLUMNS", "200"))
        self.request_timeout_seconds = int(os.getenv("REQUEST_TIMEOUT_SECONDS", "60"))
        self.rate_limit_requests = int(os.getenv("RATE_LIMIT_REQUESTS", "60"))
        self.rate_limit_window_seconds = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "60"))
        self.report_unlock_code = os.getenv("PAID_UNLOCK_CODE", "demo123")
        self.contact_email = os.getenv("CONTACT_EMAIL", "hello@reportdoctor.pk")
        self.supabase_url = os.getenv("SUPABASE_URL", "").rstrip("/")
        self.supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        self.easypaisa_number = os.getenv("EASYPAISA_NUMBER", "03100906678")
        self.ai_provider = os.getenv("AI_PROVIDER", "none").strip().lower()
        self.ai_api_key = os.getenv("AI_API_KEY", "")
        self.ai_model = os.getenv("AI_MODEL", "")

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_mb * 1024 * 1024


settings = Settings()
