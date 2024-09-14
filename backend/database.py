# backend/database.py

from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database file path
SQLALCHEMY_DATABASE_URL = "sqlite:///./poems.db"

# Create the SQLite engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session maker for database interaction
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the Base class for SQLAlchemy models
Base = declarative_base()

# Define the Poem model
class Poem(Base):
    __tablename__ = "poems"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)  # Title of the poem
    poem = Column(Text)  # Entire poem stored as a single text block

# Create the database and tables
Base.metadata.create_all(bind=engine)