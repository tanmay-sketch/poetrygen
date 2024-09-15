# backend/main.py
import random
import requests

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

# Static route: Random
# get random poem
@app.get("/api/poem/random")
def get_random_poem(db: Session = Depends(get_db)):
    count = db.query(Poem).count()
    if count == 0:
        raise HTTPException(status_code=404, detail="No poems available")
    random_index = random.randint(0, count - 1)
    random_poem = db.query(Poem).offset(random_index).first()
    return random_poem

# Dynamic route: Get poem by ID
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

# @app.get("/api/test")
# def get_test():
    # return {"message": "Connection works"}

@app.get("/api/pivots/{poem_id}")
def get_pivots(poem_id: int, db: Session = Depends(get_db)):
    poem = db.query(Poem).filter(Poem.id == poem_id).first()
    if not poem:
        raise HTTPException(status_code=404, detail="Poem not found")
    
    lines = poem.poem.split('\n')  # Split the poem into lines
    total_lines = len(lines)
    
    # Generate random pivot line numbers
    num_pivots = random.randint(1, max(1, total_lines // 4))  # Choose between 1 and 25% of the total lines
    pivot_lines = sorted(random.sample(range(total_lines), num_pivots))  # Get random unique line numbers

    # Simulate returning a random poem ID (for now)
    next_poem_id = random.randint(1, db.query(Poem).count())  # Simulate with a random poem ID

    return {"next_poem_id": next_poem_id, "pivot_lines": pivot_lines}

@app.get("/api/pivots/{poem_id}")
def get_pivots(poem_id: int, db: Session = Depends(get_db)):
    poem = db.query(Poem).filter(Poem.id == poem_id).first()
    
    if not poem:
        raise HTTPException(status_code=404, detail="Poem not found")
    
    # Split the poem into lines
    lines = poem.poem.split('\n')
    total_lines = len(lines)
    
    # Generate random pivot line numbers
    num_pivots = random.randint(1, max(1, total_lines // 4))  # 1 to 25% of lines are pivots
    pivot_lines = sorted(random.sample(range(total_lines), num_pivots))  # Random unique lines
    
    # Simulate random poem ID for now (can be an actual poem ID later)
    next_poem_id = random.randint(1, db.query(Poem).count())

    # Construct the response to include pivots
    response_lines = []
    for i, line in enumerate(lines):
        response_line = {"text": line}
        if i in pivot_lines:
            response_line["isPivot"] = True
            response_line["nextPoemId"] = next_poem_id  # Can be any other poem id
            response_line["nextLineStart"] = 0  # Start from the beginning of the next poem for simplicity
        response_lines.append(response_line)

    return {"name": poem.name, "lines": response_lines, "id": poem.id}