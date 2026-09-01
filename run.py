"""Root launcher for CodeNova-SIH-2026 Backend."""
import os
import sys
from pathlib import Path

# Ensure backend directory is on sys.path
BACKEND_DIR = Path(__file__).resolve().parent / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import uvicorn
from app.config import settings

if __name__ == "__main__":
    print("=" * 60)
    print(f"  CodeNova-SIH-2026 Intelligent Tourism Platform Backend")
    print(f"  Version: {settings.VERSION}")
    print(f"  Server: http://localhost:{settings.PORT}")
    print(f"  API Docs: http://localhost:{settings.PORT}/docs")
    print(f"  Health Check: http://localhost:{settings.PORT}/health")
    print("=" * 60)

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=settings.PORT,
        reload=settings.DEBUG,
    )
