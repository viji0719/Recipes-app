"""
database.py - SQLite database setup using SQLAlchemy
"""
import math
import json
from sqlalchemy import create_engine, Column, Integer, String, Float, Text
from sqlalchemy.orm import DeclarativeBase, Session
from sqlalchemy.types import JSON

DATABASE_URL = "sqlite:///./recipes.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


class Base(DeclarativeBase):
    pass


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cuisine = Column(String, index=True)
    title = Column(String, index=True)
    rating = Column(Float, nullable=True)
    prep_time = Column(Integer, nullable=True)
    cook_time = Column(Integer, nullable=True)
    total_time = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    nutrients = Column(JSON, nullable=True)
    serves = Column(String, nullable=True)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


def safe_float(val):
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return None
        return f
    except (TypeError, ValueError):
        return None


def safe_int(val):
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return None
        return int(f)
    except (TypeError, ValueError):
        return None


def init_db():
    Base.metadata.create_all(bind=engine)
    with Session(engine) as db:
        count = db.query(Recipe).count()
        if count > 0:
            print(f"Database already has {count} recipes. Skipping import.")
            return

        print("Loading recipes from JSON...")
        with open("recipes.json", "r") as f:
            data = json.load(f)

        records = []
        for key, item in data.items():
            recipe = Recipe(
                cuisine=item.get("cuisine"),
                title=item.get("title"),
                rating=safe_float(item.get("rating")),
                prep_time=safe_int(item.get("prep_time")),
                cook_time=safe_int(item.get("cook_time")),
                total_time=safe_int(item.get("total_time")),
                description=item.get("description"),
                nutrients=item.get("nutrients"),
                serves=item.get("serves"),
            )
            records.append(recipe)

        db.bulk_save_objects(records)
        db.commit()
        print(f"Imported {len(records)} recipes.")
