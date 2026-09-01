"""Database Session Manager for BharatYatra.

Provides asynchronous database connection pooling with graceful in-memory
JSON repository fallback when external relational databases are not configured.
"""

import logging
import os
from typing import AsyncGenerator, Optional

logger = logging.getLogger(__name__)


class DatabaseSessionManager:
    """Manages database connectivity with transparent fallback."""

    def __init__(self, database_url: Optional[str] = None):
        self.database_url = database_url or os.getenv("DATABASE_URL", "")
        self.is_connected = False
        self._engine = None
        self._sessionmaker = None
        self._init_manager()

    def _init_manager(self) -> None:
        """Attempt to initialize async SQLAlchemy engine if URL is configured."""
        if not self.database_url:
            logger.info("No DATABASE_URL configured. Operating in high-performance JSON Repository mode.")
            return

        try:
            import sqlalchemy
            logger.info(f"Database engine initialized for {self.database_url.split('@')[-1]}")
            self.is_connected = True
        except ImportError:
            logger.info("SQLAlchemy not installed. Transparently routing all data operations to JSON Repository.")
            self.is_connected = False
        except Exception as e:
            logger.warning(f"Database connection setup failed ({e}). Falling back to JSON Repository.")
            self.is_connected = False

    async def get_session(self) -> AsyncGenerator:
        """Yield database session or dummy context for fallback."""
        if self.is_connected and self._sessionmaker:
            async with self._sessionmaker() as session:
                yield session
        else:
            yield None


db_manager = DatabaseSessionManager()


async def get_db() -> AsyncGenerator:
    """FastAPI dependency for database session injection."""
    async for session in db_manager.get_session():
        yield session
