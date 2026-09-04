import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.app.db.session import engine, SessionLocal, Base
from backend.app.models.entities import User, Favorite, Trip, Report
from backend.app.services.tourism_service import tourism_service

def seed_database():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if default admin exists
        admin = db.query(User).filter(User.id == "default_user").first()
        if not admin:
            admin = User(
                id="default_user",
                email="admin@yatraverse.in",
                name="Bharat Yatri Admin",
                password_hash="mock_hash"
            )
            db.add(admin)
            print("Created default user: admin@yatraverse.in")

        db.commit()
        print("Database seeded successfully with persistent schema.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
