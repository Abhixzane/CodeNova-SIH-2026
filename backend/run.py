"""FastAPI Server Launcher.

Run this script to start the local development server:
    python backend/run.py
or (if inside backend directory):
    python run.py
"""

import os
import sys
from pathlib import Path
import uvicorn

# Ensure the backend directory is in the Python search path for clean module imports
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from app.config import settings

if __name__ == "__main__":
    print(f"Starting {settings.PROJECT_NAME} on http://{settings.HOST}:{settings.PORT}")
    print(f"Interactive Swagger Docs: http://localhost:{settings.PORT}/docs")
    print(f"Health Check: http://localhost:{settings.PORT}/health")

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
