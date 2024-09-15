from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

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

    # Relationship to the pivots table
    pivots = relationship("Pivot", back_populates="poem")

# Define the Pivot model
class Pivot(Base):
    __tablename__ = "pivots"

    id = Column(Integer, primary_key=True, index=True)
    poem_id = Column(Integer, ForeignKey("poems.id"), index=True)
    line_number = Column(Integer, nullable=False)
    next_poem_id = Column(Integer, nullable=False)
    next_line_number = Column(Integer, nullable=False)

    # Relationship to the Poem table
    poem = relationship("Poem", back_populates="pivots")

# Create the database and tables
Base.metadata.create_all(bind=engine)