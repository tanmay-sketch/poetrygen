# backend/main.py

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, Poem
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Route to handle the root path
@app.get("/")
def read_root():
    return {"message": "Welcome to the Poetry API"}

# Route to get all poems
@app.get("/api/poems")
def get_poems(db: Session = Depends(get_db)):
    poems = db.query(Poem).all()
    return poems

# Route to get a specific poem by ID
@app.get("/api/poem/{id}")
def get_poem(id: int, db: Session = Depends(get_db)):
    poem = db.query(Poem).filter(Poem.id == id).first()
    if not poem:
        raise HTTPException(status_code=404, detail="Poem not found")
    return poem

# Route to add a new poem
@app.post("/api/poems")
def add_poem(name: str, poem: str, db: Session = Depends(get_db)):
    new_poem = Poem(name=name, poem=poem)
    db.add(new_poem)
    db.commit()
    db.refresh(new_poem)
    return new_poem

@app.get("/api/test")
def get_test():
    return {"message": "Connection works"}