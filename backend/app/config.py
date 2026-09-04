import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/database/yatraverse.db")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

PORT = int(os.getenv("FASTAPI_PORT", "8000"))
HOST = "0.0.0.0"
