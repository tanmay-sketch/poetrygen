# backend/populate_db.py

import csv
from sqlalchemy.orm import Session
from database import engine, Poem

# Open a session with the database
session = Session(bind=engine)

# Path to your CSV file
csv_file_path = "poems.csv"

# Open the CSV file and insert its contents into the database
with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    
    for row in reader:
        # Combine all lines into one poem text
        poem_lines = [row.get(f'Line{i}', None) for i in range(1, 251) if row.get(f'Line{i}', None)]
        full_poem = "\n".join(poem_lines)  # Join all non-empty lines
        
        # Insert into the database
        poem = Poem(
            name=row['Name'],  # Poem title
            poem=full_poem     # Full poem as one block of text
        )
        session.add(poem)

# Commit the transaction and close the session
session.commit()
session.close()

print("Poems successfully loaded from CSV into the database!")