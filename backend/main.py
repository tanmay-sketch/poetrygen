# backend/main.py
import random
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, Poem, Pivot, get_db
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

# Route to handle the root path
@app.get("/")
def read_root():
    return {"message": "Welcome to the Poetry API"}

# Route to get all poems
@app.get("/api/poems")
def get_poems(db: Session = Depends(get_db)):
    poems = db.query(Poem).all()
    return poems

# Static route: Get random poem
@app.get("/api/poem/random")
def get_random_poem(db: Session = Depends(get_db)):
    count = db.query(Poem).count()
    if count == 0:
        raise HTTPException(status_code=404, detail="No poems available")
    random_index = random.randint(0, count - 1)
    random_poem = db.query(Poem).offset(random_index).first()
    return random_poem

# Dynamic route: Get poem by ID
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

# Route to get pivots for a given poem ID
@app.get("/api/pivots/{poem_id}")
def get_pivots(poem_id: int, db: Session = Depends(get_db)):
    pivots = db.query(Pivot).filter(Pivot.poem_id == poem_id).all()

    if not pivots:
        raise HTTPException(status_code=404, detail="No pivots found for this poem.")

    # Collect pivots into a dictionary with line numbers as keys
    pivot_data = {}
    for pivot in pivots:
        if pivot.line_number not in pivot_data:
            pivot_data[pivot.line_number] = []
        pivot_data[pivot.line_number].append({
            "nextPoemId": pivot.next_poem_id,
            "nextLineStart": pivot.next_line_number
        })

    # Limit to 5 pivots (random if more than 5)
    if len(pivot_data) > 5:
        pivot_data = {key: pivot_data[key] for key in random.sample(list(pivot_data.keys()), 5)}

    return pivot_data